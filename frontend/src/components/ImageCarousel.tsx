import React, { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import poster1 from "@/assets/1.jpg";
import poster2 from "@/assets/2.jpg";
import poster3 from "@/assets/3.jpg";
import poster4 from "@/assets/4.jpg";
import poster5 from "@/assets/5.jpg";
import Image from "next/image";

const posters = [
  { id: 1, image: poster1 },
  { id: 2, image: poster2 },
  { id: 3, image: poster3 },
  { id: 4, image: poster4 },
  { id: 5, image: poster5 },
];

const ImageCarousel = () => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  return (
    <div className="container mx-auto">
      <Carousel
        plugins={[plugin.current]}
        className=" "
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="">
          {posters.map((poster) => (
            <CarouselItem className="" key={poster.id}>
              <div className="p-1 w-full h-[10rem] md:h-[25rem] 2xl:h-[40rem] ">
                <Image className="object-cover" src={poster.image} alt="posters" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
