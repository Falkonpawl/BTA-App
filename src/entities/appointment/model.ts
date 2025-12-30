export interface Appointment {
  id: string;
  patientName: string;
  type: AppointmentType;
  date: Date;
  time: string;
  imageUrl?: string;
  notifiedAt?: Date;
  procedure?: string;
}

export enum AppointmentType {
  PRIMARY = "primary",
  REPEAT = "repeat",
  CHECKUP = "checkup",
}

export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> = {
  [AppointmentType.PRIMARY]: "Первичный приём",
  [AppointmentType.REPEAT]: "Повторный приём",
  [AppointmentType.CHECKUP]: "Осмотр, коррекция",
};

export const APPOINTMENT_TYPE_VARIANTS: Record<
  AppointmentType,
  "primary" | "success" | "info"
> = {
  [AppointmentType.PRIMARY]: "success",
  [AppointmentType.REPEAT]: "primary",
  [AppointmentType.CHECKUP]: "info",
};

// Utility function to convert API Drive to Appointment
export function driveToAppointment(drive: any): Appointment {
  const user = drive.user;
  const patientName = user?.u_name || "Unknown Patient";

  // Parse datetime: "YYYY-MM-DD HH:mm:ss±HH:mm"
  const datetimeMatch = drive.b_start_datetime?.match(
    /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}):\d{2}/
  );

  const date = datetimeMatch ? new Date(datetimeMatch[1]) : new Date();
  const time = datetimeMatch ? datetimeMatch[2] : "00:00";

  // Determine appointment type from b_options
  const appointmentTypeStr = drive.b_options?.appointmentType || "primary";
  let type: AppointmentType;
  switch (appointmentTypeStr) {
    case "repeat":
      type = AppointmentType.REPEAT;
      break;
    case "checkup":
      type = AppointmentType.CHECKUP;
      break;
    default:
      type = AppointmentType.PRIMARY;
  }

  return {
    id: drive.b_id,
    patientName,
    type,
    date,
    time,
    imageUrl: user?.u_photo,
    procedure: drive.b_options?.procedure,
  };
}
