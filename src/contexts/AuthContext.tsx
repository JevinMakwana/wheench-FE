'use client'
import { cookiesSetItem } from '@/utils/commons';
import axios from 'axios';
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

      useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Restore user from localStorage
        }
        setLoading(false);
      }, []);

    const storeUserInfo = (data:any) => {
        if (data.token) {
            cookiesSetItem("authToken", data.token);
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

            if (response.data.token) {
                storeUserInfo(response.data);
            }
        } catch (error) {
            console.error("Login error:", error);
        }
        setLoading(false);
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

        // const { error: signUpError, data } = await supabase.auth.signUp({ 
        //   email, 
        //   password,
        //   options: {
        //     data: { full_name: fullName }
        //   }
        // });
        // if (signUpError) throw signUpError;

        // if (data.user) {
        //   const { error: profileError } = await supabase
        //     .from('users')
        //     .insert([{ id: data.user.id, email, full_name: fullName }]);

        //   if (profileError) throw profileError;
        // }
    };

    const signOut = async () => {
        cookiesSetItem("token", "");
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