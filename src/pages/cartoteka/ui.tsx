import { Patient, userToPatient } from "@/entities/patient"
import { useInnerClients } from "@/shared/api"
import { mockPatients } from "@/shared/lib/mock-data"
import { MainStackScreenProps } from "@/shared/types/navigation"
import { MainLayout } from "@/shared/ui"
import { CartotekaScreen } from "@/widgets/cartoteka-screen"
import React, { useMemo } from "react"

type CartotekaScreenProps = MainStackScreenProps<"Cartoteka">

export const CartotekaPage: React.FC<CartotekaScreenProps> = ({
  navigation,
}) => {
  // Fetch inner clients (patients)
  const innerClients = useInnerClients(undefined)

  // Convert API users to patients
  const patients = useMemo(() => {
    const usersData = innerClients.data?.data
    if (usersData) {
      const userRecord = usersData.user
      if (userRecord && typeof userRecord === "object") {
        const users = Object.values(userRecord)
        const apiPatients = users.map((user: any) => userToPatient(user))
        if (apiPatients.length > 0) {
          return apiPatients
        }
      }
    }

    // Fallback to mock data if API data not available
    console.log("⚠️ Using mock patients (API data not available)")
    return mockPatients
  }, [innerClients.data])

  const handleBackPress = () => {
    navigation.goBack()
  }

  const handleAddPatient = () => {
    navigation.navigate("AddPatient")
  }

  const handlePatientPress = (patient: Patient) => {
    // TODO: Navigate to patient detail page
    console.log("Patient pressed:", patient)
  }

  return (
    <MainLayout
      title="Картотека"
      onBackPress={handleBackPress}
      showBackButton={true}
      showFab={false}
    >
      <CartotekaScreen
        patients={patients}
        isLoading={innerClients.isLoading}
        isRefreshing={innerClients.isRefetching}
        onRefresh={() => innerClients.refetch()}
        onPatientPress={handlePatientPress}
        onAddPatientPress={handleAddPatient}
      />
    </MainLayout>
  )
}
