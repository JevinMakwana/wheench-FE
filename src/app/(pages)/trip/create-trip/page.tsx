'use client'
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { cookiesGetItem } from '@/utils/commons';

const tripSchema = z.object({
    source: z.string().min(2),
    destination: z.string().min(2),
    car: z.string().min(2),
    totalseats: z.number().min(1).max(10),
    takeofftime: z.string(),
    price: z.number().min(0),
});

type TripForm = z.infer<typeof tripSchema>;

export default function CreateTrip() {
    const navigate = useRouter();
    const { user } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TripForm>({
        resolver: zodResolver(tripSchema),
    });

    const onSubmit = async (data: TripForm) => {
        if (!user) return;
        try {
            console.log('data:', data);
            const TOKEN = cookiesGetItem("authToken");
            const headers = {
                Authorization: `Bearer ${TOKEN}`,
            };
            const res:any = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/${process.env.NEXT_PUBLIC_POST_A_TRIP}`, {
                ...data
            }, {
                headers,
            });
            console.log('res', res)
            if(res.data.success)
              navigate.push('/');
        } catch (error) {
            console.error('error while creating a trip', error);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Create a Trip</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">From</label>
                    <input
                        type="text"
                        {...register('source')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.source && (
                        <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">To</label>
                    <input
                        type="text"
                        {...register('destination')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.destination && (
                        <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Car Details</label>
                    <input
                        type="text"
                        {...register('car')}
                        placeholder="e.g., Honda Civic - White - KA01AB1234"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.car && (
                        <p className="mt-1 text-sm text-red-600">{errors.car.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Total Seats</label>
                    <input
                        type="number"
                        {...register('totalseats', { valueAsNumber: true })}
                        min="1"
                        max="10"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.totalseats && (
                        <p className="mt-1 text-sm text-red-600">{errors.totalseats.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Departure Time</label>
                    <input
                        type="datetime-local"
                        {...register('takeofftime')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.takeofftime && (
                        <p className="mt-1 text-sm text-red-600">{errors.takeofftime.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Price (INR)</label>
                    <input
                        type="number"
                        {...register('price', { valueAsNumber: true })}
                        min="0"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.price && (
                        <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isSubmitting ? 'Creating Trip...' : 'Create Trip'}
                </button>
            </form>
        </div>
    );
}