import { toast } from "sonner";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const BE_URL = process.env.NEXT_PUBLIC_BE_URL;
export const API_URL = BE_URL || "http://localhost:3000";

// --------------------
// Axios instance
// --------------------
const axiosInstance = axios.create({
    baseURL: "/proxy",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// --------------------
// Universal GET hook
// --------------------
/**
 * Fetch data from API using React Query
 * @param key - unique query key
 * @param endpoint - API route (without base URL)
 */
export const useFetch = <T>(key: string, endpoint: string) => {
    return useQuery<T>({
        queryKey: [key],
        queryFn: async () => {
            const { data } = await axiosInstance.get(endpoint);
            return data;
        },
    });
};

/**
 * Perform POST, PATCH or DELETE requests
 * @param endpoint - API route (without base URL)
 * @param method - HTTP method
 */
export const useMutationApi = <T, V>(
    endpoint: string,
    method: "post" | "patch" | "delete"
) => {
    const queryClient = useQueryClient();

    return useMutation<T, unknown, V>({
        mutationFn: async (payload: V) => {
            let response;

            switch (method) {
                case "post":
                case "patch":
                    response = await axiosInstance[method](endpoint, payload);
                    break;

                case "delete":
                    response = await axiosInstance.delete(endpoint, {
                        data: payload,
                    });
                    break;

                default:
                    throw new Error(`Unsupported method: ${method}`);
            }

            return response.data;
        },

        onSuccess: (data: any) => {
            // toast.success(data?.message || "Action successful ✅");
            queryClient.invalidateQueries(); // refetch all queries after mutation
        },

        onError: (error: any) => {
            console.error(
                `❌ Error during [${method.toUpperCase()} ${endpoint}]:`,
                error
            );
            // toast.error("Something went wrong. Please try again.");
        },
    });
};

export const fetcher = async <T = unknown>(
    endpoint: string,
    options = {}
): Promise<T> => {
    try {
        const res = await fetch(`${API_URL}${endpoint}`, options);
        const response: T = await res.json();

        if (!res.ok || (response as any)?.success === false) {
            throw new Error(
                (response as any)?.message || "Something went wrong"
            );
        }
        console.log(response);
        return response;
    } catch (error: any) {
        console.log("API Error:", error.message);
        toast.error("API Error:", error.message);
        throw error;
    }
};
