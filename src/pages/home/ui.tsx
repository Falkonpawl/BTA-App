import { Appointment, driveToAppointment } from "@/entities/appointment"
import { QuickActionType } from "@/features/quick-actions"
import { useLogout, usePerformerActiveDrives } from "@/shared/api"
import { MainStackScreenProps } from "@/shared/types/navigation"
import {
  Button,
  MainLayout,
  SubscriptionModal,
  ToastNotification,
} from "@/shared/ui"
import { HomeScreen as HomeScreenWidget } from "@/widgets/home-screen"
import React, { useEffect, useMemo, useState } from "react"
import { View } from "react-native"

type Props = MainStackScreenProps<"Home">

export function HomePage({ navigation }: Props) {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(true) // true для теста
  const [showNotification, setShowNotification] = useState(false)
  const [notificationButtonPos, setNotificationButtonPos] = useState<{
    x: number
    y: number
  } | null>(null)

  const logout = useLogout({
    onSuccess: () => {
      console.log("✅ Logged out successfully")
    },
    onError: (error) => {
      console.error("❌ Logout failed:", error)
    },
  })

  // Fetch performer's active appointments (u_a_role: 2)
  const performerDrives = usePerformerActiveDrives({
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })

  // Fetch trips waiting for clients (currently unused)
  // const tripsNow = useTripsNow(undefined, {
  //   refetchOnMount: true,
  //   refetchOnWindowFocus: false,
  // })

  // Convert API drives to appointments
  const appointments = useMemo(() => {
    const apiData = performerDrives.data?.data || performerDrives.data
    const bookings = apiData?.booking

    console.log("📋 Converting drives to appointments:", bookings)

    if (bookings && Array.isArray(bookings)) {
      // Если массив пустой - показываем пустой список, не моки
      return bookings.map(driveToAppointment)
    }

    // Если данных нет совсем (ошибка загрузки), показываем пустой список
    return []
  }, [performerDrives.data])

  // Показываем уведомление через 2 секунды после получения координат кнопки
  useEffect(() => {
    if (notificationButtonPos) {
      const timer = setTimeout(() => {
        setShowNotification(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [notificationButtonPos])

  const handleAppointmentPress = (appointment: Appointment) => {
    console.log("Appointment pressed:", appointment)
    // Navigate to appointment details
    navigation.navigate("AppointmentDetail", { appointmentId: appointment.id })
  }

  const handleArchivePress = () => {
    console.log("Archive pressed")
    // Navigate to archive
    navigation.navigate("Archive")
  }

  const handleQuickActionPress = (actionType: QuickActionType) => {
    console.log("Quick action pressed:", actionType)

    switch (actionType) {
      case "primary-appointment":
        navigation.navigate("AddPatient")
        break
      case "checkup":
        // TODO: Navigate to checkup
        console.log("Checkup action")
        break
      case "repeat-appointment":
        // TODO: Navigate to repeat appointment
        console.log("Repeat appointment action")
        break
      case "calendar":
        // TODO: Navigate to calendar
        console.log("Calendar action")
        break
      case "files":
        navigation.navigate("Cartoteka")
        break
      case "education":
        // TODO: Navigate to education
        console.log("Education action")
        break
      default:
        console.log("Unknown action:", actionType)
    }
  }

  const handleBackPress = () => {
    console.log("Back pressed")
    navigation.goBack()
  }

  const handleAddPress = () => {
    console.log("Add button pressed")
    navigation.navigate("AddPatient")
  }

  const handlePayPress = () => {
    console.log("Pay pressed")
    setShowSubscriptionModal(false)
    // Navigate to payment
  }

  const handleNotifyPatient = () => {
    console.log("Notify patient pressed")
    setShowNotification(false)
    // Отправить уведомление пациенту
  }

  const handleNotificationButtonLayout = (x: number, y: number) => {
    setNotificationButtonPos({ x, y })
  }

  return (
    <MainLayout
      title="BTA Assist"
      onBackPress={handleBackPress}
      showBackButton={true}
      showFab={true}
      onFabPress={handleAddPress}
      onNotificationButtonLayout={handleNotificationButtonLayout}
    >
      <View className="px-4 pb-4 gap-2">
        <Button
          title="👤 Регистрация исполнителя"
          onPress={() => navigation.navigate("DriverRegistration")}
          variant="primary"
        />
        <Button
          title="👥 Регистрация пользователя"
          onPress={() => navigation.navigate("UserRegistration")}
          variant="primary"
        />
        <Button
          title="🚪 Выход из системы"
          onPress={() => logout.mutate()}
          variant="secondary"
          loading={logout.isPending}
        />
      </View>

      <HomeScreenWidget
        appointments={appointments}
        onAppointmentPress={handleAppointmentPress}
        onArchivePress={handleArchivePress}
        onQuickActionPress={handleQuickActionPress}
        isRefreshing={performerDrives.isRefetching}
        onRefresh={() => {
          performerDrives.refetch()
        }}
      />

      <SubscriptionModal
        visible={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onPayPress={handlePayPress}
      />

      <ToastNotification
        visible={showNotification}
        avatarSource={{ uri: "https://i.pravatar.cc/150?img=5" }}
        message="Прошло 6 месяцев после основной коррекции и необходимо отправить напоминание пациенту Михайлова Ольга"
        highlightedText="Михайлова Ольга"
        actionText="Уведомить пациента"
        onActionPress={handleNotifyPatient}
        onClose={() => setShowNotification(false)}
        autoHideDuration={0}
        anchorX={notificationButtonPos?.x}
        anchorY={notificationButtonPos?.y}
      />
    </MainLayout>
  )
}
