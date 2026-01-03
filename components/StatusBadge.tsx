import clsx from "clsx";
import Image from "next/image";

import { StatusIcon } from "@/constants";

type Status = "scheduled" | "pending" | "cancelled" | "SCHEDULED" | "PENDING" | "CANCELLED";

/**
 * StatusBadge Component
 *
 * Displays appointment status with icon and colored text.
 * Used in data tables to show appointment status.
 */
export const StatusBadge = ({ status }: { status: Status | string }) => {
  // Normalize status to lowercase for StatusIcon lookup
  const normalizedStatus = typeof status === "string" 
    ? status.toLowerCase() as "scheduled" | "pending" | "cancelled"
    : "pending";
  
  // Safely get icon - ensure it's a string
  const statusIcon = StatusIcon[normalizedStatus];
  const iconSrc = typeof statusIcon === "string" ? statusIcon : null;

  return (
    <div
      className={clsx("status-badge", {
        "bg-green-600": normalizedStatus === "scheduled",
        "bg-blue-600": normalizedStatus === "pending",
        "bg-red-600": normalizedStatus === "cancelled",
      })}
    >
      {iconSrc && iconSrc.trim() !== "" && (
        <Image
          src={iconSrc}
          alt={`${normalizedStatus} status`}
          width={24}
          height={24}
          className="h-fit w-3"
        />
      )}
      <p
        className={clsx("text-12-semibold capitalize", {
          "text-green-500": normalizedStatus === "scheduled",
          "text-blue-500": normalizedStatus === "pending",
          "text-red-500": normalizedStatus === "cancelled",
        })}
      >
        {normalizedStatus}
      </p>
    </div>
  );
};

