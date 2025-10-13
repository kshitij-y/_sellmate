"use client";
import { useEffect, useCallback, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { fetcher, useFetch, useMutationApi } from "@/lib/TanStack-Query/api";
// import ApiResponse from "@/lib/types/apiResponse";
import User from "@/lib/types/User";
import { setUser, setLoading, setError } from "@/lib/store/Slices/authSlice";
// import { toast } from "sonner";

// export const useProfile = () => {
//     const dispatch = useDispatch();
//     const user = useSelector((state: RootState) => state.auth.user);
//     const loading = useSelector((state: RootState) => state.auth.loading);
//     const error = useSelector((state: RootState) => state.auth.error);
//     const [updating, setUpdating] = useState(false);
//     const [updateError, setUpdateError] = useState<string | null>(null);

//     const hasFetched = useRef(false);

//     const fetchUserProfile = useCallback(async () => {
//         if (loading || hasFetched.current) return;
//         hasFetched.current = true;

//         dispatch(setLoading(true));
//         try {
//             const result = await fetcher<ApiResponse<User>>(
//                 "/api/user/profile",
//                 {
//                     method: "GET",
//                     headers: { "Content-Type": "application/json" },
//                     credentials: "include",
//                 }
//             );

//             if (result.success && result.data) {
//                 dispatch(setUser(result.data));
//             } else {
//                 dispatch(setError(result.error || "Failed to load profile"));
//             }
//         } catch (error: any) {
//             dispatch(setError(error.message || "An unknown error occurred"));
//         } finally {
//             dispatch(setLoading(false));
//         }
//     }, [dispatch, loading]);

//     useEffect(() => {
//         if (!user) fetchUserProfile();
//     }, [fetchUserProfile, user]);

//     const reloadProfile = async () => {
//         hasFetched.current = false;
//         await fetchUserProfile();
//     };

//     const updateUserProfile = useCallback(
//         async (updatedUser: Partial<User>) => {
//             setUpdating(true);
//             setUpdateError(null);

//             try {
//                 const result = await fetcher<ApiResponse<User>>(
//                     "/api/user/profile/update",
//                     {
//                         method: "PATCH",
//                         headers: { "Content-Type": "application/json" },
//                         body: JSON.stringify(updatedUser),
//                         credentials: "include",
//                     }
//                 );

//                 if (result.success && result.data) {
//                     dispatch(setUser(result.data));
//                     toast.success("Profile updated successfully!");
//                 } else {
//                     setUpdateError(result.error || "Failed to update profile");
//                     toast.error(result.error || "Failed to update profile");
//                 }
//             } catch (error: any) {
//                 setUpdateError(error.message || "An unknown error occurred");
//                 toast.error(error.message || "An unknown error occurred");
//             } finally {
//                 setUpdating(false);
//             }
//         },
//         [dispatch]
//     );

//     return {
//         user,
//         loading,
//         error,
//         updateUserProfile,
//         updating,
//         updateError,
//         reloadProfile,
//     };
// };

export const useUserProfile = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector(
        (state: RootState) => state.auth
    );

    const {
        data,
        isLoading,
        isError,
        refetch: refetchProfile,
    } = useFetch<{
        success: boolean;
        message: string;
        data: User;
    }>("userProfile", "/api/user/profile");

    const updateProfile = useMutationApi<
        { success: boolean; message: string; data: User },
        Partial<User>
    >("/api/user/profile/update", "patch");

    // Move dispatch calls inside useEffect
    useEffect(() => {
        if (!isLoading) {
            if (data?.success && data.data) {
                dispatch(setUser(data.data));
            }

            dispatch(setLoading(isLoading));
            if (isError && !error) {
                dispatch(setError("Failed to fetch user profile"));
            }
        }
    }, [data, isLoading, isError, error, dispatch]);

    return {
        user: data?.data || user,
        loading: isLoading,
        error: error || (isError ? "Failed to fetch profile" : null),
        refetchProfile,
        updateProfile: updateProfile.mutateAsync,
    };
};
