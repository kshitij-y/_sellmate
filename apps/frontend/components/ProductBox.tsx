
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Gavel, Clock, Check } from "lucide-react";

interface ProductBoxProps {
  product: {
    id: string;
    title: string;
    description: string;
    category: string[];
    condition: string;
    images: string[];
    price: string;
    negotiable: boolean;
    quantity: number;
    is_auction: boolean;
    starting_bid?: string;
    bid_increment?: string;
    auction_end_time?: string;
    seller_name: string;
    status: string;
  };
}

export default function ProductBox({ product }: ProductBoxProps) {

  const {
    id,
    title,
    description,
    category,
    condition,
    images,
    price,
    negotiable,
    quantity,
    is_auction,
    starting_bid,
    bid_increment,
    auction_end_time,
    seller_name,
    status,
  } = product;

  const imageUrl = images?.[0] || "/placeholder.png";

  // Auction time left
  const getTimeLeft = () => {
    if (!auction_end_time) return "";
    const endTime = new Date(auction_end_time).getTime();
    const now = new Date().getTime();
    const diff = endTime - now;

    if (diff <= 0) return "Auction ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m left`;
  };

  

  return (
    <Card className="overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all">
      <Link href={`/product/${id}`} passHref>
        <div className="relative w-full h-48 cursor-pointer">
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl"
          />
          {status !== "available" && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white">
              {status.toUpperCase()}
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="px-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold line-clamp-1">{title}</h2>
          {is_auction ? (
            <Badge variant="outline" className="flex items-center gap-1">
              <Gavel size={16} />
              Auction
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center gap-1">
              <Check size={16} />
              Fixed Price
            </Badge>
          )}
        </div>

        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>

        <div className="mt-2 flex justify-between items-center">
          {is_auction ? (
            <div className="flex items-center gap-1 text-blue-600">
              <Clock size={16} />
              <span className="text-sm">{getTimeLeft()}</span>
            </div>
          ) : (
            <p className="text-lg font-bold">
              ₹{price}{" "}
              {negotiable && (
                <span className="text-sm text-green-500">(Negotiable)</span>
              )}
            </p>
          )}
        </div>

        <div className="flex gap-2 mt-2">
          {category.map((cat, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {cat}
            </Badge>
          ))}
        </div>

        <div className="text-xs text-gray-400 mt-2">
          Seller: {seller_name} | Condition: {condition}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between px-4">
        <Button asChild>
          <Link href={`/product/${id}`}>View Details</Link>
        </Button>
        <Button variant="outline" className="flex items-center gap-1">
          <ShoppingCart size={16} />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
