import fs from "fs";
import path from "path";
import {
  AuditLog,
  Booking,
  BookingStatus,
  BookingStatusHistory,
  DriverProfile,
  DriverVerificationRecord,
  FavoriteDriver,
  Notification,
  PricingConfiguration,
  Review,
  SupportTicket,
  User,
  VerificationStatus,
} from "@/types";
import {
  SEED_AUDIT_LOGS,
  SEED_BOOKINGS,
  SEED_DRIVERS,
  SEED_NOTIFICATIONS,
  SEED_REVIEWS,
  SEED_SUPPORT_TICKETS,
  SEED_USERS,
  SEED_VERIFICATION_RECORDS,
} from "./seedData";
import { DEFAULT_PRICING_CONFIG } from "../pricing/config";

interface DbState {
  users: User[];
  drivers: DriverProfile[];
  verificationRecords: DriverVerificationRecord[];
  bookings: Booking[];
  bookingHistory: BookingStatusHistory[];
  pricingConfig: PricingConfiguration;
  reviews: Review[];
  favorites: FavoriteDriver[];
  notifications: Notification[];
  supportTickets: SupportTicket[];
  auditLogs: AuditLog[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "store.json");

function getInitialState(): DbState {
  return {
    users: [...SEED_USERS],
    drivers: [...SEED_DRIVERS],
    verificationRecords: [...SEED_VERIFICATION_RECORDS],
    bookings: [...SEED_BOOKINGS],
    bookingHistory: [],
    pricingConfig: { ...DEFAULT_PRICING_CONFIG },
    reviews: [...SEED_REVIEWS],
    favorites: [
      {
        id: "fav_01",
        customerId: "user_customer_01",
        driverId: "drv_01",
        createdAt: "2026-10-25T19:30:00.000Z",
      },
    ],
    notifications: [...SEED_NOTIFICATIONS],
    supportTickets: [...SEED_SUPPORT_TICKETS],
    auditLogs: [...SEED_AUDIT_LOGS],
  };
}

// In-memory cache synced with file system
let memoryDb: DbState | null = null;

function loadDb(): DbState {
  if (memoryDb) {
    return memoryDb;
  }

  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      memoryDb = JSON.parse(raw);
      return memoryDb!;
    }
  } catch (err) {
    console.warn("[DriveMitro DB] Error reading local store file, reinitializing with seeds:", err);
  }

  memoryDb = getInitialState();
  saveDb(memoryDb);
  return memoryDb;
}

function saveDb(state: DbState): void {
  memoryDb = state;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("[DriveMitro DB] Failed to persist data locally:", err);
  }
}

