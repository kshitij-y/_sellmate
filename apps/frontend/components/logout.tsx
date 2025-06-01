"use client";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/lib/hooks/useAuth";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();
    const { logout } = useLogout();

    const handleLogout = async () => {
      await logout();
      router.push("/auth/signin");
    };

  return (
    <Button variant="outline" className="w-full p-5" onClick={handleLogout}>
      <LogOut size={18} className="mr-2" /> Logout
    </Button>
  );
}
