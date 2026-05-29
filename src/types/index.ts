// Public-safe equipment type — never includes private fields
export interface PublicEquipment {
  id: string;
  slug: string;
  title: string;
  manufacturer: string;
  equipmentType: string;
  model: string;
  ratedPowerMW: number | null;
  fuelType: string | null;
  yearOfManufacture: number | null;
  operatingHours: number | null;
  condition: string;
  location: string | null;
  description: string;
  keySpecs: string;  // JSON: { key: string; value: string }[]
  images: string;    // JSON: string[]
  status: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Full equipment type for admin use — includes private fields
export interface AdminEquipment extends PublicEquipment {
  serialNumber: string | null;
  internalNotes: string | null;
  sellerFloorPrice: number | null;
  assetOwnerName: string | null;
  assetOwnerContact: string | null;
}

export interface KeySpec {
  key: string;
  value: string;
}

export interface CommunicationLogEntry {
  id: string;
  timestamp: string;
  author: string;
  note: string;
}

export interface PublicInquiry {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  message: string;
  equipmentId: string | null;
  status: string;
  priority: string;
  assignedTo: string | null;
  inquiryType?: string;
  offerAmount?: number | null;
  meetingTimezone?: string | null;
  communicationLog: string | null;
  internalNotes: string | null;
  createdAt: string;
  updatedAt: string;
  equipment?: Pick<PublicEquipment, "id" | "title" | "manufacturer" | "model"> | null;
}

export interface InquiryFormData {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  message: string;
  equipmentId?: string;
  equipmentTitle?: string;
}

export type EquipmentStatus = "Available" | "UnderNegotiation" | "Sold";
export type EquipmentCondition = "Excellent" | "Good" | "Fair" | "For Parts";
export type EquipmentType = "GasTurbine" | "SteamTurbine" | "GasEngine" | "Generator" | "Other";
export type InquiryStatus = "New" | "Contacted" | "MeetingScheduled" | "OfferMade" | "Closed" | "Lost";
export type InquiryPriority = "Low" | "Medium" | "High";
