"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Search } from "lucide-react";
import WhatUsersSaidSlider from "@/components/WhatUsersSaidSlider";
import ImageCarousel from "@/components/ImageCarousel";
import { Merriweather } from "next/font/google";

import LessonsCarousel from "@/components/LessonsCarousel";

const lessons = [
  {
    id: 1,
    title: "Introduction to JavaScript",
    author: "John Doe",
    rating: 4.5,
    numberOfStudents: 1200,
    price: 29.99,
  },
  {
    id: 2,
    title: "Advanced React Techniques",
    author: "Jane Smith",
    rating: 4.8,
    numberOfStudents: 850,
    price: 49.99,
  },
  {
    id: 3,
    title: "Mastering Node.js",
    author: "Alice Johnson",
    rating: 4.7,
    numberOfStudents: 950,
    price: 39.99,
  },
  {
    id: 4,
    title: "Python for Beginners",
    author: "Bob Brown",
    rating: 4.6,
    numberOfStudents: 2000,
    price: 19.99,
  },
  {
    id: 5,
    title: "Data Structures and Algorithms For Beginners And Others",
    author: "Charlie Davis",
    rating: 4.9,
    numberOfStudents: 1500,
    price: 59.99,
  },
  {
    id: 6,
    title: "Full-Stack Web Development",
    author: "Eva Green",
    rating: 4.7,
    numberOfStudents: 1300,
    price: 79.99,
  },
  {
    id: 7,
    title: "Machine Learning Basics",
    author: "Frank Harris",
    rating: 4.4,
    numberOfStudents: 1100,
    price: 69.99,
  },
  {
    id: 8,
    title: "CSS and Tailwind CSS Mastery",
    author: "Grace Lee",
    rating: 4.8,
    numberOfStudents: 900,
    price: 34.99,
  },
  {
    id: 9,
    title: "DevOps Fundamentals",
    author: "Henry Wilson",
    rating: 4.5,
    numberOfStudents: 750,
    price: 44.99,
  },
  {
    id: 10,
    title: "Mobile App Development with Flutter",
    author: "Ivy Taylor",
    rating: 4.6,
    numberOfStudents: 600,
    price: 54.99,
  },
  {
    id: 11,
    title: "Cybersecurity Essentials",
    author: "Jack White",
    rating: 4.7,
    numberOfStudents: 500,
    price: 64.99,
  },
  {
    id: 12,
    title: "UI/UX Design Principles",
    author: "Karen Clark",
    rating: 4.8,
    numberOfStudents: 800,
    price: 39.99,
  },
];


const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["700"],
});
export default function Home() {
  return (
    <div className="min-h-screen bg-white mb-0 pb-0">
      <main>
        <section className="bg-[#F5F5F5] py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Unlock Your Potential with SkillShare Hub
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Learn from experts or share your skills with the world
            </p>
            <div className="flex justify-center mb-8">
              <Button className="bg-[#FFD700] text-gray-800 hover:bg-yellow-400 mr-4">
                Start Learning
              </Button>
              <Button
                variant="outline"
                className="border-[#1E90FF] text-[#1E90FF] hover:bg-[#1E90FF] hover:text-white"
              >
                Teach a Skill
              </Button>
            </div>
            <div className="max-w-2xl mb-10 mx-auto relative">
              <Input
                type="text"
                placeholder="Search for courses or skills"
                className="w-full pl-10 pr-4 py-3 rounded-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <ImageCarousel />
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className={`text-4xl font-bold mb-7 ${merriweather.className}`}>
              What to learn
            </h2>
            <LessonsCarousel title="Learners are viewing" lessons={lessons} />
            <LessonsCarousel title="Top Javascript Courses" lessons={lessons} />
            <div className="text-center mt-8">
              <Link href="/courses" className="text-[#1E90FF] hover:underline">
                View all courses
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-16 container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Why Choose SkillShare Hub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Expert Instructors</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Learn from industry professionals and subject matter experts.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Flexible Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Study at your own pace with on-demand video lectures and
                  resources.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Diverse Course Catalog</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Explore a wide range of subjects to fuel your passion and
                  career growth.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-gray-100 py-16 px-4 rounded-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-xl mb-8">
              Join thousands of students and start your learning journey today!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-[#1E90FF] hover:bg-blue-600">
                Get Started
              </Button>
            </div>
          </div>
        </section>
      </main>
      <WhatUsersSaidSlider />
    </div>
  );
}
