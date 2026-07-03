export interface StepTemplate {
  id: string;
  title: string;
  description: string;
  helpText: string;
}

export interface WorkflowTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  categoryId?: string;
  criticalInfo?: string[];
  steps: StepTemplate[];
}

export interface ActiveStep extends StepTemplate {
  isCompleted: boolean;
}

export interface ActiveWorkflow {
  id: string;
  templateId: string;
  title: string;
  criticalInfo?: string[];
  startedAt: string;
  steps: ActiveStep[];
  status: 'in_progress' | 'completed';
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  date: string;
  isCompleted: boolean;
  type?: 'legal' | 'system' | 'manual';
  severity?: 'high' | 'medium' | 'low';
}

export interface DashboardStats {
  todayCompleted: number;
  ongoingWorkflows: number;
  pendingDocuments: number;
  totalPersonnel: number;
}

