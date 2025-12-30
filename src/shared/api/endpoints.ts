import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from "./client";
import type {
  ApiResponse,
  AuthRequest,
  AuthResponse,
  Car,
  CartItem,
  Contact,
  CreateCarRequest,
  CreateDriveRequest,
  CreatePaymentRequest,
  CreateTripRequest,
  Drive,
  LocationUpdate,
  Message,
  Payment,
  Promocode,
  ReferralLinkResponse,
  RegisterRequest,
  RegisterResponse,
  SendMessageRequest,
  Ticket,
  TokenResponse,
  Trip,
  UpdateDriveRequest,
  UpdateUserResponse,
  User,
} from "./types";

// Auth endpoints
export const authApi = {
  register: (data: RegisterRequest) => {
    const formData = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, String(value));
    });
    return apiClient.post<ApiResponse<RegisterResponse>>(
      "/register/",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      }
    );
  },

  login: (data: AuthRequest) => {
    const formData = new URLSearchParams();
    formData.append("login", data.login);
    if (data.password) formData.append("password", data.password);
    formData.append("type", data.type);

    return apiClient.post<ApiResponse<AuthResponse>>("/auth/", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    });
  },

  logout: () => apiClient.get<ApiResponse<void>>("/logout/"),

  // Get token using auth_hash (must be called within 10 seconds after auth)
  getTokenByHash: (hash: string) => {
    const formData = new URLSearchParams();
    formData.append("hash", hash);
    return apiClient.post<ApiResponse<TokenResponse>>("/auth/token", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    });
  },

  getToken: () => apiClient.get<ApiResponse<TokenResponse>>("/token/"),

  getAuthorizedToken: () =>
    apiClient.get<ApiResponse<TokenResponse>>("/token/authorized"),

  remindPassword: (data: {
    contact: string;
    type: "email" | "phone" | "telegram" | "whatsapp";
  }) => apiClient.post<ApiResponse<void>>("/remind/", data),

  changePassword: (data: { old_password: string; new_password: string }) =>
    apiClient.post<ApiResponse<void>>("/newpass/", data),
};

// User endpoints
export const userApi = {
  // Get multiple users by IDs or single user
  getUsers: (userIds: string) =>
    apiClient.get<ApiResponse<{ user: Record<string, User> }>>(
      `/user/${userIds}`
    ),

  // Get authorized user info
  getAuthorizedUser: () =>
    apiClient.get<ApiResponse<{ user: Record<string, User> }>>(
      "/user/authorized"
    ),

  // Get all users (admin only) or authorized user
  getAllUsers: () =>
    apiClient.get<ApiResponse<{ user: Record<string, User> }>>("/user/"),

  // Get favorites for user
  getFavorites: (userId?: string) =>
    apiClient.get<ApiResponse<{ user: Record<string, User> }>>(
      userId ? `/user/${userId}/favorite` : "/user/authorized/favorite"
    ),

  // Get referrals for user
  getReferrals: (userId?: string) =>
    apiClient.get<ApiResponse<{ user: Record<string, User> }>>(
      userId ? `/user/${userId}/referral` : "/user/authorized/referral"
    ),

  // Get inner clients for user
  getInnerClients: (userId?: string) =>
    apiClient.get<ApiResponse<{ user: Record<string, User> }>>(
      userId ? `/user/${userId}/inner` : "/user/authorized/inner"
    ),

  // Update user data
  updateUser: (data: Record<string, any>, userId?: string) =>
    apiClient.post<ApiResponse<UpdateUserResponse>>(
      userId ? `/user/${userId}` : "/user/",
      { data: JSON.stringify(data) }
    ),

  // Add users to favorites
  addToFavorites: (userIds: string[], targetUserId?: string) =>
    apiClient.get<ApiResponse<void>>(
      targetUserId
        ? `/user/${targetUserId}/favorite/${userIds.join(",")}/add`
        : `/user/authorized/favorite/${userIds.join(",")}/add`
    ),

  // Remove users from favorites
  removeFromFavorites: (userIds: string[], targetUserId?: string) =>
    apiClient.get<ApiResponse<void>>(
      targetUserId
        ? `/user/${targetUserId}/favorite/${userIds.join(",")}/remove`
        : `/user/authorized/favorite/${userIds.join(",")}/remove`
    ),

  // Get referral links
  getReferralLinks: (userIds?: string) =>
    apiClient.get<ApiResponse<{ user: Record<string, ReferralLinkResponse> }>>(
      userIds
        ? `/user/${userIds}/referral/link`
        : "/user/authorized/referral/link"
    ),

  // Check referral code availability
  checkReferralCode: (refCode: string) =>
    apiClient.get<ApiResponse<{ ref_code_free: boolean }>>(
      `/referral/code/${refCode}/check`
    ),

  startEmailVerification: () =>
    apiClient.get<ApiResponse<void>>("/email/verification/start"),

  completeEmailVerification: (hash: string) =>
    apiClient.get<ApiResponse<void>>(
      `/email/verification/complete&ev_hash=${hash}`
    ),
};

