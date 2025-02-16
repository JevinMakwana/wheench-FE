'use client'
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { MapPin, Calendar, IndianRupee } from 'lucide-react';
import { Booking, Trip } from '@/app/types';
import { useAuth } from '@/contexts/AuthContext';
// import { supabase } from '../lib/supabase';
// import type { Booking, Trip } from '../types';

export default function Profile() {
  const { user } = useAuth();
  const [hostedTrips, setHostedTrips] = useState<Trip[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     console.log(user, '<------user from profile')
//     async function fetchUserTrips() {
//       if (!user) return;

//       const [hostedResult, bookingsResult] = await Promise.all([
//         supabase
//           .from('trips')
//           .select('*')
//           .eq('host_id', user.id)
//           .order('departure_time', { ascending: true }),
//         supabase
//           .from('bookings')
//           .select(`
//             *,
//             trip:trips(*)
//           `)
//           .eq('guest_id', user.id)
//           .eq('status', 'confirmed')
//           .order('created_at', { ascending: false }),
//       ]);

//       if (hostedResult.data) setHostedTrips(hostedResult.data);
//       if (bookingsResult.data) setBookings(bookingsResult.data);
//       setLoading(false);
//     }

//     fetchUserTrips();
//   }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Hosted Trips</h2>
        {hostedTrips.length === 0 ? (
          <p className="text-gray-500">You haven't hosted any trips yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hostedTrips.map((trip) => (
              <div key={trip._id} className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-5 w-5" />
                    <span>{trip.source} → {trip.destination}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-5 w-5" />
                    <span>{format(new Date(trip.takeofftime), 'PPp')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <IndianRupee className="h-5 w-5" />
                    <span>{trip.price}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {trip.available_seats} seats available
                </div>
                <div className="text-sm font-medium text-indigo-600">
                  Status: {trip.available_seats}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500">You haven't booked any trips yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md p-6 space-y-4">
                {booking.trip && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="h-5 w-5" />
                        <span>{booking.trip.source} → {booking.trip.destination}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="h-5 w-5" />
                        <span>{format(new Date(booking.trip.takeofftime), 'PPp')}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <IndianRupee className="h-5 w-5" />
                        <span>{booking.trip.price}</span>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-indigo-600">
                      Status: {booking.status}
                    </div>
                    {booking.trip_completed ? (
                      <div className="text-sm font-medium text-green-600">
                        Trip Completed
                      </div>
                    ) : (
                      <div className="text-sm font-medium text-blue-600">
                        Trip Pending
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}