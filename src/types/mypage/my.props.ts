export type Stage = {
    key: string;
    label: string;
};

export interface PlanCardProps {
    title: string;
    stages?: Stage[];
    currentStageIndex: number; // 0-based
    lastSavedAt?: string;
    businessPlanId: number;
    pdfUrl: string;
}