// Car endpoints
export const carApi = {
  getCars: (userId?: number) =>
    apiClient.get<ApiResponse<Car[]>>(
      userId ? `/user/${userId}/car/` : "/user/authorized/car"
    ),

  getCar: (carId: number, userId?: number) =>
    apiClient.get<ApiResponse<Car>>(
      userId ? `/user/${userId}/car/${carId}` : `/car/${carId}`
    ),

  getDrivenCar: () =>
    apiClient.get<ApiResponse<Car>>("/user/authorized/car/driven"),

  getAllCars: () => apiClient.get<ApiResponse<Car[]>>("/car/"),

  createCar: (data: CreateCarRequest, userId?: number) =>
    apiClient.post<ApiResponse<Car>>(
      userId ? `/user/${userId}/car/` : "/car/",
      data
    ),

  updateCar: (carId: number, data: Partial<Car>, userId?: number) =>
    apiClient.post<ApiResponse<Car>>(
      userId ? `/user/${userId}/car/${carId}` : `/car/${carId}`,
      data
    ),

  selectCarToDrive: (carId: number) =>
    apiClient.post<ApiResponse<void>>(`/car/${carId}/drive/`),
};

// Drive (Ride) endpoints
export const driveApi = {
  createDrive: async (data: CreateDriveRequest) => {
    console.log("🚀 Creating drive with data:", data);

    // Get token and u_hash from storage for authorization
    const AsyncStorage = (
      await import("@react-native-async-storage/async-storage")
    ).default;
    const token = await AsyncStorage.getItem("auth_token");
    const u_hash = await AsyncStorage.getItem("u_hash");

    if (!token || !u_hash) {
      throw new Error("Not authorized: token or u_hash missing");
    }

    const driveData = {
      b_start_address: data.b_start_address,
      b_start_datetime: data.b_start_datetime,
      b_payment_way: data.b_payment_way,
      b_options: data.b_options || {},
      u_id: data.u_id,
    };
    console.log("📦 Formatted drive data:", driveData);

    const formData = new URLSearchParams();
    formData.append("token", token);
    formData.append("u_hash", u_hash);
    formData.append("data", JSON.stringify(driveData));
    console.log("📤 Sending FormData:", formData.toString());

    return apiClient.post<ApiResponse<{ b_id: string }>>("/drive", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    });
  },

  getActiveDrives: () => apiClient.get<ApiResponse<Drive[]>>("/drive"),

  // Get ALL active appointments (admin view without u_a_role filter)
  getAllActiveDrives: async () => {
    const token = await AsyncStorage.getItem("auth_token");
    const u_hash = await AsyncStorage.getItem("u_hash");
    const formData = new URLSearchParams();
    if (token) formData.append("token", token);
    if (u_hash) formData.append("u_hash", u_hash);
    // No u_a_role = get ALL drives for admin
    return apiClient.post<ApiResponse<Drive[]>>("/drive", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    });
  },

  // Get active appointments for specific client (admin view, u_a_role: 1)
  getClientActiveDrives: async (clientId: string) => {
    const token = await AsyncStorage.getItem("auth_token");
    const u_hash = await AsyncStorage.getItem("u_hash");
    const formData = new URLSearchParams();
    if (token) formData.append("token", token);
    if (u_hash) formData.append("u_hash", u_hash);
    formData.append("u_a_role", "1");
    formData.append("u_a_id", clientId);
    return apiClient.post<ApiResponse<Drive[]>>("/drive", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    });
  },

  // Get active appointments for performer (u_a_role: 2)
  getPerformerActiveDrives: () => {
    const formData = new URLSearchParams();
    formData.append("u_a_role", "2");
    return apiClient.post<ApiResponse<Drive[]>>("/drive", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    });
  },

  getPendingDrives: () => apiClient.get<ApiResponse<Drive[]>>("/drive/now"),

  getArchiveDrives: () => apiClient.get<ApiResponse<Drive[]>>("/drive/archive"),

  // Get archive appointments for performer (u_a_role: 2)
  getPerformerArchiveDrives: () => {
    const formData = new URLSearchParams();
    formData.append("u_a_role", "2");
    return apiClient.post<ApiResponse<Drive[]>>("/drive/archive", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    });
  },

  getDrive: (driveId: number) =>
    apiClient.get<ApiResponse<Drive>>(`/drive/get/${driveId}`),

  updateDrive: (driveId: number, data: UpdateDriveRequest) => {
    const formData = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : String(value)
        );
      }
    });
    return apiClient.post<ApiResponse<Drive>>(
      `/drive/get/${driveId}`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      }
    );
  },

  // Cancel appointment by performer
  cancelDrive: (driveId: string) => {
    const formData = new URLSearchParams();
    formData.append("u_a_role", "2");
    formData.append("action", "set_cancel_state");
    return apiClient.post<ApiResponse<Drive>>(
      `/drive/get/${driveId}`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      }
    );
  },

  // Complete appointment by performer
  completeDrive: (driveId: string) => {
    const formData = new URLSearchParams();
    formData.append("u_a_role", "2");
    formData.append("action", "set_complete_state");
    return apiClient.post<ApiResponse<Drive>>(
      `/drive/get/${driveId}`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      }
    );
  },

  updateLocation: (data: LocationUpdate) =>
    apiClient.post<ApiResponse<void>>("/location", data),
};

