"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
const { formatDistanceToNow } = require("date-fns");
import ProfileEditor from "./ProfileEditor";
import AddressEditor from "./AddressEditor";
import Loader from "./ui/Loader";
import { Button } from "./ui/button";
import ChangePassword from "./ChangePassword";
import { useProfile } from "@/lib/hooks/useProfile";

export default function ProfilePage() {
  const { address } = useSelector((state: RootState) => state.address);
  const { user, loading } = useProfile();

  const name = user?.name || "User";
  const email = user?.email || "No Email";
  const image = user?.image || "";
  const joined = user?.createdAt
    ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })
    : "Unknown";
  const updated = user?.updatedAt
    ? formatDistanceToNow(new Date(user.updatedAt), { addSuffix: true })
    : "Unknown";

  const phone = address?.phone || "No Phone";
  const fullAddress = address
    ? `${address.address}, ${address.city}, ${address.state}, ${address.country}, ${address.postal_code}`
    : "No Address Provided";

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen p-8 w-full">
      <main className="flex-1">
        <Card className="w-full shadow-lg rounded-lg">
          <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <CardTitle className="text-2xl font-bold">Profile</CardTitle>
              <p className="text-sm text-gray-500">
                Manage your profile information
              </p>
            </div>
            <div className="flex flex-wrap justify-start md:justify-end gap-4 w-full md:w-auto">
              <div className="min-w-[100px]">
                <ProfileEditor />
              </div>
              <div className="min-w-[100px]">
                <AddressEditor />
              </div>
            </div>
          </CardHeader>

          <Separator />
          <CardContent className="p-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={image} alt={name} />
                  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-semibold">{name}</h2>
                  <p className="text-gray-500">{email}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-500">
                  Phone: <span className="font-medium">{phone}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Address: <span className="font-medium">{fullAddress}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Joined: <span className="font-medium">{joined}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Last Updated: <span className="font-medium">{updated}</span>
                </p>
              </div>

              <div className="flex justify-end gap-4 mt-4">
                <ChangePassword />
                <Button variant={"outline"} className="px-6">
                  Forget Password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
