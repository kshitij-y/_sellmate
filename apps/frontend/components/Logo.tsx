"use client";

import { useRouter } from "next/navigation";

export const Logo = () => {
  const router = useRouter();
  return (
    <div className="text-3xl px-3 font-bold w-fit">
      <p
        className="cursor-pointer"
        onClick={() => {
          router.push("/");
        }}
      >
        SellMate
      </p>
    </div>
  );
};
