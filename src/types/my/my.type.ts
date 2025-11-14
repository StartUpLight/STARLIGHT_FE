export interface BusinessPlanItem {
    businessPlanId: number;
    title: string;
    lastSavedAt: string;
    planStatus: string;
}

export interface GetMyBusinessPlansResponse {
    result: 'SUCCESS';
    data: BusinessPlanItem[];
    error: {
        code: string;
        message: string;
    } | null;
}

