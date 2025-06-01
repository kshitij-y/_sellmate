import { OtpVerify } from "@/components/OtpVerify";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function Page() {
  return (
    <div className="flex items-center min-h-screen">
      <div className="w-full px-6 mx-auto fixed top-0 left-0 right-0 border-b-1">
        <TopBar auth={ false } />
      </div>
      <div className="flex justify-center w-full">
        <div className="space-y-4 w-[450px]">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              className="h-12 text-lg"
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
            />
          </div>

          <Button className="w-full h-12 text-lg">Change password</Button>
        </div>
      </div>
    </div>
  );
}
