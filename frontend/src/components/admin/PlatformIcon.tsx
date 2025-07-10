import { Platform } from "@/types/message";
import { Mail, MessageCircle, Linkedin, Smartphone, Camera, BriefcaseBusiness, Twitter, Newspaper } from "lucide-react";

interface PlatformIconProps {
  platform: Platform;
  size?: number;
  className?: string;
}

const platformConfig = {
  email: {
    icon: Mail,
    label: "Email",
    color: "text-blue-600"
  },
  sms: {
    icon: MessageCircle,
    label: "SMS",
    color: "text-green-600"
  },
  linkedin: {
    icon: Linkedin,
    label: "LinkedIn",
    color: "text-blue-700"
  },
  instagram: {
    icon: Camera,
    label: "Instagram",
    color: "text-purple-700"
  },
  corporate: {
    icon: BriefcaseBusiness,
    label: "Teams / Slack / ...",
    color: "text-black-700"
  },
  twitter: {
    icon: Twitter,
    label: "Twitter / X",
    color: "text-blue-700"
  },
  blog: {
    icon: Newspaper,
    label: "Blog",
    color: "text-black-700"
  }
};

export function PlatformIcon({ platform, size = 16, className }: PlatformIconProps) {
  const config = platformConfig[platform];
  const Icon = config.icon;
  
  return (
    <div title={config.label}>
      <Icon 
        size={size} 
        className={`${config.color} ${className}`}
      />
    </div>
  );
}