"use client";

import { Booking, Trip } from "@/app/types";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { Calendar, Car, IndianRupee, MapPin, User } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const TripDetails = () => {
    const { tripId } = useParams<{ tripId: string }>();
    const [tripDetails, setTripDetails] = useState<Trip | any>();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        const fetchTripDetails = async () => {
            const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
            console.log('Base URL:', baseURL);

            try {
                const response = await axios.get(`${baseURL}/v1/trips/${tripId}`);
                setTripDetails(response.data);
                setLoading(false);
                console.log('response->>', response.data);
            } catch (error) {
                console.error('Error fetching trip details:', error);
            }
        };

        fetchTripDetails();
    }, [tripId]);

    const handleBooking = async () => {}

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!tripDetails) {
        return <div>Trip not found</div>;
    }

    // const isHost = user?.id === trip.host_id;
    // const hasBooked = bookings.some(booking => booking.guest_id === user?.id);
    const canBook = true /* !isHost && !hasBooked && trip.available_seats > 0;*/

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Trip Details</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <MapPin className="h-5 w-5" />
                            <span>{tripDetails.source} → {tripDetails.destination}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="h-5 w-5" />
                            <span>{format(new Date(parseISO(tripDetails.takofftime)), "dd-MM-yyyy")}</span>

                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <IndianRupee className="h-5 w-5" />
                            <span>{tripDetails.price} INR</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Car className="h-5 w-5" />
                            <span>{tripDetails.car}</span>
                        </div>
                    </div>

                    <div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-2">Host Details</h3>
                            <div className="flex items-center space-x-2 text-gray-600">
                                <User className="h-5 w-5" />
                                <span>{tripDetails.host?.full_name}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="font-medium text-gray-900 mb-4">Passengers ({bookings.length})</h3>
                    <div className="space-y-2">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="flex items-center space-x-2 text-gray-600">
                                <User className="h-5 w-5" />
                                <span>{booking.guest?.full_name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {canBook && (
                    <button
                        onClick={handleBooking}
                        disabled={booking}
                        className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {booking ? 'Booking...' : 'Book Seat'}
                    </button>
                )}
            </div>
        </div>
    );
}

export default TripDetails;