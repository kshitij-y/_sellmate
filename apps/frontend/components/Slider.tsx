import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Product from "@/lib/types/product";
import Link from "next/link";

interface Props {
  items: Product[];
}

export default function Slider({ items }: Props) {
  return (
    <div className="relative w-[90%] mx-auto">
      <Carousel className="w-full">
        <CarouselContent className="-ml-4">
          {items.map((item) => (
            <CarouselItem
              key={item.id}
              className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
              <Link href={`/product/${item.id}`}>
                <Card className="w-full h-full flex flex-col justify-between hover:shadow-lg transition-shadow">
                  <CardContent className="p-2">
                    <img
                      src={item.images?.[0]}
                      alt={item.title}
                      className="w-full h-40 object-cover rounded-lg mb-2"
                    />
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-gray-600">${item.price}</p>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