// Trip endpoints (Stadium profile)
export const tripApi = {
  createTrip: (data: CreateTripRequest) =>
    apiClient.post<ApiResponse<Trip>>("/trip", data),

  getActiveTrips: (params?: {
    fields?: string;
    filter?: string;
    raw_price?: boolean;
    wi?: boolean;
  }) => {
    const queryString = params
      ? "?" +
        new URLSearchParams(
          Object.entries(params).map(([key, value]) => [key, String(value)])
        ).toString()
      : "";
    return apiClient.get<ApiResponse<{ trip: Record<string, Trip> }>>(
      `/trip${queryString}`
    );
  },

  // Get trips waiting for clients
  getTripsNow: (params?: {
    fields?: string; // e.g., "000G" for detailed ticket info
    filter?: string; // Schedule IDs for stadium profile
    raw_price?: boolean; // Include raw price from database
    wi?: boolean; // Include trips with aggregator
  }) => {
    const queryString = params
      ? "?" +
        new URLSearchParams(
          Object.entries(params).map(([key, value]) => [key, String(value)])
        ).toString()
      : "";
    return apiClient.get<
      ApiResponse<{
        trip: Record<string, Trip>;
        auth_user: User;
      }>
    >(`/trip/now${queryString}`);
  },

  getTrip: (tripIds: string) =>
    apiClient.get<ApiResponse<{ trip: Record<string, Trip> }>>(
      `/trip/get/${tripIds}`
    ),

  updateTrip: (tripId: string, data: Partial<Trip>) =>
    apiClient.post<ApiResponse<Trip>>(`/trip/get/${tripId}`, {
      action: "edit",
      ...data,
    }),
};

// Ticket endpoints
export const ticketApi = {
  uploadTickets: (tripId: number, tickets: FormData) =>
    apiClient.post<ApiResponse<Ticket[]>>(
      `/trip/get/${tripId}/ticket/write/`,
      tickets
    ),

  getTickets: (tripId: number, seat?: string, pdf?: boolean) =>
    apiClient.get<ApiResponse<Ticket | Ticket[]>>(
      `/trip/get/${tripId}/ticket/read/${seat ? `?seat=${seat}` : ""}${
        pdf ? "&pdf=1" : ""
      }`
    ),

  sendTicketEmail: (tripId: number, data: { email: string; message: string }) =>
    apiClient.post<ApiResponse<void>>(
      `/trip/get/${tripId}/ticket/send/buyer/email`,
      data
    ),

  editTicket: (tripId: number, data: Partial<Ticket>) =>
    apiClient.post<ApiResponse<Ticket>>(
      `/trip/get/${tripId}/ticket/edit/`,
      data
    ),

  getScheduleTickets: () =>
    apiClient.get<ApiResponse<Trip[]>>("/schedule/ticket"),

  getScheduleTicketsSummary: () =>
    apiClient.get<ApiResponse<any>>("/schedule/ticket/select"),

  checkTicket: (code: string) =>
    apiClient.get<ApiResponse<Ticket>>(`/ticket/check/?code=${code}`),

  getTicketCheckLog: () =>
    apiClient.get<ApiResponse<any[]>>("/ticket/check/log"),
};

