"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

import { Orbitron, Teko } from "next/font/google";
import {
  Bot,
  Code,
  Image,
  LayoutDashboard,
  MessageSquare,
  Music,
  Settings,
  Video,
} from "lucide-react";
import { usePathname } from "next/navigation";

const spaceGrotesk = Orbitron({ subsets: ["latin"], weight: "700" });
const teko = Teko({ subsets: ["latin"], weight: "300" });

const routes = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "text-blue-400",
  },
  {
    label: "Conversation",
    href: "/conversation",
    icon: MessageSquare,
    color: "text-green-200",
  },
  {
    label: "Image",
    href: "/image",
    icon: Image,
    color: "text-red-300",
  },
  {
    label: "Video",
    href: "/video",
    icon: Video,
    color: "text-yellow-300",
  },
  {
    label: "Music",
    href: "/music",
    icon: Music,
    color: "text-purple-300",
  },
  {
    label: "Code",
    href: "/code",
    icon: Code,
    color: "text-gray-400",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    color: "text-white",
  },
];

export default function SideBar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full">
      <div className="px-4 flex">
        <Link href="/dashboard" className="flex">
          <div className="mr-4 text-blue-300">
            <Bot size="28" />
          </div>
          <p
            className={cn(
              "text-2xl font-bold text-white",
              spaceGrotesk.className
            )}
          >
            Gen AI
          </p>
        </Link>
      </div>
      <div className="py-8 space-y-4 flex flex-col">
        {routes.map((route) => (
          <Link
            href={route.href}
            key={route.href}
            className={cn(
              "mx-2 px-4 py-1 hover:shadow-md text-white hover:bg-slate-700 flex items-center rounded-md",
              pathname === route.href && "bg-slate-700"
            )}
          >
            <route.icon className={cn("mx-2", route.color)} />
            <p className={cn("text-2xl", teko.className)}>{route.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
