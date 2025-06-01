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
import { useRouter } from "next/navigation";
export const OtpVerify = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col space-y-4 w-[450px]">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          required
          className="h-12 text-lg"
        />
      </div>

      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full h-12 text-lg mt-4">Send OTP</Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Enter OTP</DialogTitle>
            </DialogHeader>
            <p className="text-center text-gray-600">
              Check your email for the OTP.
            </p>

            {/* OTP Input Field */}
            <input
              type="text"
              className="w-full border p-2 mt-4 rounded-md"
              placeholder="Enter OTP"
            />

            <Button className="w-full mt-4 h-12" onClick={() => {router.push("/auth/reset-password")}}>Verify OTP</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
