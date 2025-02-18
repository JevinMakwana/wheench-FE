'use client'
import usePostApi from '@/hooks/usePostApi';
import { storeUserInfo } from '@/utils/commons';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    user: null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (data: { email: string; full_name: string; gender: string; password: string; phone: string; username: string }) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { postData } = usePostApi();
    const [user, setUser] = useState<any>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Restore user from localStorage
        }
        setLoading(false);
    }, []);


    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            const response = await postData(`${process.env.NEXT_PUBLIC_LOGIN}`, { email, password }, '/', true)
            if (response?.token) {
                storeUserInfo(response);
                setUser(response.user); // Update user state
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Login error:", error);
        }
    };

    const signUp = async ({ email, full_name, gender, password, phone, username }: { email: string; full_name: string; gender: string; password: string; phone: string; username: string }) => {
        const payload = {
            email,
            full_name,
            gender,
            password,
            phone,
            username,
        }

        const response = await postData(`${process.env.NEXT_PUBLIC_REGISTER}`, payload, '/')
        if (response?.data?.token) {
            storeUserInfo(response.data);
            setUser(response.data.user); // Update user state
        }
    };

    const signOut = async () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}