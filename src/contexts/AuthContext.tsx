'use client'
import { cookiesSetItem } from '@/utils/commons';
import { message } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
// import { supabase } from '../lib/supabase';
// import type { User } from '@supabase/supabase-js';

interface AuthContextType {
    user: null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (data: { email: string; full_name: string; gender: string; password: string; phone: string; username: string }) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useRouter();

      useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Restore user from localStorage
        }
        setLoading(false);
      }, []);

    const storeUserInfo = (data:any) => {   
        if (data.token) {
            localStorage.setItem("authToken", data.token);
        }
        localStorage.setItem('user', JSON.stringify(data.user)); // Store user details in localStorage
        setUser(data.user); // Update user state
    }

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            const response: any = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/${process.env.NEXT_PUBLIC_LOGIN}`, {
                email,
                password
            });
            console.log("response----", response);
            if (response.data.token) {
                storeUserInfo(response.data);
                navigate.push('/');
            }else {
                message.error("User not found");
            }
            setLoading(false);
            return response;
        } catch (error) {
            setLoading(false);
            // message.error(`Login error: ${error}`);
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
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/${process.env.NEXT_PUBLIC_REGISTER}`, payload, { headers: { "Content-Type": "application/json" } })
        if (response.data.token) {
            storeUserInfo(response.data);
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