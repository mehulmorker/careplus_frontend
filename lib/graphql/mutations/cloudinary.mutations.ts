import { gql } from "@apollo/client";

/**
 * Upload Image Mutation
 *
 * Uploads an image to Cloudinary and returns the image URL.
 */
export const UPLOAD_IMAGE_MUTATION = gql`
  mutation UploadImage($input: UploadImageInput!) {
    uploadImage(input: $input) {
      success
      image {
        publicId
        url
        secureUrl
        width
        height
        format
        bytes
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

/**
 * Delete Image Mutation
 *
 * Deletes an image from Cloudinary.
 */
export const DELETE_IMAGE_MUTATION = gql`
  mutation DeleteImage($publicId: String!) {
    deleteImage(publicId: $publicId)
  }
`;

/**
 * Input type for uploading an image
 */
export interface UploadImageInput {
  file: string; // Base64 encoded file
  folder?: string;
  publicId?: string;
  transformation?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  };
}

/**
 * Response type for image upload
 */
export interface ImageUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

export interface ImageUploadPayload {
  success: boolean;
  image?: ImageUploadResult;
  errors: Array<{
    field?: string;
    message: string;
    code?: string;
  }>;
}

export interface UploadImageMutationData {
  uploadImage: ImageUploadPayload;
}

