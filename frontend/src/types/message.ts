export type MessageStatus = "pending" | "validated" | "rejected" | "new";
export type Platform = "email" | "corporate" | "sms" | "linkedin" | "instagram" | "twitter" | "blog";

export class Message {
  id: string
  user_id: string
  platform: Platform
  intent: string
  generated: string
  message: string
  isTransfered: boolean = false
  piiScore: number | undefined = undefined
  piiMessage: string | undefined = undefined
  cosineScore: number | undefined = undefined
  levenshteinScore: number | undefined = undefined
  reliabilityScore: number | undefined = undefined
  needsValidation: boolean = true
  isValidated: boolean = false
  createdAt: Date = new Date()

  constructor(data: Partial<Message>) {
    Object.assign(this, data);
    if (data.createdAt) {
      this.createdAt = new Date(data.createdAt);
    }
  }

  get status(): MessageStatus {
    if (!this.isTransfered) return "new";
    if (this.isValidated) return "validated";
    if (this.needsValidation) return "pending";
    return "rejected";
  }

}

export interface MessageFilters {
  status?: MessageStatus;
  platform?: Platform;
  search?: string;
  minScore?: number;
  maxScore?: number;
}

export interface MessageStats {
  total: number;
  pending: number;
  validated: number;
  rejected: number;
  nonTransfered: number;
  averageValidated: number;
  averageRejected: number;
  averagePii: number;
  averageCosine: number;
  averageLevenshtein: number;
  averageScore: number;
}