"use client";

import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@apollo/client";

import { convertFileToUrl, convertFileToBase64 } from "@/lib/utils";
import {
  UPLOAD_IMAGE_MUTATION,
  UploadImageInput,
  UploadImageMutationData,
} from "@/lib/graphql/mutations/cloudinary.mutations";

type CloudinaryFileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
  onUploadComplete?: (imageUrl: string, publicId: string) => void;
  folder?: string;
  maxSize?: number; // in bytes
  acceptedFileTypes?: Record<string, string[]>;
};

/**
 * Cloudinary File Uploader Component
 *
 * Enhanced file uploader that:
 * 1. Allows drag and drop file selection
 * 2. Shows preview of selected file
 * 3. Automatically uploads to Cloudinary on file selection
 * 4. Returns Cloudinary URL and public ID via callback
 *
 * @param files - Currently selected files (for preview)
 * @param onChange - Callback when files are selected
 * @param onUploadComplete - Callback when upload to Cloudinary completes
 * @param folder - Cloudinary folder to upload to
 * @param maxSize - Maximum file size in bytes (default: 5MB)
 * @param acceptedFileTypes - Accepted file types (default: images)
 */
export const CloudinaryFileUploader = ({
  files,
  onChange,
  onUploadComplete,
  folder = "carepulse",
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedFileTypes = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".svg"],
  },
}: CloudinaryFileUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const [uploadImage] = useMutation<UploadImageMutationData>(UPLOAD_IMAGE_MUTATION);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      onChange([file]); // Update parent component

      // Upload to Cloudinary
      setIsUploading(true);
      setUploadError(null);

      try {
        // Convert file to base64
        const base64File = await convertFileToBase64(file);

        // Prepare upload input
        const input: UploadImageInput = {
          file: base64File,
          folder,
          transformation: {
            quality: "auto",
            format: "auto",
          },
        };

        // Upload to Cloudinary via GraphQL
        const { data } = await uploadImage({
          variables: { input },
        });

        if (data?.uploadImage.success && data.uploadImage.image) {
          const { secureUrl, publicId } = data.uploadImage.image;
          setUploadedImageUrl(secureUrl);

          // Notify parent component
          if (onUploadComplete) {
            onUploadComplete(secureUrl, publicId);
          }
        } else {
          const errorMessage =
            data?.uploadImage.errors?.[0]?.message ||
            "Failed to upload image";
          setUploadError(errorMessage);
        }
      } catch (error: any) {
        console.error("Upload error:", error);
        const errorMessage =
          error?.graphQLErrors?.[0]?.message ||
          error?.message ||
          "Failed to upload image";
        setUploadError(errorMessage);
      } finally {
        setIsUploading(false);
      }
    },
    [onChange, onUploadComplete, folder, uploadImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize,
    multiple: false,
  });

  // Determine which image to show
  const imageUrl = uploadedImageUrl || (files && files.length > 0 ? convertFileToUrl(files[0]) : null);

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`file-upload ${isDragActive ? "border-green-500" : ""} ${isUploading ? "opacity-50 cursor-wait" : ""}`}
      >
        <input {...getInputProps()} disabled={isUploading} />
        {imageUrl ? (
          <div className="relative w-full">
            <Image
              src={imageUrl}
              width={1000}
              height={1000}
              alt="uploaded image"
              className="max-h-[400px] overflow-hidden object-cover rounded-md"
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
                <p className="text-white text-sm">Uploading...</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <Image
              src="/assets/icons/upload.svg"
              width={40}
              height={40}
              alt="upload"
            />
            <div className="file-upload_label">
              <p className="text-14-regular">
                <span className="text-green-500">Click to upload </span>
                or drag and drop
              </p>
              <p className="text-12-regular">
                SVG, PNG, JPG or GIF (max. {Math.round(maxSize / 1024 / 1024)}MB)
              </p>
            </div>
          </>
        )}
      </div>

      {/* Upload Error */}
      {uploadError && (
        <div className="rounded-md bg-red-500/10 p-3 text-red-500 text-sm">
          {uploadError}
        </div>
      )}

      {/* Upload Success */}
      {uploadedImageUrl && !isUploading && (
        <div className="rounded-md bg-green-500/10 p-3 text-green-500 text-sm">
          ✓ Image uploaded successfully
        </div>
      )}
    </div>
  );
};

export default CloudinaryFileUploader;

