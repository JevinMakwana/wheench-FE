'use client'
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export default function () {
    const { user } = useAuth();
    const [userData, setUserData] = useState<any>(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setUserData(user);
        setLoading(false);
    }, [user])

 
    if (loading) {
        return (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        );
      }
    return (<>
        {userData?.email}
    </>)
}