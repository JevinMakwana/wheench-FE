"use client";
import { useState, useEffect } from "react";
import axios from "axios";
// import { message } from "antd";
import { /*checkTokenExpiration,*/ cookiesGetItem } from "@/utils/commons";
import { useRouter } from "next/navigation";

const useGetApi = (endpoint: string) => {
    const history = useRouter();
    const [isLoading, setIsLoading] = useState<any>(true);
    const [error, setError] = useState<any>(null);
    const [data, setData] = useState<any>([]);

    const fetchData = async (dynamicEndpoint: string) => {
        console.log('dynamicEndpoint------>', dynamicEndpoint)
        console.log('endpoint------>', endpoint)
        setIsLoading(true);
        setError(null);

        const TOKEN = cookiesGetItem("authToken");
        // const isExpired = await checkTokenExpiration(TOKEN);
        const isExpired = false;
        if (isExpired) {
            history.push("/");
        } else {
            try {
                const headers = {
                    Authorization: `Bearer ${TOKEN}`,
                };
                const response = await axios.get(
                    `${process.env.NODE_PUBLIC_BASE_URL}/v1/${dynamicEndpoint ? dynamicEndpoint : endpoint
                    }`,
                    {
                        headers,
                    }
                );

                if (response.status !== 200) {
                    throw new Error("Request failed");
                }

                const responseData = response.data;
                setData(responseData);
                setIsLoading(false);
            } catch (error: any) {
                if (error.code !== "ERR_NETWORK") {
                    if (error.response.status === 401) {
                        throw ("You are not authorized; please log in again.");
                    }
                }

                setIsLoading(false);
                setError(error);
            }
        }
    };

    useEffect(() => {
        if (endpoint) {
            fetchData("");
        }
    }, [endpoint]);

    const refetch = (dynamicEndpoint?: string) => {
        if (dynamicEndpoint) {
            fetchData(dynamicEndpoint);
        }
    };

    return { isLoading, error, data, refetch };
};

export default useGetApi;
