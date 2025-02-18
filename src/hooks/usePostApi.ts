"use client";
// import { checkTokenExpiration, cookiesGetItem } from "@/utils/commons";
import { message } from "antd";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import Cookies from "js-cookie";

const usePostApi = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false); // Initialize loading state

    const postData = async (
        endpoint: string,
        data: any,
        redirectPath: string,
        isFromLogin?: boolean
    ): Promise<any> => {
        try {
            if (!isFromLogin) {
                const TOKEN = localStorage.getItem("authToken");
                // await checkTokenExpiration(TOKEN);
                if (!TOKEN) {
                    message.error("Authentication failed. Please log in again.");
                    return;
                }
                const headers = {
                    Authorization: `Bearer ${TOKEN}`,
                };
                setIsLoading(true);
                const response: AxiosResponse<any> = await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/v1/${endpoint}`,
                    data,
                    {
                        headers,
                    }
                );
                console.log('response+-->', response)

                if (response.status !== 200) {
                    throw new Error("Request failed");
                }

                const msg = response.data;
                switch (msg.statusText) {
                    case "success":
                        message.success(msg?.message);
                        if (redirectPath) {
                            router.push(redirectPath);
                        }
                        setIsLoading(false);
                        return msg;

                    case "fail":
                        message.error(msg?.message);
                        setIsLoading(false);
                        return false;
                }
                return msg.data;
            } else {
                const response: any = await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/v1/${endpoint}`,
                    data
                );

                if (response.status !== 200) {
                    throw new Error("Request failed");
                }

                switch (response.data?.statusText) {
                    case 'success':
                        message.success("Welcome, You've logged in successfully!");
                        // if (loginRes?.data?.access_token) {
                        //   localStorage.setItem("authToken", loginRes.data.access_token);  
                        // }

                        // if (loginRes?.data?.name) {
                        //   Cookies.set("username", loginRes.data.name, { expires: 1 });
                        // }

                        // if (loginRes?.data?.id) {
                        //   Cookies.set("userid", loginRes.data.id, { expires: 1 });
                        // }

                        if (redirectPath) {
                            router.push(redirectPath);
                        }
                        return response.data.data;

                    case 'fail':
                        message.error(response.data?.message);
                        return false;

                    default:
                        break;
                }
                return response.data.data;
            }
        } catch (error: any) {
            if (error.code !== "ERR_NETWORK") {
                if (error.response.status === 401) {
                    message.error("You are not authorized; please log in again.");
                }
            }
            message.error(error?.response?.data?.message);
            setIsLoading(false);
        }
    };

    return { postData, isLoading };
};

export default usePostApi;
