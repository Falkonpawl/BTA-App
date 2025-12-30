import { Appointment, AppointmentType } from "@/src/entities/appointment";

export const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "Иванов Олег",
    type: AppointmentType.REPEAT,
    date: new Date(),
    time: "12:00",
    imageUrl:
      "http://localhost:3845/assets/ce739be934177bcc1784def31431ae09e1b3c8c6.png",
    notifiedAt: new Date(2024, 10, 12, 9, 0),
    procedure: "Повторный приём",
  },
  {
    id: "2",
    patientName: "Кирпичникова Апполинария",
    type: AppointmentType.PRIMARY,
    date: new Date(2024, 9, 25),
    time: "12:00",
    imageUrl:
      "http://localhost:3845/assets/ce739be934177bcc1784def31431ae09e1b3c8c6.png",
    notifiedAt: new Date(2024, 10, 12, 9, 0),
    procedure: "Первичный приём",
  },
  {
    id: "3",
    patientName: "Иванов Олег",
    type: AppointmentType.CHECKUP,
    date: new Date(2024, 9, 25),
    time: "15:00",
    imageUrl:
      "http://localhost:3845/assets/4ebfd75cb595df08b489808caf51b7dad9d178b9.png",
    notifiedAt: new Date(2024, 10, 12, 9, 0),
    procedure: "Осмотр, коррекция",
  },
];

export const mockArchivedAppointments: Appointment[] = [
  {
    id: "4",
    patientName: "Иванов Олег",
    type: AppointmentType.REPEAT,
    date: new Date(2024, 9, 25),
    time: "12:00",
    imageUrl:
      "http://localhost:3845/assets/ce739be934177bcc1784def31431ae09e1b3c8c6.png",
    notifiedAt: new Date(2024, 10, 12, 9, 0),
    procedure: "Повторный приём",
  },
  {
    id: "5",
    patientName: "Кирпичникова Апполинария",
    type: AppointmentType.PRIMARY,
    date: new Date(2024, 9, 25),
    time: "12:00",
    imageUrl:
      "http://localhost:3845/assets/ce739be934177bcc1784def31431ae09e1b3c8c6.png",
    notifiedAt: new Date(2024, 10, 12, 9, 0),
    procedure: "Первичный приём",
  },
  {
    id: "6",
    patientName: "Иванов Олег",
    type: AppointmentType.CHECKUP,
    date: new Date(2024, 9, 25),
    time: "15:00",
    imageUrl:
      "http://localhost:3845/assets/4ebfd75cb595df08b489808caf51b7dad9d178b9.png",
    notifiedAt: new Date(2024, 10, 12, 9, 0),
    procedure: "Осмотр, коррекция",
  },
  {
    id: "7",
    patientName: "Иванов Олег",
    type: AppointmentType.REPEAT,
    date: new Date(2024, 9, 25),
    time: "12:00",
    imageUrl:
      "http://localhost:3845/assets/ce739be934177bcc1784def31431ae09e1b3c8c6.png",
    notifiedAt: new Date(2024, 10, 12, 9, 0),
    procedure: "Повторный приём",
  },
  {
    id: "8",
    patientName: "Кирпичникова Апполинария",
    type: AppointmentType.PRIMARY,
    date: new Date(2024, 9, 25),
    time: "12:00",
    imageUrl:
      "http://localhost:3845/assets/ce739be934177bcc1784def31431ae09e1b3c8c6.png",
    notifiedAt: new Date(2024, 10, 12, 9, 0),
    procedure: "Первичный приём",
  },
  {
    id: "9",
    patientName: "Иванов Олег",
    type: AppointmentType.CHECKUP,
    date: new Date(2024, 9, 25),
    time: "15:00",
    imageUrl:
      "http://localhost:3845/assets/4ebfd75cb595df08b489808caf51b7dad9d178b9.png",
    notifiedAt: new Date(2024, 10, 12, 9, 0),
    procedure: "Осмотр, коррекция",
  },
];
