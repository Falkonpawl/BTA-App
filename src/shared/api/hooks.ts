import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  authApi,
  carApi,
  cartApi,
  contactApi,
  dataApi,
  driveApi,
  paymentApi,
  promocodeApi,
  tripApi,
  userApi,
} from "./endpoints";
import type {
  AuthRequest,
  CreateCarRequest,
  CreateDriveRequest,
  CreatePaymentRequest,
  CreateTripRequest,
  LocationUpdate,
  RegisterRequest,
  SendMessageRequest,
  UpdateDriveRequest,
} from "./types";

// Query keys
export const queryKeys = {
  auth: {
    token: ["auth", "token"] as const,
    user: ["auth", "user"] as const,
  },
  users: {
    all: ["users"] as const,
    detail: (id: number) => ["users", id] as const,
    favorites: (id?: number) => ["users", "favorites", id] as const,
    referrals: (id?: number) => ["users", "referrals", id] as const,
    inner: (id?: number) => ["users", "inner", id] as const,
  },
  cars: {
    all: ["cars"] as const,
    byUser: (userId?: number) => ["cars", "user", userId] as const,
    detail: (id: number) => ["cars", id] as const,
    driven: ["cars", "driven"] as const,
  },
  drives: {
    active: ["drives", "active"] as const,
    pending: ["drives", "pending"] as const,
    archive: ["drives", "archive"] as const,
    detail: (id: number) => ["drives", id] as const,
  },
  trips: {
    active: ["trips", "active"] as const,
    available: ["trips", "available"] as const,
    detail: (id: number) => ["trips", id] as const,
  },
  tickets: {
    byTrip: (tripId: number) => ["tickets", "trip", tripId] as const,
    schedule: ["tickets", "schedule"] as const,
  },
  cart: {
    main: ["cart"] as const,
    block: ["cart", "block"] as const,
  },
  payments: {
    all: ["payments"] as const,
    accounts: ["payments", "accounts"] as const,
    transactions: ["payments", "transactions"] as const,
  },
  contacts: {
    all: ["contacts"] as const,
    messages: ["contacts", "messages"] as const,
  },
  data: ["data"] as const,
};

// Auth hooks
export const useRegister = (
  options?: UseMutationOptions<any, Error, RegisterRequest>
) => {
  return useMutation({
    mutationFn: authApi.register,
    ...options,
  });
};

export const useLogin = (
  options?: UseMutationOptions<any, Error, AuthRequest>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials) => {
      console.log("🚀 Starting login with:", credentials.login);
      const response = await authApi.login(credentials);
      console.log(
        "✅ Login API response received:",
        JSON.stringify(response, null, 2)
      );
      return response;
    },
    onSuccess: async (response) => {
      console.log("📦 Full response:", response);

      // Response comes directly from API client (response.data already extracted)
      const authUser = response?.auth_user;
      const authHash = response?.auth_hash;

      console.log("👤 Auth user:", authUser?.u_name, authUser?.u_family);
      console.log("🔑 Auth hash:", authHash ? "✅ present" : "❌ missing");

      // Set user data in cache
      if (authUser) {
        queryClient.setQueryData(queryKeys.auth.user, authUser);
        console.log("💾 User cached:", authUser.u_name);
      }

      // If auth_hash is present, retrieve and store the token
      if (authHash) {
        try {
          console.log("🔄 Fetching token with hash...");
          const tokenResponse = await authApi.getTokenByHash(authHash);
          console.log("🔑 Token response:", tokenResponse);

          const token = tokenResponse?.token;
          const u_hash = tokenResponse?.hash;

          if (token) {
            await AsyncStorage.setItem("auth_token", token);
            console.log("✅ Token stored:", token.substring(0, 30) + "...");
          } else {
            console.log("❌ No token in response:", tokenResponse);
          }

          if (u_hash) {
            await AsyncStorage.setItem("u_hash", u_hash);
            console.log("✅ U_hash stored:", u_hash.substring(0, 20) + "...");
          } else {
            console.log("❌ No u_hash in response:", tokenResponse);
          }
        } catch (error) {
          console.error("❌ Failed to retrieve token:", error);
        }
      }
    },
    onError: (error: any) => {
      console.error("❌ Login error:", error);
      console.error("❌ Error response:", error?.response?.data);
    },
    ...options,
  });
};

export const useLogout = (options?: UseMutationOptions<any, Error, void>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
    },
    ...options,
  });
};

export const useAuthToken = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: queryKeys.auth.token,
    queryFn: authApi.getAuthorizedToken,
    ...options,
  });
};

// User hooks
export const useUsers = (
  userIds: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ["users", userIds],
    queryFn: () => userApi.getUsers(userIds),
    ...options,
  });
};

export const useAuthorizedUser = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: userApi.getAuthorizedUser,
    ...options,
  });
};

export const useAllUsers = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: userApi.getAllUsers,
    ...options,
  });
};

