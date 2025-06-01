"use client";
import CartSection from "@/components/CartSection";
import LogoutButton from "@/components/logout";
import NavBar from "@/components/NavBar";
import OrderHistorySection from "@/components/OrderHistorySection";
import OrderSection from "@/components/OrderSection";
import ProfileSection from "@/components/Profile";
import ProfileBox from "@/components/ProfileBox";
import { Button } from "@/components/ui/button";
import WishlistSection from "@/components/WishlistSection";
import { User, Heart, ShoppingCart, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Page() {
    const searchParams = useSearchParams();
    const section = searchParams.get("section") || "profile";

    const renderSection = () => {
        switch (section) {
            case "profile":
                return <ProfileSection />;
            case "cart":
                return <CartSection />;
            case "wishlist":
                return <WishlistSection />;
            case "orders":
                return <OrderSection />;
            case "history":
                return <OrderHistorySection />;
            default:
                return <ProfileSection />;
        }
    };

    return (
        <div className="flex flex-col overflow-y-auto">
            <NavBar />
            <div className="flex overflow-y-auto">
                <div className="hidden md:flex flex-col sticky top-0 pt-12 pb-24 px-2 min-w-[260px] w-[20%] h-screen ">
                    <div className="h-18">
                        <ProfileBox />
                    </div>

                    {/* Navigation Menu */}
                    <div className="space-y-4">
                        <a href="/profile?section=profile">
                            <Button
                                variant="ghost"
                                className="w-full justify-start">
                                <User size={18} className="mr-2" /> My Profile
                            </Button>
                        </a>

                        <a href="/profile?section=cart">
                            <Button
                                variant="ghost"
                                className="w-full justify-start">
                                <ShoppingCart size={18} className="mr-2" /> Cart
                            </Button>
                        </a>

                        <a href="/profile?section=wishlist">
                            <Button
                                variant="ghost"
                                className="w-full justify-start">
                                <Heart size={18} className="mr-2" /> Wishlist
                            </Button>
                        </a>

                        <a href="/profile?section=orders">
                            <Button
                                variant="ghost"
                                className="w-full justify-start">
                                <ShoppingCart size={18} className="mr-2" /> My
                                Orders
                            </Button>
                        </a>

                        <a href="/profile?section=history">
                            <Button
                                variant="ghost"
                                className="w-full justify-start">
                                <ShoppingCart size={18} className="mr-2" />{" "}
                                Order History
                            </Button>
                        </a>
                    </div>

                    {/* Quick Links */}
                    <div className="mt-8">
                        <h3 className="text-sm font-semibold mb-2">
                            Quick Links
                        </h3>
                        <div className="space-y-2 flex flex-col p-4">
                            <a
                                href="/privacy"
                                className="text-sm text-blue-500 hover:underline">
                                Privacy Policy
                            </a>
                            <a
                                href="/terms"
                                className="text-sm text-blue-500 hover:underline">
                                Terms of Service
                            </a>
                            <a
                                href="/faq"
                                className="text-sm text-blue-500 hover:underline">
                                FAQ
                            </a>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="mt-auto">
                        <LogoutButton />
                    </div>
                </div>

                {/* divider */}
                <div className="h-screen border-l"></div>

                <div className="flex-1 p-2 items-center justify-center mx-auto ">
                    <div className="md:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <ChevronRight />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>
                                    <a href="/profile?section=profile">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start">
                                            <User size={18} className="mr-2" />{" "}
                                            My Profile
                                        </Button>
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <a href="/profile?section=cart">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start">
                                            <ShoppingCart
                                                size={18}
                                                className="mr-2"
                                            />{" "}
                                            Cart
                                        </Button>
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <a href="/profile?section=wishlist">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start">
                                            <Heart size={18} className="mr-2" />{" "}
                                            Wishlist
                                        </Button>
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <a href="/profile?section=orders">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start">
                                            <ShoppingCart
                                                size={18}
                                                className="mr-2"
                                            />{" "}
                                            My Orders
                                        </Button>
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <a href="/profile?section=history">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start">
                                            <ShoppingCart
                                                size={18}
                                                className="mr-2"
                                            />{" "}
                                            Order History
                                        </Button>
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <div className="mt-8">
                                        <h3 className="text-sm font-semibold mb-2">
                                            Quick Links
                                        </h3>
                                        <div className="space-y-2 flex flex-col p-4">
                                            <a
                                                href="/privacy"
                                                className="text-sm text-blue-500 hover:underline">
                                                Privacy Policy
                                            </a>
                                            <a
                                                href="/terms"
                                                className="text-sm text-blue-500 hover:underline">
                                                Terms of Service
                                            </a>
                                            <a
                                                href="/faq"
                                                className="text-sm text-blue-500 hover:underline">
                                                FAQ
                                            </a>
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <div className="mt-auto w-full">
                                        <LogoutButton />
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-center w-full">
                        {renderSection()}
                    </div>
                </div>
            </div>
        </div>
    );
}
