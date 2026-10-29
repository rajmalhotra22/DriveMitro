import React from "react";
import { Badge } from "./Badge";
import { BookingStatus, VerificationStatus } from "@/types";
import {
  Clock,
  UserCheck,
  Navigation,
  MapPin,
  PlayCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  switch (status) {
    case "requested":
      return (
        <Badge variant="warning" className="gap-1">
          <Clock className="w-3 h-3 animate-pulse" />
          Finding Driver
        </Badge>
      );
    case "assigned":
      return (
        <Badge variant="info" className="gap-1">
          <UserCheck className="w-3 h-3" />
          Driver Assigned
        </Badge>
      );
    case "en_route":
      return (
        <Badge variant="navy" className="gap-1">
          <Navigation className="w-3 h-3 animate-bounce" />
          Driver En Route
        </Badge>
      );
    case "arrived":
      return (
        <Badge variant="info" className="gap-1">
          <MapPin className="w-3 h-3" />
          Driver Arrived
        </Badge>
      );
    case "trip_started":
      return (
        <Badge variant="success" className="gap-1">
          <PlayCircle className="w-3 h-3" />
          Trip in Progress
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Completed
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="danger" className="gap-1">
          <XCircle className="w-3 h-3" />
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
}

export function DriverVerificationBadge({
  status,
}: {
  status: VerificationStatus;
}) {
  switch (status) {
    case "approved":
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Verified Chauffeur
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="warning" className="gap-1">
          <Clock className="w-3 h-3" />
          Verification Pending
        </Badge>
      );
    case "resubmission_required":
      return (
        <Badge variant="danger" className="gap-1">
          <AlertTriangle className="w-3 h-3" />
          Resubmission Required
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="danger" className="gap-1">
          <XCircle className="w-3 h-3" />
          Not Approved
        </Badge>
      );
    default:
      return (
        <Badge variant="neutral" className="gap-1">
          Not Submitted
        </Badge>
      );
  }
}
