import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import { ReactNode } from "react";
import { RootNavigator } from "./RootNavigator";

interface NavigationProviderProps {
  children?: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <NavigationContainer>
        <RootNavigator />
        {children}
      </NavigationContainer>
    </ThemeProvider>
  );
}
