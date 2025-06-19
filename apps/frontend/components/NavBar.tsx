"use client"
import useAddress from "@/lib/hooks/useAddress";
import { Logo } from "./Logo";
import { AppSidebar } from "./SideBar";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MapPin } from "lucide-react";

export default function NavBar() {
  const { getDefaultAddress } = useAddress();
  const address = getDefaultAddress();
  const location = address?.city;

  return (
    <div className="flex items-center justify-between w-full px-3 py-2 bg-background shadow-sm border-b-1">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <AppSidebar />
        <div className="">
          <Logo />
        </div>

        {/* Location */}
        <div className="hidden sm:flex items-center">
          <Button
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1.5 rounded-md shadow-sm transition hover:bg-secondary-foreground/10"
          >
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm mr-2 font-medium">{location}</span>
          </Button>
        </div>
      </div>

      {/* Search & Controls */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-center">
        {/* Search Input */}
        <div className="flex-1 md:flex-none w-full md:w-[350px]">
          <Input placeholder="Search Items" className="w-full h-9 text-sm" />
        </div>

        {/* Theme Toggle */}
        <ModeToggle />
      </div>
    </div>
  );
}
