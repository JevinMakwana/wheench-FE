'use client'
import React, { useEffect, useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';

import { Car, UserCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext';

import { Button, Popover } from 'antd';

export default function Navbar() {
    const { user, signOut } = useAuth();
    const [userData, setUserData] = useState<any>(null);
    const router = useRouter()

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    useEffect(() => {
        setUserData(user);
    }, [user]);

    const text = <span></span>;
    const userPopOverContent = (
        <div>
            <p>{userData?.full_name}</p>
            <p>{userData?.email}</p>
        </div>
    )

    return (
        <nav className="bg-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <Car className="h-6 w-6 text-blue-600" />
                        <span className="font-bold text-xl">RideShare</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Button
                                    type="primary"
                                    size="large"
                                    className={`w-full md:w-auto px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 
                                        ${!userData?.hostingTripId
                                            ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                                            : "bg-gray-400 text-gray-200 cursor-not-allowed border-none"
                                        }`}
                                    disabled={!!userData?.hostingTripId}
                                    onClick={() => {
                                        if (!userData?.hostingTripId) {
                                            router.push('/trip/create-trip');
                                        }
                                    }}
                                >
                                    Host a Trip
                                </Button>
                                <Popover placement="bottom" /*title={text}*/ content={userPopOverContent}>
                                    <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                                        <UserCircle className="h-6 w-6" />
                                    </Link>
                                </Popover>
                                <button
                                    onClick={handleSignOut}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    <LogOut className="h-6 w-6" />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}