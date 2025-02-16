'use client'

import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { cookiesGetItem } from '@/utils/commons';

const tripSchema = z.object({
    source: z.string().min(2, 'Source must be at least 2 characters'),
    destination: z.string().min(2, 'Destination must be at least 2 characters'),
    car: z.string().min(2, 'Car details must be provided'),
    totalseats: z.coerce.number().min(1, 'At least 1 seat required').max(10, 'Maximum 10 seats allowed'),
    takeofftime: z.string().min(1, 'Departure time is required'),
    price: z.coerce.number().min(0, 'Price must be a positive number'),
});

type TripForm = z.infer<typeof tripSchema>;

export default function CreateTrip() {
    const router = useRouter();
    const { user } = useAuth();
    const [form] = Form.useForm();

    const onSubmit = async (values: TripForm) => {
        if (!user) {
            message.error('User is not logged in');
            return;
        }
        try {
            const TOKEN = localStorage.getItem("authToken");
            const headers = { Authorization: `Bearer ${TOKEN}` };
            const res:any = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/${process.env.NEXT_PUBLIC_POST_A_TRIP}`, values, { headers });
            
            if (res.data.success) {
                message.success('Trip created successfully!');
                router.push('/');
            }else{
                console.log("ELSE-errored res:", res)
                message.error(res.error.message)
            }
        } catch (error:any) {
            console.log('CATCH-ERROR', error)
            message.error(error.response?.data?.message || 'Error while creating a trip. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <Card className="w-full max-w-lg p-6 bg-white/10 backdrop-blur-md shadow-lg rounded-xl border border-white/20 text-white">
                <h1 className="text-3xl font-bold text-center mb-6">Create a Trip</h1>
                <Form
                    form={form}
                    layout="horizontal"
                    onFinish={onSubmit}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                >
 <Form.Item label="From" name="source" rules={[{ required: true, message: 'Source is required' }]}> 
                                   <Input />
                               </Form.Item>
                               <Form.Item label="To" name="destination" rules={[{ required: true, message: 'Destination is required' }]}> 
                                   <Input />
                               </Form.Item>
                               <Form.Item label="Car Details" name="car" rules={[{ required: true, message: 'Car details are required' }]}> 
                                   <Input />
                               </Form.Item>
                               <Form.Item label="Total Seats" name="totalseats" rules={[{ required: true, message: 'Total seats are required' }]}> 
                                   <Input type="number" min="1" max="10" />
                               </Form.Item>
                               <Form.Item label="Departure Time" name="takeofftime" rules={[{ required: true, message: 'Departure time is required' }]}> 
                                   <Input type="datetime-local" />
                               </Form.Item>
                               <Form.Item label="Price (INR)" name="price" rules={[{ required: true, message: 'Price is required' }]}> 
                                   <Input type="number" min="0" />
                               </Form.Item>
                               <Form.Item 
                               // wrapperCol={{ offset: 8, span: 16 }}
                               >
                                   <Button type="primary" htmlType="submit" className="w-full">
                                       Create Trip
                                   </Button>
                               </Form.Item>
                </Form>
            </Card>
        </div>
    );
}