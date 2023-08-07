"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Code,
  Image,
  MessageSquare,
  Music,
  Settings,
  Video,
} from "lucide-react";
import { Montserrat } from "next/font/google";

import { useRouter } from "next/navigation";

const montserrat = Montserrat({ subsets: ["latin"], weight: "400" });
const montserratHeading = Montserrat({ subsets: ["latin"], weight: "700" });

const cards = [
  {
    label: "Conversation",
    href: "/conversation",
    icon: MessageSquare,
    color: "text-green-300",
    bg: "bg-green-300/10",
  },
  {
    label: "Image Generation",
    href: "/image",
    icon: Image,
    color: "text-red-300",
    bg: "bg-red-300/10",
  },
  {
    label: "Video Generation",
    href: "/video",
    icon: Video,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    label: "Music Generation",
    href: "/music",
    icon: Music,
    color: "text-purple-300",
    bg: "bg-purple-300/10",
  },
  {
    label: "Code Generation",
    href: "/code",
    icon: Code,
    color: "text-gray-400",
    bg: "bg-gray-400/10",
  },
];

const DashboardPage = () => {
  const router = useRouter();

  return (
    <div className="px-8 md:px-10">
      <p
        className={cn(
          "text-2xl md:text-3xl text-center",
          montserratHeading.className
        )}
      >
        GEN AI: Your AI Assistant
      </p>
      <p
        className={cn(
          "text-center text-muted-foreground",
          montserrat.className
        )}
      >
        All the AI tools you need at one place
      </p>
      <div className="my-8 px-6 space-y-6">
        {cards.map((card) => (
          <Card
            key={card.href}
            className="shadow-md hover:shadow-lg border-transparent cursor-pointer"
            onClick={() => router.push(card.href)}
          >
            <div className="p-2">
              <div className="flex items-center">
                <card.icon
                  className={cn(
                    "w-6 h-6 md:w-8 md:h-8 rounded-md p-1",
                    card.color,
                    card.bg
                  )}
                />
                <div className="w-full flex justify-between">
                  <h3
                    className={cn(
                      "ml-2 text-md md:text-lg",
                      montserrat.className
                    )}
                  >
                    {card.label}
                  </h3>
                  <ArrowRight />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
