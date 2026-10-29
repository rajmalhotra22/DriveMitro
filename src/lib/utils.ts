import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(rupees: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

export function paiseToRupees(paise: number): number {
  return Math.round(paise / 100);
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function formatDate(dateStringOrObj: string | Date): string {
  try {
    const d = typeof dateStringOrObj === "string" ? new Date(dateStringOrObj) : dateStringOrObj;
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return String(dateStringOrObj);
  }
}

export function formatDateTime(dateStringOrObj: string | Date): string {
  try {
    const d = typeof dateStringOrObj === "string" ? new Date(dateStringOrObj) : dateStringOrObj;
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  } catch {
    return String(dateStringOrObj);
  }
}

export function generateBookingRef(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `DM-PAT-${randomNum}`;
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}
