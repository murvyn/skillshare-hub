import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import thumbnail from "@/assets/node.webp";
import Rating from "@/components/Rating";

const LessonsCarousel = ({
  title,
  lessons,
}: {
  title: string;
  lessons: {
    id: number;
    numberOfStudents: number;
    title: string;
    author: string;
    rating: number;
    price: number;
  }[];
}) => {
  return (
    <div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <Carousel className="w-full">
        <CarouselContent className="-ml-1">
          {lessons.map((lesson) => (
            <CarouselItem
              key={lesson.id}
              className="pl-1 md:basis-1/2 lg:basis-1/5"
            >
              <Card className="w-[20rem] border-none shadow-none ">
                <CardHeader>
                  <Image
                    src={thumbnail}
                    alt="Course thumbnail"
                    width={400}
                    height={100}
                    className="rounded-t-lg"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl line-clamp-2">{lesson.title}</CardTitle>
                  <CardDescription>{lesson.author}</CardDescription>
                  <div className="flex items-center space-x-1">
                    <p className="text-sm font-semibold text-yellow-800">
                      {lesson.rating}
                    </p>
                    <Rating value={lesson.rating} />
                    <p className="text-sm text-gray-400">
                      ({lesson.numberOfStudents})
                    </p>
                  </div>
                  <p className="font-bold">${lesson.price}</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default LessonsCarousel;