export const useFavorites = (
  userId?: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: queryKeys.users.favorites(userId ? Number(userId) : undefined),
    queryFn: () => userApi.getFavorites(userId),
    ...options,
  });
};

export const useReferrals = (
  userId?: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: queryKeys.users.referrals(userId ? Number(userId) : undefined),
    queryFn: () => userApi.getReferrals(userId),
    ...options,
  });
};

export const useInnerClients = (
  userId?: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: queryKeys.users.inner(userId ? Number(userId) : undefined),
    queryFn: () => userApi.getInnerClients(userId),
    ...options,
  });
};

export const useUpdateUser = (
  options?: UseMutationOptions<
    any,
    Error,
    { data: Record<string, any>; userId?: string }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, userId }) => userApi.updateUser(data, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
    ...options,
  });
};

export const useAddToFavorites = (
  options?: UseMutationOptions<
    any,
    Error,
    { userIds: string[]; targetUserId?: string }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userIds, targetUserId }) =>
      userApi.addToFavorites(userIds, targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    ...options,
  });
};

export const useRemoveFromFavorites = (
  options?: UseMutationOptions<
    any,
    Error,
    { userIds: string[]; targetUserId?: string }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userIds, targetUserId }) =>
      userApi.removeFromFavorites(userIds, targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    ...options,
  });
};

export const useReferralLinks = (
  userIds?: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ["referral-links", userIds],
    queryFn: () => userApi.getReferralLinks(userIds),
    ...options,
  });
};

export const useCheckReferralCode = (
  refCode: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ["referral-code", refCode],
    queryFn: () => userApi.checkReferralCode(refCode),
    enabled: !!refCode,
    ...options,
  });
};

// Car hooks
export const useCars = (
  userId?: number,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: queryKeys.cars.byUser(userId),
    queryFn: () => carApi.getCars(userId),
    ...options,
  });
};

export const useCar = (
  carId: number,
  userId?: number,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: queryKeys.cars.detail(carId),
    queryFn: () => carApi.getCar(carId, userId),
    ...options,
  });
};

export const useDrivenCar = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: queryKeys.cars.driven,
    queryFn: carApi.getDrivenCar,
    ...options,
  });
};

export const useCreateCar = (
  options?: UseMutationOptions<
    any,
    Error,
    { data: CreateCarRequest; userId?: number }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, userId }) => carApi.createCar(data, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cars.byUser(variables.userId),
      });
    },
    ...options,
  });
};

export const useUpdateCar = (
  options?: UseMutationOptions<
    any,
    Error,
    { carId: number; data: Partial<any>; userId?: number }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ carId, data, userId }) =>
      carApi.updateCar(carId, data, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cars.detail(variables.carId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cars.byUser(variables.userId),
      });
    },
    ...options,
  });
};

// Drive hooks
export const useCreateDrive = (
  options?: UseMutationOptions<any, Error, CreateDriveRequest>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: driveApi.createDrive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.drives.active });
    },
    ...options,
  });
};

export const useActiveDrives = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: queryKeys.drives.active,
    queryFn: driveApi.getActiveDrives,
    ...options,
  });
};

export const useAllActiveDrives = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: [...queryKeys.drives.active, "all"],
    queryFn: async () => {
      console.log("🚀 Fetching ALL active appointments (admin)...");
      const response = await driveApi.getAllActiveDrives();
      console.log("✅ All drives response:", JSON.stringify(response, null, 2));
      return response;
    },
    ...options,
  });
};

// Get active appointments for specific client (admin view)
export const useClientActiveDrives = (
  clientId: string | undefined,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: [...queryKeys.drives.active, "client", clientId],
    queryFn: async () => {
      if (!clientId) throw new Error("Client ID is required");
      console.log(`🚀 Fetching active appointments for client ${clientId}...`);
      const response = await driveApi.getClientActiveDrives(clientId);
      console.log(
        `✅ Client ${clientId} drives response:`,
        JSON.stringify(response, null, 2)
      );
      return response;
    },
    enabled: !!clientId,
    ...options,
  });
};

export const usePerformerActiveDrives = (
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: [...queryKeys.drives.active, "performer"],
    queryFn: async () => {
      console.log("🚀 Fetching performer's active appointments...");
      const response = await driveApi.getPerformerActiveDrives();
      console.log(
        "✅ Performer drives response:",
        JSON.stringify(response, null, 2)
      );
      return response;
    },
    ...options,
  });
};

export const usePendingDrives = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: queryKeys.drives.pending,
    queryFn: driveApi.getPendingDrives,
    ...options,
  });
};

export const useArchiveDrives = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: queryKeys.drives.archive,
    queryFn: driveApi.getArchiveDrives,
    ...options,
  });
};

export const usePerformerArchiveDrives = (
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: [...queryKeys.drives.archive, "performer"],
    queryFn: async () => {
      console.log("📁 Fetching performer's archive appointments...");
      const response = await driveApi.getPerformerArchiveDrives();
      console.log(
        "✅ Archive drives response:",
        JSON.stringify(response, null, 2)
      );
      return response;
    },
    ...options,
  });
};

