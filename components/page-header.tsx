import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Montserrat } from "next/font/google";
import React from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

const montserrat = Montserrat({ subsets: ["latin"], weight: "400" });
const montserratHeading = Montserrat({ subsets: ["latin"], weight: "700" });

export default function PageHeader({
  title,
  description,
  icon: Icon,
  iconColor,
  iconBgColor,
}: PageHeaderProps) {
  return (
    <div className="flex w-full py-2 ">
      <Icon
        className={cn(
          "w-10 h-10 md:w-12 md:h-12 p-1 md:p-2 rounded-lg",
          iconColor,
          iconBgColor
        )}
      />
      <div className="px-2">
        <h1 className={cn("text-xl", montserratHeading.className)}>{title}</h1>
        <p
          className={cn("text-sm text-muted-foreground", montserrat.className)}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
