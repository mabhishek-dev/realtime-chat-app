import { create } from "zustand";
import axiosInstance from "../lib/axios.ts";
import { toast } from "react-hot-toast";
import { io, Socket } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

interface User {
  _id: string;
  fullname: string;
  email: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  authUser: User | null;
  isLoggingIn: boolean;
  isSigningUp: boolean;
  isCheckingAuth: boolean;
  isUpdatingProfile: boolean;
  checkAuth: () => Promise<void>;
  signUp: (data: {
    fullname: string;
    email: string;
    password: string;
  }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { profilePicture?: string }) => Promise<void>;
  onlineUsers: string[]; // Array of online user IDs from WebSocket updates
  connectSocket: () => void; // Action to connect to WebSocket for real-time chat
  socket: Socket | null; // Store the WebSocket instance to manage connection and events
  disconnectSocket: () => void; // Action to disconnect from WebSocket when user logs out
}

// Zustand store for authentication state
export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // Action to check if the user is authenticated
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check-auth");
      set({ authUser: res.data });
      get().connectSocket(); // Connect to WebSocket after successful auth check/login/sign up to receive real-time updates about online users
    } catch (error) {
      console.error("Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      toast.success("Sign up successful! You can now log in.");
      set({ authUser: res.data });

      get().connectSocket();
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Error signing up. Please try again.");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully!");

      get().connectSocket();
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Invalid email or password. Please try again.");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!");
      get().disconnectSocket(); // Disconnect from WebSocket on logout to stop receiving updates about online users
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out. Try again.");
    }
  },

  updateProfile: async (data: { profilePicture?: string }) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile. Try again.");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return; // Don't connect if user is not authenticated or if socket is already connected
    const socket = io(BASE_URL, {
      query: { userId: authUser._id }, // Send user ID as query parameter for server to identify which user is connecting
      withCredentials: true,
    });

    set({ socket });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("getOnlineUsers", (onlineUserIds: string[]) => {
      set({ onlineUsers: onlineUserIds });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
    set({ socket: null, onlineUsers: [] }); // Clear online users list on disconnect to reflect that the user is no longer online
  },
}));
