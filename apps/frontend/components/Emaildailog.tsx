"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { ButtonLoading } from "./ui/ButtonLoading";
import { useAuthMutation } from "@/lib/hooks/useAuthMutation";
import { useRouter } from "next/navigation";

export function SignupWithEmailDialog() {
  //loader
  const isloading = useSelector((state: RootState) => state.auth.loading);
  const router = useRouter();
  const { signUpMutation } = useAuthMutation();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      toast.error("password did not match");
      return;
    } else {
      signUpMutation.mutate(
        { email, password, name },
        {
          onSuccess: () => {
            router.push("/verify");
          }
        }
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="my-4 h-12 p-6 w-full text-lg font-medium"
          variant="outline"
        >
          Sign up with Email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl">Sign Up</DialogTitle>
          <DialogDescription className="text-base">
            Enter your details to create an account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              required
              className="h-12 text-lg"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              className="h-12 text-lg"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              className="h-12 text-lg"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              required
              className="h-12 text-lg"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </div>

          {!isloading && (
            <Button className="w-full h-12 text-lg" onClick={handleSignUp}>
              Create account
            </Button>
          )}
          {isloading && (
            <div className="w-full h-12 text-lg">
              <ButtonLoading />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
