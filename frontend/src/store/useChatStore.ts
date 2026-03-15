import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  fullname: string;
  email: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isLoadingMessages: boolean;
  isLoadingUsers: boolean;
  fetchMessages: (userId: string) => Promise<void>;
  fetchUsers: () => Promise<void>;
  setSelectedUser: (selectedUser: User | null) => void;
  sendMessage: (messageData: {
    message?: string;
    image?: string;
  }) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isLoadingMessages: false,
  isLoadingUsers: false,

  fetchUsers: async () => {
    set({ isLoadingUsers: true });
    try {
      const res = await axiosInstance.get<User[]>("/messages/users");
      set({ users: res.data });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      set({ isLoadingUsers: false });
    }
  },

  fetchMessages: async (userId: string) => {
    set({ isLoadingMessages: true });
    try {
      const res = await axiosInstance.get<Message[]>(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch messages");
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  sendMessage: async (messageData: { message?: string; image?: string }) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return;
    try {
      const res = await axiosInstance.post<Message>(
        `/messages/send/${selectedUser._id}`,
        {
          ...messageData,
          receiverId: selectedUser._id,
        },
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const { socket } = useAuthStore.getState();
    if (!socket) return; // Don't subscribe if socket is not connected

    socket.on("newMessage", (newMessage: Message) => {
      // Only add the new message to the state if it belongs to the currently selected conversation
      if (
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id
      ) {
        set((state) => ({ messages: [...state.messages, newMessage] }));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const { socket } = useAuthStore.getState();

    if (!socket) return;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser: User | null) => set({ selectedUser }),
}));
