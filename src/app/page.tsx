'use client'
// import SeachBar from "./components/searchbar";
import Navbar from "./components/Navbar";
import { MapPin, Calendar, Users, IndianRupee } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import Link from "next/link";
import useGetApi from "@/hooks/useGetApi";

export default function Home() {
  const {
    isLoading: liveTripsDataLoading,
    error: liveTripsDataError,
    data: liveTripsData
  } = useGetApi(`trips`);

  if (liveTripsDataLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* <SeachBar />
      <div className="flex justify-center w-full border">
      <RecipeReviewCard />
      </div> */}
      <Navbar />
      <>
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">Find Your Next Ride</h1>
            <p className="mt-2 text-lg text-gray-600">
              Connect with Hosts heading your way
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveTripsData?.trips?.length && liveTripsData?.trips?.map((trip:any) => (
            <Link
              key={trip._id}
              href={`/trip/trip-details/${trip._id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={trip.hostInfo?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(trip.car)}`}
                  alt={trip.hostInfo?.username}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-lg">{trip.hostInfo?.username}</h3>
                  <p className="text-gray-500 text-sm">Host</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span>{trip.source} → {trip.destination}</span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span>{format(new Date(parseISO(trip.takeofftime)), "dd-MM-yyyy")}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="h-5 w-5" />
                    <span>{+trip.totalseats - +trip.guestIds?.length} seats left</span>
                  </div>

                  <div className="flex items-center space-x-1 text-green-600 font-semibold">
                    <IndianRupee className="h-5 w-5" />
                    <span>{trip.price}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {liveTripsData?.trips?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No trips available at the moment.</p>
          </div>
        )}
      </>
    </div>
  );
}
