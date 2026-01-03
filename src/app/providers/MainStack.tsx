import { MainStackParamList } from "@/shared/types/navigation";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

// Импортируем страницы
import { AddPatientScreen } from "@/pages/add-patient";
import { AppointmentDetailPage } from "@/pages/appointment-detail";
import { AppointmentSuccessScreen } from "@/pages/appointment-success";
import { ArchiveScreen } from "@/pages/archive";
import { CartotekaPage } from "@/pages/cartoteka";
import { CameraScreen } from "@/pages/camera";
import { CompleteAppointmentScreen } from "@/pages/complete-appointment";
import { DriverRegistrationScreen } from "@/pages/driver-registration";
import { HomePage } from "@/pages/home";
import { InjectionPointsScreen } from "@/pages/injection-points";
import { PhotoUploadScreen } from "@/pages/photo-upload";
import { SelectAppointmentTypeScreen } from "@/pages/select-appointment-type";
import { SelectDrugDistributionScreen } from "@/pages/select-drug-distribution";
import { SelectInjectionIntensityScreen } from "@/pages/select-injection-intensity";
import { SelectInjectionZonesScreen } from "@/pages/select-injection-zones";
import { SelectSeparateDosagesScreen } from "@/pages/select-separate-dosages";
import { SelectTotalDosageScreen } from "@/pages/select-total-dosage";
import { UserRegistrationScreen } from "@/pages/user-registration";
import { PatientDetailPage } from "@/pages/patient-detail";
import { EditPatientScreen } from "@/pages/edit-patient";
import { AppointmentLogPage } from "@/pages/appointment-log";

const Stack = createNativeStackNavigator<MainStackParamList>();

/**
 * MainStack - основной стек навигации приложения
 */
export function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen
        name="AppointmentDetail"
        component={AppointmentDetailPage}
      />
      <Stack.Screen name="Archive" component={ArchiveScreen} />
      <Stack.Screen name="Cartoteka" component={CartotekaPage} />
      <Stack.Screen name="PatientDetail" component={PatientDetailPage} />
      <Stack.Screen name="AddPatient" component={AddPatientScreen} />
      <Stack.Screen name="EditPatient" component={EditPatientScreen} />
      <Stack.Screen name="AppointmentLog" component={AppointmentLogPage} />
      <Stack.Screen
        name="DriverRegistration"
        component={DriverRegistrationScreen}
      />
      <Stack.Screen
        name="UserRegistration"
        component={UserRegistrationScreen}
      />
      <Stack.Screen
        name="SelectAppointmentType"
        component={SelectAppointmentTypeScreen}
      />
      <Stack.Screen
        name="SelectInjectionZones"
        component={SelectInjectionZonesScreen}
      />
      <Stack.Screen
        name="SelectDrugDistribution"
        component={SelectDrugDistributionScreen}
      />
      <Stack.Screen
        name="SelectTotalDosage"
        component={SelectTotalDosageScreen}
      />
      <Stack.Screen
        name="SelectSeparateDosages"
        component={SelectSeparateDosagesScreen}
      />
      <Stack.Screen name="InjectionPoints" component={InjectionPointsScreen} />
      <Stack.Screen
        name="CompleteAppointment"
        component={CompleteAppointmentScreen}
      />
      <Stack.Screen
        name="AppointmentSuccess"
        component={AppointmentSuccessScreen}
      />
      <Stack.Screen
        name="SelectInjectionIntensity"
        component={SelectInjectionIntensityScreen}
      />
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
      <Stack.Screen name="PhotoUploadScreen" component={PhotoUploadScreen} />
    </Stack.Navigator>
  );
}