export const useDrive = (
  driveId: number,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: queryKeys.drives.detail(driveId),
    queryFn: () => driveApi.getDrive(driveId),
    enabled: !!driveId,
    ...options,
  });
};

export const useUpdateDrive = (
  options?: UseMutationOptions<
    any,
    Error,
    { driveId: number; data: UpdateDriveRequest }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ driveId, data }) => driveApi.updateDrive(driveId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.drives.detail(variables.driveId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.drives.active });
      queryClient.invalidateQueries({ queryKey: queryKeys.drives.pending });
    },
    ...options,
  });
};

export const useCancelDrive = (
  options?: UseMutationOptions<any, Error, string>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (driveId: string) => {
      console.log("❌ Canceling appointment:", driveId);
      return driveApi.cancelDrive(driveId);
    },
    onSuccess: (response, driveId) => {
      console.log("✅ Appointment canceled successfully:", response);
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.drives.active, "performer"],
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.drives.active });
      queryClient.invalidateQueries({ queryKey: queryKeys.drives.archive });
    },
    onError: (error) => {
      console.error("❌ Failed to cancel appointment:", error);
    },
    ...options,
  });
};

export const useCompleteDrive = (
  options?: UseMutationOptions<any, Error, string>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (driveId: string) => {
      console.log("✅ Completing appointment:", driveId);
      return driveApi.completeDrive(driveId);
    },
    onSuccess: (response, driveId) => {
      console.log("✅ Appointment completed successfully:", response);
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.drives.active, "performer"],
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.drives.active });
      queryClient.invalidateQueries({ queryKey: queryKeys.drives.archive });
    },
    onError: (error) => {
      console.error("❌ Failed to complete appointment:", error);
    },
    ...options,
  });
};

export const useUpdateLocation = (
  options?: UseMutationOptions<any, Error, LocationUpdate>
) => {
  return useMutation({
    mutationFn: driveApi.updateLocation,
    ...options,
  });
};

// Trip hooks
export const useActiveTrips = (
  params?: {
    fields?: string;
    filter?: string;
    raw_price?: boolean;
    wi?: boolean;
  },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: [...queryKeys.trips.active, params],
    queryFn: () => tripApi.getActiveTrips(params),
    ...options,
  });
};

export const useTripsNow = (
  params?: {
    fields?: string;
    filter?: string;
    raw_price?: boolean;
    wi?: boolean;
  },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: [...queryKeys.trips.available, params],
    queryFn: async () => {
      console.log("🚀 Fetching trips waiting for clients...");
      console.log("📋 Parameters:", params);
      const response = await tripApi.getTripsNow(params);
      console.log(
        "✅ Trips /trip/now response:",
        JSON.stringify(response, null, 2)
      );
      return response;
    },
    ...options,
  });
};

export const useTrip = (
  tripIds: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: [...queryKeys.trips.detail(Number(tripIds)), tripIds],
    queryFn: () => tripApi.getTrip(tripIds),
    enabled: !!tripIds,
    ...options,
  });
};

export const useCreateTrip = (
  options?: UseMutationOptions<any, Error, CreateTripRequest>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tripApi.createTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trips.active });
    },
    ...options,
  });
};

// Cart hooks
export const useCart = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: queryKeys.cart.main,
    queryFn: cartApi.getCart,
    ...options,
  });
};

export const useAddToCart = (
  options?: UseMutationOptions<
    any,
    Error,
    { tripId: number; seat: string; count?: number }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tripId, seat, count }) =>
      cartApi.addToCart(tripId, seat, count),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.main });
    },
    ...options,
  });
};

export const useClearCart = (
  options?: UseMutationOptions<any, Error, void>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.main });
    },
    ...options,
  });
};

// Payment hooks
export const usePayments = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: queryKeys.payments.all,
    queryFn: paymentApi.getPayments,
    ...options,
  });
};

export const useCreatePayment = (
  options?: UseMutationOptions<any, Error, CreatePaymentRequest>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: paymentApi.createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
    ...options,
  });
};

export const useDeposit = (
  options?: UseMutationOptions<any, Error, number>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: paymentApi.deposit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.accounts });
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.transactions,
      });
    },
    ...options,
  });
};

// Contact and Message hooks
export const useContacts = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: queryKeys.contacts.all,
    queryFn: contactApi.getContacts,
    ...options,
  });
};

export const useMessages = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: queryKeys.contacts.messages,
    queryFn: contactApi.getMessages,
    ...options,
  });
};

export const useSendMessage = (
  options?: UseMutationOptions<any, Error, SendMessageRequest>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: contactApi.sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.messages });
    },
    ...options,
  });
};

// Promocode hooks
export const useCheckPromocode = (
  code: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ["promocode", code],
    queryFn: () => promocodeApi.checkPromocode(code),
    enabled: !!code,
    ...options,
  });
};

// Data hooks
export const useData = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: queryKeys.data,
    queryFn: dataApi.getData,
    ...options,
  });
};
