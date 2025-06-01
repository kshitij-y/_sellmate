"use client";
import { useSession, signOut } from "@/lib/auth-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setUser,
  setError,
  signOut as clearSession,
  setLoading,
} from "@/lib/store/Slices/authSlice";
import { RootState } from "@/lib/store/store";

export const useLogout = () => {
  const { data: session, isPending } = useSession();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isPending) return;

    if (session) {
      const userData = {
        ...session.user,
        createdAt: session.user.createdAt
          ? new Date(session.user.createdAt).toISOString()
          : null,
        updatedAt: session.user.updatedAt
          ? new Date(session.user.updatedAt).toISOString()
          : null,
      };
      dispatch(setUser(userData));
    } else {
      dispatch(clearSession());
    }
  }, [session, isPending, dispatch]);

  const logout = async () => {

    await signOut();
    dispatch(clearSession());

  };

  return { user, loading, error, logout };
};