export const dbStore = {
  isDemoMode: true,

  resetData(): void {
    const fresh = getInitialState();
    saveDb(fresh);
  },

  // USERS
  getUsers(): User[] {
    return loadDb().users;
  },

  getUserByEmail(email: string): User | undefined {
    return loadDb().users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  },

  getUserById(id: string): User | undefined {
    return loadDb().users.find((u) => u.id === id);
  },

  createUser(user: User): User {
    const db = loadDb();
    db.users.push(user);
    saveDb(db);
    return user;
  },

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const db = loadDb();
    const index = db.users.findIndex((u) => u.id === id);
    if (index === -1) return undefined;
    db.users[index] = {
      ...db.users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveDb(db);
    return db.users[index];
  },

  // DRIVERS
  getDrivers(): DriverProfile[] {
    return loadDb().drivers;
  },

  getDriverById(id: string): DriverProfile | undefined {
    return loadDb().drivers.find((d) => d.id === id || d.userId === id);
  },

  createDriverProfile(driver: DriverProfile): DriverProfile {
    const db = loadDb();
    db.drivers.push(driver);
    saveDb(db);
    return driver;
  },

  updateDriverProfile(
    id: string,
    updates: Partial<DriverProfile>
  ): DriverProfile | undefined {
    const db = loadDb();
    const index = db.drivers.findIndex((d) => d.id === id || d.userId === id);
    if (index === -1) return undefined;
    db.drivers[index] = {
      ...db.drivers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveDb(db);
    return db.drivers[index];
  },

  // VERIFICATION RECORDS
  getVerificationRecords(): DriverVerificationRecord[] {
    return loadDb().verificationRecords;
  },

  getVerificationByDriverId(
    driverId: string
  ): DriverVerificationRecord | undefined {
    return loadDb().verificationRecords.find((r) => r.driverId === driverId);
  },

  createVerificationRecord(
    record: DriverVerificationRecord
  ): DriverVerificationRecord {
    const db = loadDb();
    db.verificationRecords.push(record);
    saveDb(db);
    return record;
  },

  updateVerificationStatus(
    driverId: string,
    status: VerificationStatus,
    adminNotes?: string,
    reviewerId?: string
  ): DriverVerificationRecord | undefined {
    const db = loadDb();
    let rec = db.verificationRecords.find((r) => r.driverId === driverId);
    if (!rec) {
      rec = {
        id: `verif_${Date.now()}`,
        driverId,
        licenseNumber: "VERIF-DOC-SUBMITTED",
        licenseExpiry: "2035-01-01",
        idProofType: "Aadhaar + DL",
        status,
        submittedAt: new Date().toISOString(),
      };
      db.verificationRecords.push(rec);
    }
    rec.status = status;
    if (adminNotes) rec.adminNotes = adminNotes;
    if (reviewerId) rec.reviewerId = reviewerId;
    rec.reviewedAt = new Date().toISOString();

    // Sync driver profile verification status
    const driverIdx = db.drivers.findIndex(
      (d) => d.id === driverId || d.userId === driverId
    );
    if (driverIdx !== -1) {
      db.drivers[driverIdx].verificationStatus = status;
      if (status === "approved") {
        db.drivers[driverIdx].isAvailable = true;
        if (!db.drivers[driverIdx].badge || db.drivers[driverIdx].badge === "Verification Pending") {
          db.drivers[driverIdx].badge = "Verified Mitro";
        }
      } else if (status === "rejected") {
        db.drivers[driverIdx].isAvailable = false;
        db.drivers[driverIdx].badge = "Verification Rejected";
      }
    }

    saveDb(db);
    return rec;
  },

  // BOOKINGS
  getBookings(): Booking[] {
    return loadDb().bookings;
  },

  getBookingByRef(ref: string): Booking | undefined {
    return loadDb().bookings.find(
      (b) => b.bookingRef.toUpperCase() === ref.toUpperCase()
    );
  },

  getBookingById(id: string): Booking | undefined {
    return loadDb().bookings.find((b) => b.id === id || b.bookingRef === id);
  },

  getBookingsByCustomer(customerId: string): Booking[] {
    return loadDb()
      .bookings.filter((b) => b.customerId === customerId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  getBookingsByDriver(driverId: string): Booking[] {
    return loadDb()
      .bookings.filter((b) => b.driverId === driverId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  createBooking(booking: Booking): Booking {
    const db = loadDb();
    db.bookings.unshift(booking);

    // Initial status history
    db.bookingHistory.push({
      id: `hist_${Date.now()}`,
      bookingId: booking.id,
      fromStatus: "requested",
      toStatus: booking.status,
      updatedBy: booking.customerName,
      role: "customer",
      timestamp: new Date().toISOString(),
      note: "Booking request created by customer",
    });

    saveDb(db);
    return booking;
  },

  updateBooking(id: string, updates: Partial<Booking>): Booking | undefined {
    const db = loadDb();
    const index = db.bookings.findIndex(
      (b) => b.id === id || b.bookingRef === id
    );
    if (index === -1) return undefined;

    const previous = db.bookings[index];
    const updated = {
      ...previous,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    db.bookings[index] = updated;

    saveDb(db);
    return updated;
  },

  assignDriverToBooking(
    bookingId: string,
    driverId: string,
    adminId: string,
    adminName: string
  ): { success: boolean; message?: string; booking?: Booking } {
    const db = loadDb();
    const booking = db.bookings.find(
      (b) => b.id === bookingId || b.bookingRef === bookingId
    );
    if (!booking) {
      return { success: false, message: "Booking not found" };
    }

    const driver = db.drivers.find((d) => d.id === driverId);
    if (!driver) {
      return { success: false, message: "Driver not found" };
    }

    if (driver.verificationStatus !== "approved") {
      return {
        success: false,
        message: "Cannot assign driver: Driver verification is not approved.",
      };
    }

    // Check if driver is already committed to an overlapping booking
    const activeBooking = db.bookings.find(
      (b) =>
        b.driverId === driverId &&
        b.pickupDate === booking.pickupDate &&
        ["assigned", "en_route", "arrived", "trip_started"].includes(b.status) &&
        b.id !== booking.id
    );

    if (activeBooking) {
      return {
        success: false,
        message: `Driver ${driver.displayName} is already assigned to active booking ${activeBooking.bookingRef} on ${booking.pickupDate}.`,
      };
    }

    const oldStatus = booking.status;
    booking.driverId = driver.id;
    booking.driverName = driver.displayName;
    booking.driverPhone = driver.phone;
    booking.status = "assigned";
    booking.updatedAt = new Date().toISOString();

    db.bookingHistory.push({
      id: `hist_${Date.now()}`,
      bookingId: booking.id,
      fromStatus: oldStatus,
      toStatus: "assigned",
      updatedBy: adminName,
      role: "admin",
      timestamp: new Date().toISOString(),
      note: `Assigned verified driver ${driver.displayName}`,
    });

    // Notify customer
    db.notifications.unshift({
      id: `notif_${Date.now()}_cust`,
      userId: booking.customerId,
      title: "Driver Assigned!",
      message: `${driver.displayName} has been assigned to your booking ${booking.bookingRef}.`,
      type: "booking",
      read: false,
      linkUrl: `/dashboard/bookings/${booking.bookingRef}`,
      createdAt: new Date().toISOString(),
    });

    // Notify driver
    db.notifications.unshift({
      id: `notif_${Date.now()}_drv`,
      userId: driver.userId,
      title: "New Trip Assigned",
      message: `You have been assigned to trip ${booking.bookingRef} on ${booking.pickupDate}.`,
      type: "driver",
      read: false,
      linkUrl: `/driver/bookings`,
      createdAt: new Date().toISOString(),
    });

    saveDb(db);
    return { success: true, booking };
  },

  respondToDriverOffer(
    bookingId: string,
    driverId: string,
    driverName: string,
    accept: boolean
  ): { success: boolean; message?: string; booking?: Booking } {
    const db = loadDb();
    const booking = db.bookings.find(
      (item) => item.id === bookingId || item.bookingRef === bookingId
    );
    if (
      !booking ||
      booking.status !== "requested" ||
      booking.preferredDriverId !== driverId
    ) {
      return { success: false, message: "This trip offer is no longer available." };
    }

    const driver = db.drivers.find((item) => item.id === driverId);
    if (!driver || driver.verificationStatus !== "approved") {
      return { success: false, message: "Driver verification must be approved." };
    }

    if (!accept) {
      booking.preferredDriverId = undefined;
      booking.updatedAt = new Date().toISOString();
      saveDb(db);
      return { success: true, booking };
    }

    if (!driver.isAvailable) {
      return { success: false, message: "Set your availability before accepting a trip." };
    }

    const activeBooking = db.bookings.find(
      (item) =>
        item.driverId === driverId &&
        item.pickupDate === booking.pickupDate &&
        ["assigned", "en_route", "arrived", "trip_started"].includes(item.status)
    );
    if (activeBooking) {
      return { success: false, message: "You already have an active booking on that date." };
    }

    booking.driverId = driver.id;
    booking.driverName = driver.displayName;
    booking.driverPhone = driver.phone;
    booking.preferredDriverId = undefined;
    booking.status = "assigned";
    booking.updatedAt = new Date().toISOString();
    db.bookingHistory.push({
      id: `hist_${Date.now()}`,
      bookingId: booking.id,
      fromStatus: "requested",
      toStatus: "assigned",
      updatedBy: driverName,
      role: "driver",
      timestamp: new Date().toISOString(),
      note: "Driver accepted preferred-driver request",
    });
    db.notifications.unshift({
      id: `notif_${Date.now()}_offer_accepted`,
      userId: booking.customerId,
      title: "Driver Accepted Your Request",
      message: `${driver.displayName} accepted booking ${booking.bookingRef}.`,
      type: "booking",
      read: false,
      linkUrl: `/dashboard/bookings/${booking.bookingRef}`,
      createdAt: new Date().toISOString(),
    });

    saveDb(db);
    return { success: true, booking };
  },

  updateBookingStatus(
    bookingId: string,
    newStatus: BookingStatus,
    updatedBy: { id: string; name: string; role: "customer" | "driver" | "admin" },
    note?: string
  ): { success: boolean; message?: string; booking?: Booking } {
    const db = loadDb();
    const booking = db.bookings.find(
      (b) => b.id === bookingId || b.bookingRef === bookingId
    );
    if (!booking) {
      return { success: false, message: "Booking not found" };
    }

    const validTransitions: Record<BookingStatus, BookingStatus[]> = {
      requested: ["assigned", "cancelled"],
      assigned: ["en_route", "cancelled", "requested"],
      en_route: ["arrived", "cancelled"],
      arrived: ["trip_started", "cancelled"],
      trip_started: ["completed"],
      completed: [],
      cancelled: [],
    };

    // Admins can override, but for regular workflows enforce state machine
    if (
      updatedBy.role !== "admin" &&
      !validTransitions[booking.status]?.includes(newStatus)
    ) {
      return {
        success: false,
        message: `Invalid status transition from ${booking.status} to ${newStatus}.`,
      };
    }

    const oldStatus = booking.status;
    booking.status = newStatus;
    booking.updatedAt = new Date().toISOString();

    if (newStatus === "completed" && booking.paymentStatus === "pending") {
      booking.paymentStatus = "paid_cash";
    }

    db.bookingHistory.push({
      id: `hist_${Date.now()}`,
      bookingId: booking.id,
      fromStatus: oldStatus,
      toStatus: newStatus,
      updatedBy: updatedBy.name,
      role: updatedBy.role,
      timestamp: new Date().toISOString(),
      note: note || `Status changed from ${oldStatus} to ${newStatus}`,
    });

    saveDb(db);
    return { success: true, booking };
  },

  getBookingHistory(bookingId: string): BookingStatusHistory[] {
    return loadDb()
      .bookingHistory.filter((h) => h.bookingId === bookingId)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  },

  // PRICING CONFIG
  getPricingConfig(): PricingConfiguration {
    return loadDb().pricingConfig;
  },

  updatePricingConfig(
    updates: Partial<PricingConfiguration>,
    adminName: string
  ): PricingConfiguration {
    const db = loadDb();
    db.pricingConfig = {
      ...db.pricingConfig,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    db.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      action: "PRICING_UPDATED",
      performedBy: adminName,
      role: "admin",
      targetType: "PricingConfiguration",
      targetId: db.pricingConfig.id,
      details: "Updated platform pricing rates or surcharges",
      timestamp: new Date().toISOString(),
    });

    saveDb(db);
    return db.pricingConfig;
  },

  // REVIEWS
  getReviews(driverId?: string): Review[] {
    const reviews = loadDb().reviews;
    if (driverId) {
      return reviews.filter(
        (r) => r.driverId === driverId && r.status === "approved"
      );
    }
    return reviews;
  },

  createReview(review: Review): Review {
    const db = loadDb();
    db.reviews.unshift(review);

    // Update driver rating & review count
    const driver = db.drivers.find((d) => d.id === review.driverId);
    if (driver) {
      const driverApprovedReviews = db.reviews.filter(
        (r) => r.driverId === driver.id && r.status === "approved"
      );
      const totalScore = driverApprovedReviews.reduce(
        (sum, r) => sum + r.rating,
        0
      );
      driver.reviewCount = driverApprovedReviews.length;
      driver.rating =
        driver.reviewCount > 0
          ? parseFloat((totalScore / driver.reviewCount).toFixed(2))
          : 0;
    }

    saveDb(db);
    return review;
  },

  updateReviewStatus(
    reviewId: string,
    status: "approved" | "flagged" | "hidden"
  ): Review | undefined {
    const db = loadDb();
    const rev = db.reviews.find((r) => r.id === reviewId);
    if (!rev) return undefined;
    rev.status = status;
    rev.isModerated = true;
    saveDb(db);
    return rev;
  },

  // FAVORITES
  getFavorites(customerId: string): FavoriteDriver[] {
    return loadDb().favorites.filter((f) => f.customerId === customerId);
  },

  toggleFavorite(customerId: string, driverId: string): boolean {
    const db = loadDb();
    const existingIndex = db.favorites.findIndex(
      (f) => f.customerId === customerId && f.driverId === driverId
    );
    if (existingIndex > -1) {
      db.favorites.splice(existingIndex, 1);
      saveDb(db);
      return false; // Removed
    } else {
      db.favorites.push({
        id: `fav_${Date.now()}`,
        customerId,
        driverId,
        createdAt: new Date().toISOString(),
      });
      saveDb(db);
      return true; // Added
    }
  },

  // NOTIFICATIONS
  getNotifications(userId: string): Notification[] {
    return loadDb()
      .notifications.filter((n) => n.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  createNotification(notif: Notification): Notification {
    const db = loadDb();
    db.notifications.unshift(notif);
    saveDb(db);
    return notif;
  },

  markNotificationRead(id: string): void {
    const db = loadDb();
    const notif = db.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      saveDb(db);
    }
  },

  markAllNotificationsRead(userId: string): void {
    const db = loadDb();
    db.notifications.forEach((n) => {
      if (n.userId === userId) {
        n.read = true;
      }
    });
    saveDb(db);
  },

  // SUPPORT TICKETS
  getSupportTickets(userId?: string): SupportTicket[] {
    const tickets = loadDb().supportTickets;
    if (userId) {
      return tickets.filter((t) => t.userId === userId);
    }
    return tickets;
  },

  createSupportTicket(ticket: SupportTicket): SupportTicket {
    const db = loadDb();
    db.supportTickets.unshift(ticket);
    saveDb(db);
    return ticket;
  },

  updateSupportTicket(
    id: string,
    updates: Partial<SupportTicket>
  ): SupportTicket | undefined {
    const db = loadDb();
    const t = db.supportTickets.find((item) => item.id === id || item.ticketId === id);
    if (!t) return undefined;
    Object.assign(t, updates);
    t.updatedAt = new Date().toISOString();
    saveDb(db);
    return t;
  },

  // AUDIT LOGS
  getAuditLogs(): AuditLog[] {
    return loadDb()
      .auditLogs.slice()
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  },

  createAuditLog(log: AuditLog): void {
    const db = loadDb();
    db.auditLogs.unshift(log);
    saveDb(db);
  },
};
