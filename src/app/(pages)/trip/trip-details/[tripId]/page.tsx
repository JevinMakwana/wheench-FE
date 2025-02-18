"use client";

import { useAuth } from "@/contexts/AuthContext";
import useGetApi from "@/hooks/useGetApi";
import usePostApi from "@/hooks/usePostApi";
import { Button, message } from "antd";
import { format, parseISO } from "date-fns";
import { Calendar, Car, IndianRupee, MapPin, User, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

const TripDetails = () => {
    const { tripId } = useParams<{ tripId: string }>();
    const { postData } = usePostApi();
    const [booking, setBooking] = useState(false);
    const { user } = useAuth() as {user: any};

    const {
        isLoading: tripDetailsLoading,
        error: tripDetailsError,
        data: tripDetails
    } = useGetApi(`trips/${tripId}`);

    const handleBooking = async () => {
        if (!user._id) {
            message.error("User not found. Please log in.");
            return;
        }

        try {
            setBooking(true); // Disable button while booking
            await postData(`guest/book`, { tripId }, '/');
        } catch (error: any) {
            console.error("Error booking trip:", error);
            message.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setBooking(false); // Re-enable button
        }
    };

    if (tripDetailsLoading) {
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

    const isHost = user?._id === tripDetails.hostId;
    const canBook = (user?._id && !isHost && tripDetails?.totalseats > tripDetails.guestIds?.length && !tripDetails.guestIds?.some((guest: any) => guest._id === user._id)) || false;

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
                
                {user?._id && tripDetails?._id !== user._id && (
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