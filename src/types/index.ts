export type UserRole = "customer" | "driver" | "admin";

export type UserStatus = "active" | "suspended";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash?: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type VerificationStatus =
  | "not_submitted"
  | "pending"
  | "approved"
  | "rejected"
  | "resubmission_required";

export interface DriverProfile {
  id: string;
  userId: string;
  displayName: string;
  phone: string;
  bio: string;
  yearsExperience: number;
  city: string;
  serviceAreas: string[];
  languages: string[];
  vehiclePreferences: string[];
  skills: string[];
  baseRateHourly: number;
  baseRateFullDay: number;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  verificationStatus: VerificationStatus;
  badge?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DriverVerificationRecord {
  id: string;
  driverId: string;
  licenseNumber: string;
  licenseExpiry: string;
  idProofType: string;
  status: VerificationStatus;
  adminNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewerId?: string;
}

export type TripType =
  | "hourly"
  | "half_day"
  | "full_day"
  | "outstation"
  | "airport"
  | "recurring";

export type BookingStatus =
  | "requested"
  | "assigned"
  | "en_route"
  | "arrived"
  | "trip_started"
  | "completed"
  | "cancelled";

export type PaymentStatus = "pending" | "paid_cash" | "demo_paid" | "refunded";

export type PaymentMethod = "cash_on_trip" | "demo_online";

export interface PriceBreakdown {
  baseFare: number;
  durationFare: number;
  lateNightSurcharge: number;
  waitingFare: number;
  outstationAllowance: number;
  platformFee: number;
  gst: number;
  totalAmountPaise: number;
  totalAmountRupees: number;
}

export interface Booking {
  id: string;
  bookingRef: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  driverId?: string;
  preferredDriverId?: string;
  driverName?: string;
  driverPhone?: string;
  tripType: TripType;
  pickupLocation: string;
  destinationLocation?: string;
  pickupDate: string;
  pickupTime: string;
  durationHours: number;
  transmissionPreference?: "Manual" | "Automatic" | "Any";
  carType?: string;
  passengerCount?: number;
  specialInstructions?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  priceBreakdown: PriceBreakdown;
  cancellationReason?: string;
  cancellationFee?: number;
  supportNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingStatusHistory {
  id: string;
  bookingId: string;
  fromStatus: BookingStatus;
  toStatus: BookingStatus;
  updatedBy: string;
  role: UserRole;
  timestamp: string;
  note?: string;
}

export interface PricingConfiguration {
  id: string;
  serviceRates: {
    hourlyRate: number;
    minHoursHourly: number;
    halfDayRate: number;
    halfDayHours: number;
    fullDayRate: number;
    fullDayHours: number;
    outstationDailyRate: number;
    airportTransferFlatRate: number;
    recurringMonthlyBase: number;
  };
  surcharges: {
    nightSurchargePercentage: number;
    nightHoursStart: string;
    nightHoursEnd: string;
    outstationDriverFoodAllowancePerDay: number;
  };
  platformFeePercent: number;
  gstPercent: number;
  cancellationFeeRupees: number;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  driverId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  isModerated: boolean;
  status: "approved" | "flagged" | "hidden";
  createdAt: string;
}

export interface FavoriteDriver {
  id: string;
  customerId: string;
  driverId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "booking" | "system" | "verification" | "driver";
  read: boolean;
  linkUrl?: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userPhone: string;
  bookingRef?: string;
  subject: string;
  category: "booking" | "safety" | "driver" | "pricing" | "technical" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved";
  message: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  role: UserRole;
  targetType: string;
  targetId: string;
  details: string;
  timestamp: string;
}
