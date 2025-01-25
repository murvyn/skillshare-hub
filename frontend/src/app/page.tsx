"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Star, Users } from "lucide-react";

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
            <div className="max-w-2xl mx-auto relative">
              <Input
                type="text"
                placeholder="Search for courses or skills"
                className="w-full pl-10 pr-4 py-3 rounded-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Featured Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((course) => (
                <Card key={course}>
                  <CardHeader>
                    <Image
                      src={`/placeholder.svg?height=200&width=400`}
                      alt="Course thumbnail"
                      width={400}
                      height={200}
                      className="rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent>
                    <CardTitle>Introduction to Digital Marketing</CardTitle>
                    <CardDescription>
                      Learn the fundamentals of digital marketing and boost your
                      online presence.
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center">
                      <Star className="text-yellow-400 mr-1" />
                      <span>4.8</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="text-gray-400 mr-1" />
                      <span>1.2k students</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/courses" className="text-[#1E90FF] hover:underline">
                View all courses
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-16">
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

        <section className="bg-gray-100 py-16 px-4 -mb-10 rounded-lg">
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
    </div>
  );
}
