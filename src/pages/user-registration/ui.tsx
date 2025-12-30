import { useRegister } from "@/shared/api";
import { MainStackScreenProps } from "@/shared/types/navigation";
import { Button, MainLayout } from "@/shared/ui";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Props = MainStackScreenProps<"UserRegistration">;

export function UserRegistrationScreen({ navigation }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    telegram: "",
    whatsapp: "",
    password: "",
    referralCode: "",
  });

  const register = useRegister({
    onSuccess: (response) => {
      console.log("✅ Регистрация успешна:", response);
      Alert.alert(
        "Успешно",
        "Пользователь зарегистрирован. Пароль: " +
          (response?.data?.string || formData.password),
        [{ text: "ОК", onPress: () => navigation.goBack() }]
      );
    },
    onError: (error: any) => {
      console.error("❌ Ошибка регистрации:", error);
      Alert.alert("Ошибка", "Не удалось зарегистрировать пользователя");
    },
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.phone) {
      Alert.alert("Ошибка", "Заполните обязательные поля: Имя и Телефон");
      return;
    }

    const u_details: any = {};
    if (formData.telegram) u_details.telegram = formData.telegram;
    if (formData.whatsapp) u_details.whatsapp = formData.whatsapp;

    register.mutate({
      u_name: formData.name,
      u_phone: formData.phone,
      u_email: formData.email || undefined,
      u_role: "1", // Роль обычного пользователя
      ref_code: formData.referralCode || undefined,
      st: "1", // Чтобы получить токен в ответе
      data: JSON.stringify({
        u_details,
        password: formData.password || undefined,
      }),
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <MainLayout
      title="Регистрация пользователя"
      onBackPress={() => navigation.goBack()}
      showBackButton={true}
      showFab={false}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.form}>
          {/* Имя */}
          <View style={styles.field}>
            <Text style={styles.label}>Имя *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => updateField("name", text)}
              placeholder="Введите имя"
              placeholderTextColor="#999"
            />
          </View>

          {/* Телефон */}
          <View style={styles.field}>
            <Text style={styles.label}>Телефон *</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => updateField("phone", text)}
              placeholder="87759932581"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>

          {/* Емейл */}
          <View style={styles.field}>
            <Text style={styles.label}>Емейл</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => updateField("email", text)}
              placeholder="email@example.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Телеграм идентификатор */}
          <View style={styles.field}>
            <Text style={styles.label}>Телеграм идентификатор</Text>
            <TextInput
              style={styles.input}
              value={formData.telegram}
              onChangeText={(text) => updateField("telegram", text)}
              placeholder="@username"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>

          {/* Ватсап идентификатор */}
          <View style={styles.field}>
            <Text style={styles.label}>Ватсап идентификатор</Text>
            <TextInput
              style={styles.input}
              value={formData.whatsapp}
              onChangeText={(text) => updateField("whatsapp", text)}
              placeholder="87759932581"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>

          {/* Пароль */}
          <View style={styles.field}>
            <Text style={styles.label}>Пароль</Text>
            <TextInput
              style={styles.input}
              value={formData.password}
              onChangeText={(text) => updateField("password", text)}
              placeholder="Оставьте пустым для автогенерации"
              placeholderTextColor="#999"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Реферальный код */}
          <View style={styles.field}>
            <Text style={styles.label}>Реферальный код</Text>
            <TextInput
              style={styles.input}
              value={formData.referralCode}
              onChangeText={(text) => updateField("referralCode", text)}
              placeholder="Необязательно"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>

          {/* Submit Button */}
          <Button
            title="Зарегистрировать пользователя"
            onPress={handleSubmit}
            variant="primary"
            size="large"
            style={styles.submitButton}
            disabled={register.isPending}
          />

          {register.isPending && (
            <Text style={styles.loadingText}>Регистрация...</Text>
          )}
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  scrollContent: {
    padding: 24,
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "500",
    color: "#222221",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E2E2",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: "Montserrat",
    fontSize: 16,
    color: "#222221",
  },
  submitButton: {
    marginTop: 16,
  },
  loadingText: {
    textAlign: "center",
    fontFamily: "Montserrat",
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
});
