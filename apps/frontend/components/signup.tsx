"use client"
import { Button } from "@/components/ui/button";
import LineText from "@/components/lineText";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useAuthMutation } from "@/lib/hooks/useAuthMutation";
import { SignupWithEmailDialog } from "./Emaildailog";
import { ButtonLoading } from "./ui/ButtonLoading";

export const Signup = () => {
  const isloading = useSelector((state: RootState) => state.auth.loading);
  const { googleSignUpMutation } = useAuthMutation();
  
  const handleGoogleSign = () => {
    googleSignUpMutation.mutate();
  };
  return (
    <div className="flex flex-col w-[450px]">
      <div className="font-bold text-2xl my-2 p-2">Sign up to SellMate</div>
      {!isloading && (
        <Button className="my-4 h-12 p-6" onClick={handleGoogleSign}>
          Sign up with Google
        </Button>
      )}
      {isloading && (
        <div className="w-full h-12 text-lg my-6">
          <ButtonLoading />
        </div>
      )}

      <LineText text="or" />

      <SignupWithEmailDialog />

      <div className="text-center text-sm text-gray-500 space-y-2 mt-4">
        <p>
          By creating an account you agree with our{" "}
          <a href="/terms" className="underline hover:text-gray-700">
            Terms of Service
          </a>
          ,{" "}
          <a href="/privacy" className="underline hover:text-gray-700">
            Privacy Policy
          </a>
          , and our default{" "}
          <a href="/notifications" className="underline hover:text-gray-700">
            Notification Settings
          </a>
          .
        </p>
        <p>
          Already have an account?{" "}
          <a
            href="/auth/signin"
            className="font-medium text-black hover:underline dark:text-white"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};
