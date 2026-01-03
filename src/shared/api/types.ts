// User types
export interface User {
  u_id: string;
  u_name?: string;
  u_family?: string;
  u_middle?: string;
  u_email?: string;
  u_phone?: string;
  u_tg?: string;
  u_wa?: string;
  u_role: string; // "1" - Client, "2" - Driver, "4" - Admin, "5" - Agent
  u_check_state?: string;
  u_ban?: {
    auth: number;
    order: number;
    blog_topic: number;
    blog_post: number;
  };
  u_active?: string; // "0" or "1"
  u_photo?: string;
  u_birthday?: string; // YYYY-MM-DD format
  u_phone_checked?: string; // "0" or "1"
  u_email_checked?: string; // "0" or "1"
  u_tg_checked?: string; // "0" or "1"
  u_wa_checked?: string; // "0" or "1"
  u_lang?: string;
  u_currency?: string;
  u_city?: string;
  u_tips?: string;
  u_lang_skills?: string;
  u_description?: string;
  u_gps_software?: string;
  u_details?: Record<string, any>;
  out_drive?: string; // "0" or "1"
  out_address?: string;
  out_latitude?: string;
  out_longitude?: string;
  out_est_datetime?: string; // YYYY-MM-DD HH:mm:ss±HH:mm
  out_s_address?: string;
  out_s_latitude?: string;
  out_s_longitude?: string;
  out_passengers?: string;
  out_luggage?: string;
  ref_code?: string;
  referrer_u_id?: string;
  u_upper?: string;
  b_comments?: string[]; // Array of booking comment IDs
  b_services?: string[]; // Array of service IDs
  b_location_classes?: {
    b_location_class: string;
    basic: string; // "0" or "1"
  }[];
  sc_id?: string; // Schedule ID
  props?: Record<string, any[]>; // User properties
}

export interface RegisterRequest {
  u_name: string; // Full name (Name MiddleName Surname)
  u_phone?: string;
  u_email?: string;
  u_tg?: string; // Only if admin is registering
  u_wa?: string; // Only if admin is registering
  u_role?: string; // "1" - Client, "2" - Driver
  ref_code?: string; // Referral code
  st?: string; // If defined, response will contain token
  data?: string; // JSON.stringify({ password?: string, u_details?: Record<string, any> })
}

export interface UpdateUserRequest {
  data: string; // JSON.stringify of user fields to update
}

export interface UpdateUserResponse {
  affected_fields: string[];
  forbidden_fields: string[];
}

export interface ReferralLinkResponse {
  u_id: string;
  register: string;
  download: string;
}

export interface RegisterResponse {
  u_id: string;
  "email status"?: boolean;
  string?: string; // Password if email not specified
  token?: string; // If st parameter was provided
  u_hash?: string; // If st parameter was provided
}

export interface AuthRequest {
  login: string; // phone, email, whatsapp, telegram
  password?: string; // Password or 4-digit code
  type:
    | "phone"
    | "e-mail"
    | "whatsapp"
    | "e-mail_code"
    | "phone_code"
    | "telegram_id"
    | "tg"
    | "wa";
}

export interface AuthResponse {
  auth_user: User;
  auth_hash: string; // Hash to get token within 10 seconds after auth
}

export interface TokenResponse {
  token: string;
  hash: string;
}

// Car types
export interface Car {
  id: number;
  user_id: number;
  brand?: string;
  model?: string;
  color?: string;
  plate_number?: string;
  year?: number;
  seats?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCarRequest {
  brand: string;
  model: string;
  color?: string;
  plate_number: string;
  year?: number;
  seats?: number;
}

// Drive (Ride) types
// Represents an appointment/booking in the BTA system
export interface Drive {
  b_id: string; // Booking ID
  u_id: string; // Client (patient) ID
  u_id_performer?: string; // Performer (doctor) ID
  c_id?: string; // Cabinet ID
  b_start_address?: string; // Address
  b_start_datetime?: string; // Datetime in format: YYYY-MM-DD HH:mm:ss±HH:mm
  b_payment_way?: string; // Payment method
  b_options?: Record<string, any>; // Additional booking parameters
  b_state?: string; // Booking state
  c_options?: Record<string, any>; // Performer options
  c_payment_way?: string; // Performer payment method
  created_at?: string;
  updated_at?: string;

