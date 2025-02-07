'use client'
import React from 'react';
// import { useAuth } from '../contexts/AuthContext';

import { Car, UserCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
    const { user, signOut } = useAuth();
    const router = useRouter()

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

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
                                <Link
                                    href="/create-trip"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Host a Trip
                                </Link>
                                <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                                    <UserCircle className="h-6 w-6" />
                                </Link>
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
                                    href="/register"
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