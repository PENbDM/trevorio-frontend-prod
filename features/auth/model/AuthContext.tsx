"use client";

import {
    createContext,
    useContext,
} from "react";

import type { ReactNode } from "react";

import { useMe } from "./useAuth";
import type { User } from "./types";


type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
};


const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined
    );


export function AuthProvider({
                                 children,
                             }: {
    children: ReactNode;
}) {
    const {
        data: user,
        isLoading,
        isSuccess,
    } = useMe();

    return (
        <AuthContext.Provider
            value={{
                user: user ?? null,
                isLoading,
                isAuthenticated:
                    isSuccess && !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}