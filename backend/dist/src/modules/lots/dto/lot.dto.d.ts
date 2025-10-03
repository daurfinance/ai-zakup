export declare class TenderDeadlinesDto {
    applicationStart: string;
    applicationEnd: string;
    executionStart: string;
    executionEnd: string;
    clarificationDeadline?: string;
}
export declare class TenderCriteriaDto {
    evaluationCriteria: string[];
    qualificationRequirements: string[];
    technicalRequirements: any;
    priceWeight: number;
    qualityWeight: number;
    timelineWeight: number;
    guaranteeRequired: boolean;
    guaranteeAmount?: number;
    advancePayment?: number;
    nationalRegime: boolean;
}
export declare class TenderDocsDto {
    technicalSpecification: string[];
    legalDocuments?: string[];
    additionalDocuments?: string[];
    templates?: string[];
}
export declare class CreateLotDto {
    title: string;
    description: string;
    type: string;
    method: string;
    budget: number;
    currency?: string;
    region: string;
    deadlines: TenderDeadlinesDto;
    criteria: TenderCriteriaDto;
    docs?: TenderDocsDto;
    lots?: any[];
    contactInfo?: any;
    deliveryTerms?: any;
    paymentTerms?: any;
}
export declare class UpdateLotDto {
    title?: string;
    description?: string;
    budget?: number;
    region?: string;
    deadlines?: TenderDeadlinesDto;
    criteria?: TenderCriteriaDto;
    docs?: TenderDocsDto;
    contactInfo?: any;
    deliveryTerms?: any;
    paymentTerms?: any;
}
export declare class PublishLotDto {
    createEscrow: boolean;
    escrowDeposit?: number;
    notifications?: string[];
}
export declare class LotFilterDto {
    search?: string;
    tenderNumber?: string;
    region?: string;
    method?: string;
    type?: string;
    minBudget?: number;
    maxBudget?: number;
    currency?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: string;
    skip?: number;
    take?: number;
}
export declare class CancelLotDto {
    reason: string;
}
