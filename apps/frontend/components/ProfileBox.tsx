"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useUserProfile } from "@/lib/hooks/useProfile";

interface ProfileBoxProps {
    showEmail?: boolean;
}

export default function ProfileBox({ showEmail = true }: ProfileBoxProps) {
    const { user, loading } = useUserProfile();
    const name = user?.name;
    const email = user?.email;

    const avatarUrl =
        user?.image ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name || "Unknown"
        )}&background=random`;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-20">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <Image
                src={avatarUrl}
                alt="Profile"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border"
            />
            <div>
                <h2 className="text-lg font-semibold">{name}</h2>
                {showEmail && (
                    <p className="text-sm text-gray-500 w-auto">{email}</p>
                )}
                {!showEmail && (
                    <Link href="/profile" passHref>
                        <p className="text-sm text-blue-500 hover:underline cursor-pointer">
                            View Profile
                        </p>
                    </Link>
                )}
            </div>
        </div>
    );
}
