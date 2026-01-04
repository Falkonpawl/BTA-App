import { AppointmentType } from "../appointment";

export interface AppointmentLogEntry {
  id: string;
  patientId: string;
  type: AppointmentType;
  status: "scheduled" | "completed";
  date: Date;
  time: string;
  treatment?: {
    drugName: string;
    units: number;
    zones: string[];
  };
  photos?: string[];
  aiAssistantUsed?: boolean;
  note?: string;
}


