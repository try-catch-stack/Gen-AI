"use client";

import React from "react";

import PageHeader from "@/components/page-header";
import { MessageSquare } from "lucide-react";

export default function Conversation() {
  return (
    <div className="p-4">
      <PageHeader
        title="Conversation"
        description="Talk to your AI assistant"
        icon={MessageSquare}
        iconBgColor="bg-green-300/10"
        iconColor="text-green-300"
      />
      Conversation component
    </div>
  );
}
