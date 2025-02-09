'use client'
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().min(10),
    full_name: z.string().min(2),
    username: z.string().min(3),
    gender: z.enum(['male', 'female', 'other']),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUp() {
    const navigate = useRouter();
      const { signUp } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpForm>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpForm) => {
        console.log('form data====', data);
        try {
            await signUp(data);
            //   toast.success('Account created successfully!');
            navigate.push('/');
        } catch (error) {
            console.error('Failed to create account');
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        {...register('email')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        {...register('password')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        {...register('phone')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        {...register('full_name')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.full_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        {...register('username')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.username && (
                        <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                        {...register('gender')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                        <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
}