// Cart endpoints
export const cartApi = {
  getCart: () => apiClient.get<ApiResponse<CartItem[]>>("/cart"),

  addToCart: (tripId: number, seat: string, count?: number) =>
    apiClient.get<ApiResponse<CartItem[]>>(
      `/cart?prod=${tripId}&prop=${seat}${count ? `&count=${count}` : ""}`
    ),

  clearCart: () => apiClient.get<ApiResponse<void>>("/cart/clear"),

  moveCart: (toUserId: number) =>
    apiClient.get<ApiResponse<void>>(`/cart/move?to_user=${toUserId}`),

  getBlockCart: () => apiClient.get<ApiResponse<CartItem[]>>("/cart_block"),

  manageBlockCart: (
    tripId: number,
    seat: string,
    count?: number,
    notice?: boolean
  ) =>
    apiClient.get<ApiResponse<CartItem[]>>(
      `/cart_block?prod=${tripId}&prop=${seat}${
        count ? `&count=${count}` : ""
      }${notice !== undefined ? `&notice=${notice ? 1 : 0}` : ""}`
    ),

  clearBlockCart: () => apiClient.get<ApiResponse<void>>("/cart_block/clear"),

  updateBlockCartStatus: (data: any) =>
    apiClient.post<ApiResponse<void>>("/cart_block/status", data),
};

// Payment endpoints
export const paymentApi = {
  createPayment: (data: CreatePaymentRequest) =>
    apiClient.post<ApiResponse<Payment>>("/payment/create", data),

  getPayments: () => apiClient.get<ApiResponse<Payment[]>>("/payment/get"),

  deposit: (amount: number) =>
    apiClient.post<ApiResponse<Payment>>("/account/deposit", { amount }),

  withdraw: (amount: number) =>
    apiClient.post<ApiResponse<Payment>>("/account/withdraw", { amount }),

  transfer: (toUserId: number, amount: number) =>
    apiClient.post<ApiResponse<Payment>>("/account/transfer", {
      to_user_id: toUserId,
      amount,
    }),

  getAccounts: () => apiClient.get<ApiResponse<any[]>>("/account/get"),

  getTransactions: () =>
    apiClient.get<ApiResponse<any[]>>("/account/transaction"),
};

// Contact and Message endpoints
export const contactApi = {
  getContacts: () => apiClient.post<ApiResponse<Contact[]>>("/contact/get"),

  createContact: (data: Partial<Contact>) =>
    apiClient.post<ApiResponse<Contact>>("/contact/create", data),

  editContact: (contactId: number, data: Partial<Contact>) =>
    apiClient.post<ApiResponse<Contact>>("/contact/edit", {
      id: contactId,
      ...data,
    }),

  getMessages: () =>
    apiClient.post<ApiResponse<Message[]>>("/contact/message/get"),

  sendMessage: (data: SendMessageRequest) =>
    apiClient.post<ApiResponse<Message>>("/contact/message/send", data),

  markAsRead: (messageIds: number[]) =>
    apiClient.post<ApiResponse<void>>("/contact/message/read", {
      ids: messageIds,
    }),
};

// Promocode endpoints
export const promocodeApi = {
  checkPromocode: (code: string) =>
    apiClient.get<ApiResponse<Promocode>>(`/promocode/check/?code=${code}`),
};

// File/Dropbox endpoints
export const fileApi = {
  uploadFile: (file: FormData) =>
    apiClient.post<ApiResponse<{ id: number; url: string }>>(
      "/dropbox/file/",
      file
    ),

  getFile: (fileId: number) =>
    apiClient.get<ApiResponse<Blob>>(`/dropbox/file/${fileId}`),

  deleteFile: (fileId: number) =>
    apiClient.get<ApiResponse<void>>(`/dropbox/file/${fileId}/del`),

  getFilesInfo: (fileIds?: number[]) =>
    apiClient.get<ApiResponse<any[]>>(
      fileIds
        ? `/dropbox/file/${fileIds.join(",")}/select`
        : "/dropbox/file/null/select"
    ),
};

// Data endpoints
export const dataApi = {
  getData: () => apiClient.get<ApiResponse<any>>("/data/"),

  updateData: (data: any) => apiClient.post<ApiResponse<void>>("/data/", data),

  updateCache: () => apiClient.post<ApiResponse<void>>("/cache/update"),
};
