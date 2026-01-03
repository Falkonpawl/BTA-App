import { Appointment, AppointmentType } from "@/src/entities/appointment";
import { AppointmentLogEntry } from "@/entities/appointment-log/model";
import { Patient, Gender, MessengerType } from "@/entities/patient";

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

export const mockPatients: Patient[] = [
  {
    id: "1",
    firstName: "Апполинария",
    lastName: "Кирпичникова",
    middleName: "",
    gender: Gender.FEMALE,
    birthDate: new Date(1997, 3, 14), // 14 апр 1997
    phone: "+7 983 999 88 32",
    imageUrl: require("../../II/Rectangle 28.png"),
    specialFeatures: "Высокий уровень вовлечения представителей целевой аудитории является четким доказательством простого факта",
    reminderInterval: "4 мес",
    messenger: MessengerType.TELEGRAM,
    refuseReminders: false,
    createdAt: new Date(2023, 2, 15),
    updatedAt: new Date(2024, 9, 20),
  },
  {
    id: "2",
    firstName: "Анна",
    lastName: "Иванова",
    middleName: "Петровна",
    gender: Gender.FEMALE,
    birthDate: new Date(1995, 5, 22), // 22 июн 1995
    phone: "+7 983 999 88 33",
    imageUrl: require("../../II/Rectangle 28.png"),
    specialFeatures: "Особые требования к процедуре, аллергия на некоторые препараты",
    reminderInterval: "6 мес",
    messenger: MessengerType.TELEGRAM,
    refuseReminders: true, // Красная иконка будильника
    createdAt: new Date(2022, 7, 10),
    updatedAt: new Date(2022, 7, 10), // Старый, но не 2 года
  },
  {
    id: "3",
    firstName: "Елена",
    lastName: "Смирнова",
    middleName: "Сергеевна",
    gender: Gender.FEMALE,
    birthDate: new Date(1992, 8, 5), // 5 сен 1992
    phone: "+7 983 999 88 34",
    imageUrl: require("../../II/Rectangle 28.png"),
    specialFeatures: "",
    reminderInterval: "4 мес",
    messenger: MessengerType.WHATSAPP,
    refuseReminders: false,
    createdAt: new Date(2021, 1, 10),
    updatedAt: new Date(2021, 11, 15), // Более 2 лет назад - будет дата удаления
  },
  {
    id: "4",
    firstName: "Ольга",
    lastName: "Петрова",
    middleName: "Александровна",
    gender: Gender.FEMALE,
    birthDate: new Date(1998, 0, 18), // 18 янв 1998
    phone: "+7 983 999 88 35",
    imageUrl: require("../../II/Rectangle 28.png"),
    specialFeatures: "Особенности",
    reminderInterval: "4 мес",
    messenger: MessengerType.WHATSAPP,
    refuseReminders: true, // Красная иконка будильника
    createdAt: new Date(2023, 3, 5),
    updatedAt: new Date(2024, 8, 20),
  },
  {
    id: "5",
    firstName: "Мария",
    lastName: "Козлова",
    middleName: "",
    gender: Gender.FEMALE,
    birthDate: new Date(1996, 11, 30), // 30 дек 1996
    phone: "+7 983 999 88 36",
    // Нет фото - желтая карточка
    specialFeatures: "",
    reminderInterval: "6 мес",
    messenger: MessengerType.TELEGRAM,
    refuseReminders: false,
    createdAt: new Date(2020, 6, 10),
    updatedAt: new Date(2020, 6, 10), // Более 2 лет назад - будет дата удаления
  },
  {
    id: "6",
    firstName: "Татьяна",
    lastName: "Новикова",
    middleName: "Владимировна",
    gender: Gender.FEMALE,
    birthDate: new Date(1990, 7, 25), // 25 авг 1990
    phone: "+7 912 345 67 89",
    imageUrl: require("../../II/Rectangle 28.png"),
    specialFeatures: "Высокий уровень вовлечения представителей целевой аудитории является четким доказательством простого факта",
    reminderInterval: "3 мес",
    messenger: MessengerType.WHATSAPP,
    refuseReminders: false,
    createdAt: new Date(2023, 9, 12),
    updatedAt: new Date(2024, 10, 5),
  },
  {
    id: "7",
    firstName: "Светлана",
    lastName: "Волкова",
    // Нет отчества и даты рождения - желтая карточка
    gender: Gender.FEMALE,
    phone: "+7 987 654 32 10",
    // Нет фото
    specialFeatures: "",
    reminderInterval: "6 мес",
    messenger: MessengerType.TELEGRAM,
    refuseReminders: false,
    createdAt: new Date(2023, 2, 8),
    updatedAt: new Date(2024, 8, 15),
  },
  {
    id: "8",
    firstName: "Олег",
    lastName: "Иванов",
    middleName: "Евгеньевич",
    gender: Gender.MALE,
    birthDate: new Date(1997, 3, 14), // 14 апр 1997
    phone: "+7 983 999 88 32",
    imageUrl: require("../../II/Rectangle 28.png"),
    specialFeatures: "Высокий уровень вовлечения представителей целевой аудитории является четким доказательством простого факта",
    reminderInterval: "4 мес",
    messenger: MessengerType.TELEGRAM,
    refuseReminders: false,
    createdAt: new Date(2025, 7, 14), // 14 авг 2025
    updatedAt: new Date(2025, 7, 14),
  },
];

