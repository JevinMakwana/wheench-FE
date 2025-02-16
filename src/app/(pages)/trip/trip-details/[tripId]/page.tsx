"use client";

import { Booking, Trip } from "@/app/types";
import { Button, message } from "antd";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { Calendar, Car, IndianRupee, MapPin, User, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TripDetails = () => {
    const { tripId } = useParams<{ tripId: string }>();
    const router = useRouter();

    const [tripDetails, setTripDetails] = useState<Trip | any>();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [parsedUserId, setParsedUserId] = useState<string | null>(null);

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

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            const parsedUser = JSON.parse(user);
            setParsedUserId(parsedUser?._id || null);
        }
    }, []);

    const handleBooking = async () => {
        if (!parsedUserId) {
            message.error("User not found. Please log in.");
            return;
        }

        try {
            setBooking(true); // Disable button while booking
            console.log("parsedUserId:", parsedUserId);

            const TOKEN = localStorage.getItem("authToken");
            if (!TOKEN) {
                message.error("Authentication failed. Please log in again.");
                return;
            }

            const headers = { Authorization: `Bearer ${TOKEN}` };
            console.log("Trip ID to be booked:", tripId);

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/v1/guest/book`,
                { tripId },
                { headers }
            );

            console.log("handleBooking response", response);

            if (response.data.success) {
                message.success(response.data.message);
                router.push("/"); // Redirect after successful booking
            } else {
                message.error(response.data.message || "Booking failed. Please try again.");
            }
        } catch (error: any) {
            console.error("Error booking trip:", error);
            message.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setBooking(false); // Re-enable button
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }
    console.log('tripDetails', tripDetails)
    if (!tripDetails) {
        return <div>Trip not found</div>;
    }

    // const hasBooked = bookings.some(booking => booking.guest_id === user?.id);
    const isHost = parsedUserId === tripDetails.hostId;
    const canBook = (parsedUserId && !isHost && tripDetails?.totalseats > tripDetails.guestIds?.length && !tripDetails.guestIds?.some((guest: any) => guest._id === parsedUserId)) || false;

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
                            <span>{format(new Date(parseISO(tripDetails.takeofftime)), "dd-MM-yyyy")}</span>

                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <IndianRupee className="h-5 w-5" />
                            <span>{tripDetails.price} INR</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Car className="h-5 w-5" />
                            <span>{tripDetails.car}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Users className="h-5 w-5" />
                            <span>{+tripDetails.totalseats - +tripDetails.guestIds?.length} seats left out of total {+tripDetails.totalseats} seats</span>
                        </div>
                    </div>

                    <div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-2">Host Details</h3>
                            <div className="flex items-center space-x-2 text-gray-600">
                                <User className="h-5 w-5" />
                                <span>{tripDetails.hostInfo?.full_name}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="font-medium text-gray-900 mb-4">Passengers ({tripDetails.guestIds?.length})</h3>
                    <div className="space-y-2">
                        {tripDetails.guestIds?.map((guest: any) => (
                            <div key={guest._id} className="flex items-center space-x-2 text-gray-600">
                                <User className="h-5 w-5" />
                                <span>{guest.full_name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                {parsedUserId && tripDetails?._id !== parsedUserId && (
                    <Button
                        type="primary"
                        size="large"
                        loading={booking}
                        className={`w-full md:w-auto px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 
                            ${canBook
                                ? "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
                                : "bg-gray-400 text-gray-200 cursor-not-allowed border-none"
                            }`}
                        disabled={!canBook}
                        onClick={handleBooking}
                    >
                        {booking ? 'Booking...' : 'Book a Seat'}
                    </Button>
                )}

            </div>
        </div>
    );
}

export default TripDetails;