import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

/**
 * Root Stack Navigator - верхний уровень навигации
 * Содержит основные стеки и модальные окна
 */
export type RootStackParamList = {
  MainStack: NavigatorScreenParams<MainStackParamList>;
  Modal: undefined;
  // Здесь можно добавить другие модальные окна или экраны вне основного потока
};

/**
 * Main Stack Navigator - основной стек приложения
 */
export type MainStackParamList = {
  Home: undefined;
  AppointmentDetail: { appointmentId: string };
  Archive: undefined;
  AddPatient: undefined;
  SelectAppointmentType: undefined;
  SelectInjectionZones: { appointmentType: string };
  SelectDrugDistribution: {
    appointmentType: string;
    selectedZones: string[];
    photos: { zoneId: string; uri: string }[];
  };
  SelectTotalDosage: {
    appointmentType: string;
    selectedZones: string[];
    photos: { zoneId: string; uri: string }[];
    drugName: string;
  };
  SelectSeparateDosages: {
    appointmentType: string;
    selectedZones: string[];
    photos: { zoneId: string; uri: string }[];
    drugName: string;
  };
  InjectionPoints: {
    appointmentType: string;
    selectedZones: string[];
    photos: { zoneId: string; uri: string }[];
    currentZoneIndex: number;
  };
  CompleteAppointment: {
    patientName: string;
    photos: { zoneId: string; uri: string }[];
    appointmentId?: string;
  };
  AppointmentSuccess: undefined;
  DriverRegistration: undefined;
  UserRegistration: undefined;
  SelectInjectionIntensity: {
    appointmentType: string;
    selectedZones: string[];
    photos: { zoneId: string; uri: string }[];
    currentZoneIndex: number;
  };
  CameraScreen: {
    appointmentType: string;
    selectedZones: string[];
    currentZoneIndex: number;
  };
  PhotoUploadScreen: {
    appointmentType: string;
    photos: { zoneId: string; uri: string }[];
  };
  Cartoteka: undefined;
  // Здесь можно добавить другие экраны основного стека
};

/**
 * Типы для экранов Root Stack
 */
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

/**
 * Типы для экранов Main Stack
 */
export type MainStackScreenProps<T extends keyof MainStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<MainStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

/**
 * Алиасы для конкретных экранов
 */
export type ModalScreenProps = RootStackScreenProps<"Modal">;
export type HomeScreenProps = MainStackScreenProps<"Home">;
export type AppointmentDetailScreenProps =
  MainStackScreenProps<"AppointmentDetail">;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
