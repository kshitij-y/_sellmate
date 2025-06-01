"use client";

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Laptop,
  Shirt,
  Book,
  Home,
  Dumbbell,
  Smartphone,
  Tv,
  Car,
  Gamepad2,
  Briefcase,
} from "lucide-react";

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

const CatMenu = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {categories.map((category) => (
          <NavigationMenuItem key={category.name} >
            <NavigationMenuTrigger className="flex items-center">
              {category.icon}
              {category.name}
            </NavigationMenuTrigger>
            <NavigationMenuContent className="w-[100%]">
              <ul className="flex flex-col p-2 w-[300px]">
                {category.subcategories.map((sub) => (
                  <li key={sub}>
                    <Link
                      href={`/category/${sub.toLowerCase()}`}
                      className="block p-2 hover:bg-accent border-b-1 mb-2"
                    >
                      {sub}
                    </Link>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default CatMenu;
