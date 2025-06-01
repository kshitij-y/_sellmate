import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";

interface Props {
  image: string[];
}

export default function ImageSlider({ image }: Props) {
  return (
    <div className="relative mx-auto px-[45px] w-[400px] md:w-[500px]">
      <Carousel className="w-full mx-auto">
        <CarouselContent>
          {image.map((img, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/5] lg:aspect-[5/6] xl:aspect-[3/4]">
                <Image
                  src={img}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-contain rounded-lg bg-white"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-[10px]" />
        <CarouselNext className="mr-[10px]" />
      </Carousel>
    </div>
  );
}
