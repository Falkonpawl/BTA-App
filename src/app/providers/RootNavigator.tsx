import { RootStackParamList } from "@/shared/types/navigation";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

// Импортируем страницы
import { MainStack } from "./MainStack";

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * RootNavigator - корневой навигатор приложения
 * Содержит MainStack и модальные окна
 */
export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainStack" component={MainStack} />
    </Stack.Navigator>
  );
}
