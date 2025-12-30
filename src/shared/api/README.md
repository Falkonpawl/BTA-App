# API Client Usage Guide

## Setup

1. Wrap your app with `QueryProvider` in your main App component:

```tsx
import { QueryProvider } from "@/src/shared/api";

export default function App() {
  return <QueryProvider>{/* Your app components */}</QueryProvider>;
}
```

## Authentication

### Register

```tsx
import { useRegister } from "@/src/shared/api";

function RegisterScreen() {
  const register = useRegister({
    onSuccess: (data) => {
      console.log("Registration successful", data);
    },
    onError: (error) => {
      console.error("Registration failed", error);
    },
  });

  const handleRegister = () => {
    register.mutate({
      phone: "+1234567890",
      password: "mypassword",
      name: "John",
      surname: "Doe",
      role: "client",
    });
  };

  return (
    <Button onPress={handleRegister} loading={register.isPending}>
      Register
    </Button>
  );
}
```

### Login

```tsx
import { useLogin } from "@/src/shared/api";

function LoginScreen() {
  const login = useLogin({
    onSuccess: (data) => {
      // Token is automatically stored in AsyncStorage
      console.log("Login successful", data);
    },
  });

  const handleLogin = () => {
    login.mutate({
      login: "+1234567890",
      password: "mypassword",
    });
  };
}
```

### Get Current User

```tsx
import { useAuthorizedUser } from "@/src/shared/api";

function ProfileScreen() {
  const { data, isLoading, error } = useAuthorizedUser();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <View>
      <Text>{data?.data?.name}</Text>
      <Text>{data?.data?.email}</Text>
    </View>
  );
}
```

## Cars

### Get User's Cars

```tsx
import { useCars } from "@/src/shared/api";

function MyCarsScreen() {
  const { data, isLoading } = useCars();

  return (
    <FlatList
      data={data?.data || []}
      renderItem={({ item }) => <CarCard car={item} />}
    />
  );
}
```

### Create Car

```tsx
import { useCreateCar } from "@/src/shared/api";

function AddCarScreen() {
  const createCar = useCreateCar({
    onSuccess: () => {
      navigation.goBack();
    },
  });

  const handleSubmit = (formData) => {
    createCar.mutate({
      data: {
        brand: formData.brand,
        model: formData.model,
        plate_number: formData.plateNumber,
        color: formData.color,
        year: formData.year,
        seats: formData.seats,
      },
    });
  };
}
```

## Rides/Drives

### Create Drive

```tsx
import { useCreateDrive } from "@/src/shared/api";

function BookRideScreen() {
  const createDrive = useCreateDrive({
    onSuccess: (data) => {
      console.log("Ride created", data);
    },
  });

  const handleBook = () => {
    createDrive.mutate({
      from_address: "123 Main St",
      to_address: "456 Oak Ave",
      from_lat: 40.7128,
      from_lng: -74.006,
      to_lat: 40.758,
      to_lng: -73.9855,
      waiting_time: 10,
    });
  };
}
```

### Get Active Drives

```tsx
import { useActiveDrives } from "@/src/shared/api";

function ActiveRidesScreen() {
  const { data, isLoading, refetch } = useActiveDrives();

  return (
    <FlatList
      data={data?.data || []}
      renderItem={({ item }) => <DriveCard drive={item} />}
      refreshing={isLoading}
      onRefresh={refetch}
    />
  );
}
```

### Update Drive Status

```tsx
import { useUpdateDrive } from "@/src/shared/api";

function DriveDetailScreen({ driveId }) {
  const updateDrive = useUpdateDrive();

  const handleStart = () => {
    updateDrive.mutate({
      driveId,
      data: {
        action: "set_start_state",
        value: true,
      },
    });
  };

  const handleComplete = () => {
    updateDrive.mutate({
      driveId,
      data: {
        action: "set_complete_state",
        value: true,
      },
    });
  };

  const handleRate = (rating) => {
    updateDrive.mutate({
      driveId,
      data: {
        action: "set_rate",
        value: rating,
      },
    });
  };
}
```

## Trips (Stadium Profile)

### Get Available Trips

```tsx
import { useAvailableTrips } from "@/src/shared/api";

function TripsScreen() {
  const { data, isLoading } = useAvailableTrips();

  return (
    <FlatList
      data={data?.data || []}
      renderItem={({ item }) => <TripCard trip={item} />}
    />
  );
}
```

## Cart

### Manage Cart

```tsx
import { useCart, useAddToCart, useClearCart } from "@/src/shared/api";

function CartScreen() {
  const { data: cart } = useCart();
  const addToCart = useAddToCart();
  const clearCart = useClearCart();

  const handleAddItem = (tripId, seat) => {
    addToCart.mutate({ tripId, seat, count: 1 });
  };

  const handleClear = () => {
    clearCart.mutate();
  };

  return (
    <View>
      <FlatList data={cart?.data || []} />
      <Button onPress={handleClear}>Clear Cart</Button>
    </View>
  );
}
```

## Payments

### Create Payment

```tsx
import { useCreatePayment } from "@/src/shared/api";

function PaymentScreen() {
  const createPayment = useCreatePayment({
    onSuccess: () => {
      console.log("Payment created successfully");
    },
  });

  const handlePayment = (amount) => {
    createPayment.mutate({
      amount,
      type: "payment",
      description: "Ride payment",
    });
  };
}
```

### Deposit to Account

```tsx
import { useDeposit } from "@/src/shared/api";

function DepositScreen() {
  const deposit = useDeposit({
    onSuccess: () => {
      console.log("Deposit successful");
    },
  });

  const handleDeposit = (amount) => {
    deposit.mutate(amount);
  };
}
```

## Messages

### Get Messages

```tsx
import { useMessages, useSendMessage } from "@/src/shared/api";

function MessagesScreen() {
  const { data: messages } = useMessages();
  const sendMessage = useSendMessage();

  const handleSend = (userId, content) => {
    sendMessage.mutate({
      to_user_id: userId,
      content,
      type: "text",
    });
  };

  return <FlatList data={messages?.data || []} />;
}
```

## Location Updates

### Update Driver Location

```tsx
import { useUpdateLocation } from "@/src/shared/api";
import { useEffect } from "react";

function DriverLocationTracker() {
  const updateLocation = useUpdateLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      // Get current location from GPS
      const currentLocation = {
        lat: 40.7128,
        lng: -74.006,
        timestamp: new Date().toISOString(),
      };

      updateLocation.mutate(currentLocation);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);
}
```

## Direct API Calls

If you need to make direct API calls without React Query hooks:

```tsx
import { authApi, driveApi, userApi } from "@/src/shared/api";

// Direct calls
async function someFunction() {
  try {
    const user = await authApi.login({
      login: "user@example.com",
      password: "password",
    });

    const drives = await driveApi.getActiveDrives();

    const userData = await userApi.getAuthorizedUser();
  } catch (error) {
    console.error("API Error:", error);
  }
}
```

## Error Handling

All hooks support error handling through `onError` callback:

```tsx
const { data, error, isError } = useAuthorizedUser({
  onError: (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      navigation.navigate("Login");
    } else {
      // Show error message
      Alert.alert("Error", error.message);
    }
  },
});
```

## Cache Invalidation

TanStack Query automatically manages cache. To manually invalidate:

```tsx
import { queryClient, queryKeys } from "@/src/shared/api";

// Invalidate specific queries
queryClient.invalidateQueries({ queryKey: queryKeys.drives.active });

// Invalidate all user queries
queryClient.invalidateQueries({ queryKey: queryKeys.users.all });

// Clear all cache
queryClient.clear();
```
