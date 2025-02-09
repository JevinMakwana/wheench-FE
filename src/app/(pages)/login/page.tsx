'use client'
// import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { useAuth } from '../contexts/AuthContext';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
    const naviget = useRouter();
    // const { signIn } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        // try {
        //     await signIn(data.email, data.password);
        //     toast.success('Logged in successfully!');
        //     navigate.push('/');
        // } catch (error) {
        //     toast.error('Invalid email or password');
        // }
    };

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
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

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}