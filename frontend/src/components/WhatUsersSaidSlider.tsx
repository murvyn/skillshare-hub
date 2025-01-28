import React from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import Marquee from "react-fast-marquee";

const testimonials = [
  {
    id: 1,
    quote:
      "SkillShare Hub has been a game-changer for my career. The courses are top-notch and the instructors are amazing!",
    user: {
      name: "Jane Doe",
      title: "Web Developer",
      avatar: "/placeholder.svg",
    },
  },
  {
    id: 2,
    quote:
      "I absolutely love the interactive nature of SkillShare Hub. The courses are so engaging and I feel like I learn something new every week!",
    user: {
      name: "John Doe",
      title: "Software Engineer",
      avatar: "/placeholder.svg",
    },
  },
  {
    id: 3,
    quote:
      "SkillShare Hub has been a game-changer for my career. The courses are top-notch and the instructors are amazing!",
    user: {
      name: "Jane Doe",
      title: "Web Developer",
      avatar: "/placeholder.svg",
    },
  },
  {
    id: 4,
    quote:
      "I absolutely love the interactive nature of SkillShare Hub. The courses are so engaging and I feel like I learn something new every week!",
    user: {
      name: "John Doe",
      title: "Software Engineer",
      avatar: "/placeholder.svg",
    },
  },
  {
    id: 5,
    quote:
      "I absolutely love the interactive nature of SkillShare Hub. The courses are so engaging and I feel like I learn something new every week!",
    user: {
      name: "John Doe",
      title: "Software Engineer",
      avatar: "/placeholder.svg",
    },
  },
];

const WhatUsersSaidSlider = () => {
  return (
    <section className="mt-20">
      <div className=" mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          What Our Users Say
        </h2>
        <Marquee>
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white w-[30rem] mr-5" >
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Image
                    src={`/placeholder.svg?height=40&width=40`}
                    alt="User avatar"
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold">Jane Doe</p>
                    <p className="text-sm text-gray-500">Web Developer</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  {
                    '"SkillShare Hub has been a game-changer for my career. The courses are top-notch and the instructors are amazing!"'
                  }
                </p>
              </CardContent>
            </Card>
          ))}
        </Marquee>
        <Marquee direction="right" className="mt-5">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white w-[30rem] mr-5" >
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Image
                    src={`/placeholder.svg?height=40&width=40`}
                    alt="User avatar"
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold">Jane Doe</p>
                    <p className="text-sm text-gray-500">Web Developer</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  {
                    '"SkillShare Hub has been a game-changer for my career. The courses are top-notch and the instructors are amazing!"'
                  }
                </p>
              </CardContent>
            </Card>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default WhatUsersSaidSlider;
