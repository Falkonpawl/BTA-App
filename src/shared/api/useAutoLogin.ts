import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { authApi } from "./endpoints";
import { useLogin } from "./hooks";

/**
 * Auto-login hook that runs on app startup
 * Makes authentication request with hardcoded credentials
 */
export function useAutoLogin() {
  const login = useLogin({
    onSuccess: async (response) => {
      const authUser = response?.auth_user;
      console.log("Auto-login successful:", authUser?.u_name);
      console.log("User role:", authUser?.u_role);

      // If user is already authorized, get token from /token/authorized
      if (
        response?.message === "user is already authorized" ||
        response?.code === "404"
      ) {
        console.log("User already authorized, fetching token...");
        try {
          const tokenResponse = await authApi.getAuthorizedToken();
          console.log("✅ Token response:", tokenResponse);

          const token = tokenResponse?.data?.token;
          const u_hash = tokenResponse?.data?.u_hash;

          if (token) {
            await AsyncStorage.setItem("auth_token", token);
            console.log(
              "✅ Token stored from /token/authorized:",
              token.substring(0, 20) + "..."
            );
          }

          if (u_hash) {
            await AsyncStorage.setItem("u_hash", u_hash);
            console.log(
              "✅ U_hash stored from /token/authorized:",
              u_hash.substring(0, 30) + "..."
            );
          }
        } catch (error) {
          console.error("❌ Failed to get authorized token:", error);
        }
      }
    },
    onError: (error) => {
      console.error("Auto-login failed:", error);
    },
  });

  useEffect(() => {
    // Run login on mount
    login.mutate({
      login: "ruslanmakhmatov@gmail.com",
      password: "$yX5eJ|,(s",
      type: "e-mail",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isLoggingIn: login.isPending, isLoggedIn: login.isSuccess };
}