  // User information (included in response)
  user?: User;
}

export interface CreateDriveRequest {
  b_start_address: string; // Address
  b_start_datetime: string; // "any" | "now" | "YYYY-MM-DD HH:mm:ss±HH:mm"
  b_payment_way: string; // Payment method (e.g., "2")
  b_options?: Record<string, any>; // Additional parameters
  u_id: string; // Client (patient) ID
}

export interface UpdateDriveRequest {
  action:
    | "set_performer" // Assign performer
    | "edit" // Edit booking/performer options
    | "set_complete_state" // Complete appointment
    | "set_cancel_state"; // Cancel appointment
  performer?: number; // 1 when assigning performer
  u_a_role?: number; // 1 for client/admin, 2 for performer
  u_a_id?: string; // Client ID (when admin editing)
  data?: string; // JSON.stringify of b_options or c_options
  c_id?: string; // Cabinet ID (when assigning performer)
  c_payment_way?: string; // Performer payment method
  c_options?: Record<string, any>; // Performer options
}

// Trip types (for stadium profile)
export interface Trip {
  t_id: string; // Trip identifier
  u_id: string; // Driver identifier
  t_start_address: string; // Start address
  t_start_latitude: string; // Start latitude
  t_start_longitude: string; // Start longitude
  t_destination_address: string; // Destination address
  t_destination_latitude: string; // Destination latitude
  t_destination_longitude: string; // Destination longitude
  t_start_datetime_interval: string; // Max possible shift of trip start in seconds
  t_start_datetime: string; // Planned start date YYYY-MM-DD HH:mm:ss±HH:mm
  t_complete_datetime: string; // Planned completion date
  t_start_real_datetime: string; // Actual start date
  t_complete_real_datetime: string; // Actual completion date
  t_edit_datetime: string; // Edit date
  e_u_id: string; // ID of user who edited the trip
  t_create_datetime: string; // Creation date
  c_u_id: string; // ID of user who created the trip
  t_options: Record<string, any>; // Additional parameters archive
  t_looking_for_clients: string; // "1" or "0" - if there are free seats
  t_canceled: string; // "1" or "0" - if trip is cancelled
  stadium?: string; // Stadium identifier
  sc_id?: string; // Schedule identifier
  price_time_function?: string; // Price change functions based on trip time
  currency?: string; // ISO4217 currency code
  currency_priority?: string; // Ignore currency specified for seat
  sc_currency?: string; // ISO4217 currency code for event (stadium profile)
  sc_currency_priority?: string; // Ignore currency for event (stadium profile)
  fee?: string; // Commission in percentage
  tariff?: string; // Ticket price
  tariff_priority?: string; // Ignore price specified for seat
  sc_fee?: string; // Commission in percentage for event (stadium profile)
  sc_tariff?: string; // Ticket price for event (stadium profile)
  sc_tariff_priority?: string; // Ignore price for event (stadium profile)
  ag_id?: string; // Aggregator identifier
}

export interface TripNowResponse {
  trip: Record<string, Trip>; // Map of trip ID to Trip object
}

export interface CreateTripRequest {
  from_address: string;
  to_address: string;
  departure_time: string;
  price: number;
  seats_available: number;
}

// Ticket types
export interface Ticket {
  id: number;
  trip_id: number;
  seat: string;
  price: number;
  status: "available" | "booked" | "sold";
  qr_code?: string;
  buyer_email?: string;
  buyer_phone?: string;
}

// Payment types
export interface Payment {
  id: number;
  user_id: number;
  amount: number;
  status: "pending" | "completed" | "failed" | "refunded";
  type: "deposit" | "withdrawal" | "transfer" | "payment";
  description?: string;
  created_at: string;
}

export interface CreatePaymentRequest {
  amount: number;
  type: "deposit" | "withdrawal" | "transfer" | "payment";
  description?: string;
}

// Contact and Message types
export interface Contact {
  id: number;
  user_id: number;
  type: "phone" | "email" | "telegram" | "whatsapp";
  value: string;
  verified: boolean;
}

export interface Message {
  id: number;
  from_user_id: number;
  to_user_id: number;
  content: string;
  read: boolean;
  created_at: string;
}

export interface SendMessageRequest {
  to_user_id: number;
  content: string;
  type?: "text" | "code";
}

// Cart types
export interface CartItem {
  id: number;
  trip_id: number;
  seat: string;
  count: number;
  notice?: boolean;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Location types
export interface LocationUpdate {
  lat: number;
  lng: number;
  timestamp?: string;
}

// Promocode types
export interface Promocode {
  code: string;
  discount: number;
  discount_type: "percentage" | "fixed";
  valid_until?: string;
  used: boolean;
}
