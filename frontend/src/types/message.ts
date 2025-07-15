export type MessageStatus = "pending" | "validated" | "rejected" | "new";
export const PlatformList = [
    { value: "email", label: "Email" },
    { value: "corporate", label: "Message corporate - Slack - Teams - Invitation réunion..." },
    { value: "linkedin", label: "LinkedIn" },
    { value: "instagram", label: "Instagram" },
    { value: "twitter", label: "Twitter/ X" },
    { value: "sms", label: "Whatsapp - SMS - Line - Telegram..." },
] as const;
export type Platform = typeof PlatformList[number]["value"];

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

    constructor(data: any) {
        Object.assign(this, data);

        this.isTransfered = data.transferred_to_dataset
        this.needsValidation = data.needs_validation
        this.isValidated = data.validated
        this.piiScore = data.pii_factor
        this.piiMessage = data.pii_message
        this.cosineScore = data.similarity_cosine
        this.levenshteinScore = data.distance_levenshtein
        this.reliabilityScore = data.score_reliability

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