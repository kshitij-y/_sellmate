/*
login, signUp -> post methods are done through useMutaion

*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn, signUp } from "@/lib/auth-client";
import { useDispatch } from "react-redux";
import { setLoading, setError, setUser, setToken } from "@/lib/store/Slices/authSlice";
import { toast } from "sonner";

const FE_URL = process.env.NEXT_PUBLIC_FE_URL || "http://localhost:3001";

export const useAuthMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const signInMutation = useMutation({
    mutationFn: async (Credential: { email: string; password: string }) => {
      dispatch(setLoading(true));
      const response = await signIn.email({
        email: Credential.email,
        password: Credential.password,
      });

      if (response?.error) {
        dispatch(
          setError(
            response.error?.message ||
              "An unknown error occured during signIn Mutation"
          )
        );
        throw new Error(response.error.message || "Sign-in failed");
      }

      return response;
    },

    onSuccess: (response) => {
      dispatch(setLoading(false));
      dispatch(setToken(response.data?.token || ''))
      if ("data" in response && response.data) {
        const sanitizedUser = {
          ...response.data.user,
          createdAt: response.data.user.createdAt?.toISOString(), // Serialize date
          updatedAt: response.data.user.updatedAt?.toISOString(), // Serialize date
        };

        dispatch(setUser(sanitizedUser));
        queryClient.invalidateQueries({ queryKey: ["session"] });
      }
    },

    onError: (error) => {
      dispatch(setLoading(false));
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";

      dispatch(setError(message));
      toast.error(error.message);
      
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async (Credential: {
      email: string;
      password: string;
      name: string;
    }) => {
      dispatch(setLoading(true));

      const response = await signUp.email({
        email: Credential.email,
        password: Credential.password,
        name: Credential.name,
      });
      console.log(response);
      if (response?.error) {
        dispatch(setError(response.error?.message || "An unknown error occured during signUp Mutation"));
        throw new Error(response.error.message || "Sign-up failed");
      }

      return response;
    },
    onSuccess: (response) => {
      dispatch(setLoading(false));
      if ('token' in response.data) {
        dispatch(setToken(response.data.token || ""));
      }
      if ("data" in response && response.data) {
        const sanitizedUser = {
          ...response.data.user,
          createdAt: response.data.user.createdAt?.toISOString(), // Serialize date
          updatedAt: response.data.user.updatedAt?.toISOString(), // Serialize date
        };

        dispatch(setUser(sanitizedUser));
        queryClient.invalidateQueries({ queryKey: ["session"] });
      }
    },

    onError: (error) => {
      toast.error(error.message);
      dispatch(setLoading(false));
      dispatch(setError(error.message));
    },
    
  });

  const googleSignUpMutation = useMutation({
    mutationFn: async () => {
      dispatch(setLoading(true));

      const response = await signIn.social({
        provider: "google",
        callbackURL: `${FE_URL}/dashboard`,
      });

      if (response?.error) {
        const errorMessage = response.error.message || "Google sign-up failed";
        dispatch(setError(errorMessage));
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      console.log(response);
      return response;
    },
    onSuccess: (response) => {
      dispatch(setLoading(false));

      if ("data" in response && response.data) {
        if ("token" in response.data) {
          dispatch(setToken(response.data.token || ""));
        }

        if ("user" in response.data) {
          const user = response.data.user;
          dispatch(
            setUser({
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image || null,
              emailVerified: user.emailVerified,
              createdAt: new Date(user.createdAt),
              updatedAt: new Date(user.updatedAt),
            })
          );
        }

        queryClient.invalidateQueries({ queryKey: ["session"] });
      }
    },
    onError: (error) => {
      const errorMessage = error.message || "An unknown error occurred";
      dispatch(setLoading(false));
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
    },
  });





  return { signInMutation, signUpMutation, googleSignUpMutation };
};
