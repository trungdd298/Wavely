import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,
    
    clearState: () => set({
        accessToken: null,
        user: null,
        loading: false
    }),
    
    signUp: async (username, password, email, firstName, lastName) => {
        try {
            set({ loading: true });
            
            // call backend API to create account
            await authService.signUp(username, password, email, firstName, lastName);
            
            toast.success("Account created successfully! Please sign in.");
        } catch (error) {
            console.error("Sign up failed:", error);
            toast.error("Sign up failed. Please try again.");
        } finally {
            set({ loading: false });
        }
    },
    
    signIn: async (username, password) => {
        try {
            set({ loading: true });
            
            const { accessToken } = await authService.signIn(username, password);
            set({ accessToken });
            
            toast.success("Signed in successfully!");
            
        } catch (error) {
            console.error("Sign in failed:", error);
            toast.error("Sign in failed. Please try again.");
        } finally {
            set({ loading: false });
        }
    },
    
    signOut: async () => {
        try {
            get().clearState();
            await authService.signOut();
            toast.success("Signed out successfully!");
        } catch (error) {
            console.error("Sign out failed:", error);
            toast.error("Sign out failed. Please try again.");
        }
    },
}));
