"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {  Menu, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  Shirt,
  Book,
  Home,
  Dumbbell,
  Gamepad2,
  Car,
  Briefcase,
} from "lucide-react";
import LogoutButton from "./logout";
import ProfileBox from "./ProfileBox";

const categories = [
  {
    name: "Electronics",
    icon: <Smartphone className="w-5 h-5 mr-2" />,
    subcategories: [
      "Laptops",
      "Smartphones",
      "Tablets",
      "Accessories",
      "Cameras",
      "Wearables",
    ],
  },
  {
    name: "Fashion",
    icon: <Shirt className="w-5 h-5 mr-2" />,
    subcategories: ["Men", "Women", "Kids", "Footwear", "Bags", "Jewelry"],
  },
  {
    name: "Books & Media",
    icon: <Book className="w-5 h-5 mr-2" />,
    subcategories: [
      "Fiction",
      "Non-fiction",
      "Comics",
      "Textbooks",
      "Magazines",
      "Music",
      "Movies",
    ],
  },
  {
    name: "Home & Living",
    icon: <Home className="w-5 h-5 mr-2" />,
    subcategories: [
      "Furniture",
      "Decor",
      "Kitchen",
      "Appliances",
      "Bedding",
      "Storage",
    ],
  },
  {
    name: "Sports & Fitness",
    icon: <Dumbbell className="w-5 h-5 mr-2" />,
    subcategories: [
      "Gym Equipment",
      "Outdoor",
      "Clothing",
      "Footwear",
      "Accessories",
    ],
  },
  {
    name: "Gaming",
    icon: <Gamepad2 className="w-5 h-5 mr-2" />,
    subcategories: ["Consoles", "Games", "Controllers", "PC Gaming", "VR"],
  },
  {
    name: "Vehicles",
    icon: <Car className="w-5 h-5 mr-2" />,
    subcategories: [
      "Cars",
      "Bikes",
      "Scooters",
      "Auto Parts",
      "Electric Vehicles",
    ],
  },
  {
    name: "Jobs & Services",
    icon: <Briefcase className="w-5 h-5 mr-2" />,
    subcategories: ["Full-time", "Part-time", "Freelance", "Services", "Gigs"],
  },
];

const user = {
  name: "Kshtij Kumar",
  avatar: "https://api.dicebear.com/8.x/adventurer/svg?seed=Kshtij",
};

export function AppSidebar() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleCategory = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex w-12 h-12 items-center justify-center">
          <Menu size={32} />
        </div>
      </SheetTrigger>

      <SheetContent side="left" className="w-80 text-sidebar-foreground">
        {/* Sidebar Header */}
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Categories</SheetTitle>
          <SheetDescription className="text-sm">
            Browse through the categories.
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable Categories */}
        <div className="mt-5 h-[calc(100vh-260px)] overflow-y-auto">
          {categories.map((cat, index) => (
            <div key={index}>
              {/* Category Item */}
              <div
                onClick={() => toggleCategory(index)}
                className="flex items-center justify-between gap-3 p-4 text-lg font-medium transition hover:bg-sidebar-accent hover:text-sidebar-primary cursor-pointer rounded-md"
              >
                <div className="flex items-center">
                  {cat.icon}
                  {cat.name}
                </div>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>

              {/* Subcategories */}
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pl-8"
                  >
                    {cat.subcategories.map((sub, subIndex) => (
                      <Link
                        key={subIndex}
                        href={`/category/${cat.name.toLowerCase()}/${sub.toLowerCase()}`}
                        className="block p-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition rounded-md"
                      >
                        {sub}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Profile Section */}
        <div className="p-4 border-t bg-sidebar-background flex items-center">
          <div className="flex flex-col items-center">
            <ProfileBox showEmail={ false } />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-sidebar-background">
          <LogoutButton />
        </div>
      </SheetContent>
    </Sheet>
  );
}