// Моковые данные для журнала приемов
// Ключ - ID пациента, значение - массив записей в журнале
export const mockAppointmentLogs: Record<string, AppointmentLogEntry[]> = {
  // Иванов Олег Евгеньевич (id: "8")
  "8": [
    {
      id: "log-1",
      patientId: "8",
      type: AppointmentType.PRIMARY,
      status: "scheduled",
      date: new Date(2024, 8, 24), // 24 сент
      time: "12:00",
    },
    {
      id: "log-2",
      patientId: "8",
      type: AppointmentType.PRIMARY,
      status: "completed",
      date: new Date(2024, 8, 4), // 04 сент
      time: "12:00",
      treatment: {
        drugName: "Ботулотоксин типа А",
        units: 36,
        zones: ["Лоб", "шея", "глаза"],
      },
      photos: [
        "http://localhost:3845/assets/ce739be934177bcc1784def31431ae09e1b3c8c6.png",
        "http://localhost:3845/assets/ce739be934177bcc1784def31431ae09e1b3c8c6.png",
        "http://localhost:3845/assets/ce739be934177bcc1784def31431ae09e1b3c8c6.png",
      ],
    },
    {
      id: "log-3",
      patientId: "8",
      type: AppointmentType.CHECKUP,
      status: "completed",
      date: new Date(2024, 7, 4), // 04 авг
      time: "12:00",
      treatment: {
        drugName: "Ботулотоксин типа А",
        units: 16,
        zones: ["Межбровье"],
      },
      photos: [
        "http://localhost:3845/assets/ce739be934177bcc1784def31431ae09e1b3c8c6.png",
        "http://localhost:3845/assets/ce739be934177bcc1784def31431ae09e1b3c8c6.png",
        "http://localhost:3845/assets/ce739be934177bcc1784def31431ae09e1b3c8c6.png",
      ],
      aiAssistantUsed: true,
      note: "Проведена коррекция зон с ИИ-ассистентом",
    },
    {
      id: "log-4",
      patientId: "8",
      type: AppointmentType.CHECKUP,
      status: "completed",
      date: new Date(2024, 7, 4), // 04 авг
      time: "12:00",
      treatment: {
        drugName: "Ботулотоксин типа А",
        units: 16,
        zones: ["Межбровье"],
      },
      photos: [
        "http://localhost:3845/assets/ce739be934177bcc1784def31431ae09e1b3c8c6.png",
        "http://localhost:3845/assets/ce739be934177bcc1784def31431ae09e1b3c8c6.png",
        "http://localhost:3845/assets/ce739be934177bcc1784def31431ae09e1b3c8c6.png",
      ],
      aiAssistantUsed: false,
      note: "Проведена коррекция зон без помощи ИИ-ассистента",
    },
  ],
  // Кирпичникова Апполинария (id: "1")
  "1": [
    {
      id: "log-5",
      patientId: "1",
      type: AppointmentType.PRIMARY,
      status: "completed",
      date: new Date(2024, 8, 15),
      time: "14:00",
      treatment: {
        drugName: "Ботулотоксин типа А",
        units: 40,
        zones: ["Лоб", "глаза"],
      },
      photos: [
        "http://localhost:3845/assets/ce739be934177bcc1784def31431ae09e1b3c8c6.png",
        "http://localhost:3845/assets/ce739be934177bcc1784def31431ae09e1b3c8c6.png",
        "http://localhost:3845/assets/ce739be934177bcc1784def31431ae09e1b3c8c6.png",
      ],
    },
  ],
  // Иванова Анна Петровна (id: "2")
  "2": [
    {
      id: "log-6",
      patientId: "2",
      type: AppointmentType.REPEAT,
      status: "completed",
      date: new Date(2024, 7, 20),
      time: "10:00",
      treatment: {
        drugName: "Ботулотоксин типа А",
        units: 30,
        zones: ["Лоб", "шея"],
      },
      photos: [
        "http://localhost:3845/assets/ce739be934177bcc1784def31431ae09e1b3c8c6.png",
        "http://localhost:3845/assets/ce739be934177bcc1784def31431ae09e1b3c8c6.png",
        "http://localhost:3845/assets/ce739be934177bcc1784def31431ae09e1b3c8c6.png",
      ],
    },
  ],
  // Остальные пациенты не имеют записей (для демонстрации пустого состояния)
};
