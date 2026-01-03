"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDateTime } from "@/lib/utils";

/**
 * Patient Details Type
 */
interface PatientDetails {
  id: string;
  userId: string;
  birthDate: string;
  gender: string;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies?: string;
  currentMedication?: string;
  familyMedicalHistory?: string;
  pastMedicalHistory?: string;
  identificationType?: string;
  identificationNumber?: string;
  identificationDocumentUrl?: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

/**
 * PatientDetailsModal Component
 *
 * Modal dialog for viewing complete patient information.
 * Displays all patient details collected during registration.
 */
export const PatientDetailsModal = ({
  patient,
}: {
  patient: PatientDetails;
}) => {
  const [open, setOpen] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return formatDateTime(new Date(dateString)).date;
    } catch {
      return dateString;
    }
  };

  const formatGender = (gender: string) => {
    return gender.charAt(0) + gender.slice(1).toLowerCase();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center justify-center">
          <Eye className="h-4 w-4 text-dark-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription>
            Complete patient information collected during registration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <section className="space-y-3">
            <h3 className="text-16-semibold text-dark-900">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-12-regular text-dark-600 mb-1">Full Name</p>
                <p className="text-14-medium">{patient.user.name}</p>
              </div>
              <div>
                <p className="text-12-regular text-dark-600 mb-1">Email</p>
                <p className="text-14-medium">{patient.user.email}</p>
              </div>
              <div>
                <p className="text-12-regular text-dark-600 mb-1">Phone</p>
                <p className="text-14-medium">{patient.user.phone || "-"}</p>
              </div>
              <div>
                <p className="text-12-regular text-dark-600 mb-1">Date of Birth</p>
                <p className="text-14-medium">{formatDate(patient.birthDate)}</p>
              </div>
              <div>
                <p className="text-12-regular text-dark-600 mb-1">Gender</p>
                <p className="text-14-medium">{formatGender(patient.gender)}</p>
              </div>
              <div>
                <p className="text-12-regular text-dark-600 mb-1">Occupation</p>
                <p className="text-14-medium">{patient.occupation}</p>
              </div>
            </div>
            <div>
              <p className="text-12-regular text-dark-600 mb-1">Address</p>
              <p className="text-14-medium">{patient.address}</p>
            </div>
          </section>

          {/* Emergency Contact */}
          <section className="space-y-3">
            <h3 className="text-16-semibold text-dark-900">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-12-regular text-dark-600 mb-1">Contact Name</p>
                <p className="text-14-medium">{patient.emergencyContactName}</p>
              </div>
              <div>
                <p className="text-12-regular text-dark-600 mb-1">Contact Number</p>
                <p className="text-14-medium">{patient.emergencyContactNumber}</p>
              </div>
            </div>
          </section>

          {/* Medical Information */}
          <section className="space-y-3">
            <h3 className="text-16-semibold text-dark-900">Medical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-12-regular text-dark-600 mb-1">Primary Physician</p>
                <p className="text-14-medium">{patient.primaryPhysician}</p>
              </div>
              <div>
                <p className="text-12-regular text-dark-600 mb-1">Allergies</p>
                <p className="text-14-medium">{patient.allergies || "None reported"}</p>
              </div>
            </div>
            <div>
              <p className="text-12-regular text-dark-600 mb-1">Current Medication</p>
              <p className="text-14-medium">{patient.currentMedication || "None reported"}</p>
            </div>
            <div>
              <p className="text-12-regular text-dark-600 mb-1">Family Medical History</p>
              <p className="text-14-medium">{patient.familyMedicalHistory || "None reported"}</p>
            </div>
            <div>
              <p className="text-12-regular text-dark-600 mb-1">Past Medical History</p>
              <p className="text-14-medium">{patient.pastMedicalHistory || "None reported"}</p>
            </div>
          </section>

          {/* Insurance Information */}
          <section className="space-y-3">
            <h3 className="text-16-semibold text-dark-900">Insurance Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-12-regular text-dark-600 mb-1">Insurance Provider</p>
                <p className="text-14-medium">{patient.insuranceProvider}</p>
              </div>
              <div>
                <p className="text-12-regular text-dark-600 mb-1">Policy Number</p>
                <p className="text-14-medium">{patient.insurancePolicyNumber}</p>
              </div>
            </div>
          </section>

          {/* Identification */}
          {(patient.identificationType || patient.identificationNumber) && (
            <section className="space-y-3">
              <h3 className="text-16-semibold text-dark-900">Identification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patient.identificationType && (
                  <div>
                    <p className="text-12-regular text-dark-600 mb-1">ID Type</p>
                    <p className="text-14-medium">{patient.identificationType}</p>
                  </div>
                )}
                {patient.identificationNumber && (
                  <div>
                    <p className="text-12-regular text-dark-600 mb-1">ID Number</p>
                    <p className="text-14-medium">{patient.identificationNumber}</p>
                  </div>
                )}
              </div>
              {patient.identificationDocumentUrl && (
                <div>
                  <p className="text-12-regular text-dark-600 mb-2">ID Document</p>
                  <div className="relative w-full max-w-md">
                    <Image
                      src={patient.identificationDocumentUrl}
                      alt="Identification Document"
                      width={500}
                      height={300}
                      className="rounded-lg border border-dark-400 object-contain"
                    />
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Actions */}
          <div className="flex justify-end pt-4 border-t border-dark-400">
            <Button onClick={() => setOpen(false)} className="shad-primary-btn">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

