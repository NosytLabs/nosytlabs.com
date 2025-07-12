import React from 'react';
import {
  Send, Mail, MessageCircle, User, Users,
  Globe, Zap, Bot, Lightbulb, Smartphone, Settings, ArrowRight, Star,
  Home, Briefcase, BookOpen, Folder,
  Twitter, ExternalLink, CheckCircle, XCircle, Clock,
  Menu, X, Github, Linkedin, MapPin, Upload, ArrowDown, Repeat, Heart,
  Sparkles, Award, TrendingUp, Loader,
  Handshake, RefreshCw, LifeBuoy, // Existing icons
  Code, Server, Cpu, Database, Cloud, Shield, // Icons for Projects page
  Share2, Youtube, Printer, // Icons for Contact page
} from 'lucide-react';
// Force re-compilation

// Custom Kick icon component - representing live streaming
const KickIcon: React.FC<React.SVGProps<SVGSVGElement> & { size?: number }> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="10,8 16,12 10,16" fill="currentColor" />
    <circle cx="18" cy="6" r="2" fill="currentColor" />
  </svg>
);

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number;
  className?: string;
}

const iconMap: { [key: string]: React.ElementType } = {
  send: Send,
  mail: Mail,
  messageCircle: MessageCircle,
  user: User,
  users: Users,
  globe: Globe,
  zap: Zap,
  bot: Bot,
  lightbulb: Lightbulb,
  smartphone: Smartphone,
  settings: Settings,
  arrowRight: ArrowRight,
  star: Star,
  home: Home,
  briefcase: Briefcase,
  bookOpen: BookOpen,
  folder: Folder,
  twitter: Twitter,
  externalLink: ExternalLink,
  checkCircle: CheckCircle,
  xCircle: XCircle,
  clock: Clock,
  menu: Menu,
  x: X,
  github: Github,
  linkedin: Linkedin,
  mapPin: MapPin,
  upload: Upload,
  arrowDown: ArrowDown,
  repeat: Repeat,
  heart: Heart,
  sparkles: Sparkles,
  award: Award,
  trendingUp: TrendingUp,
  loader: Loader,
  handshake: Handshake,
  refreshCw: RefreshCw,
  lifeBuoy: LifeBuoy,
  code: Code,
  server: Server,
  cpu: Cpu,
  database: Database,
  cloud: Cloud,
  shield: Shield,
  share2: Share2,
  youtube: Youtube,
  printer: Printer,
  kick: KickIcon, // Custom Kick icon
  // Add uppercase aliases for backward compatibility
  Globe: Globe,
  Zap: Zap,
  Bot: Bot,
  Lightbulb: Lightbulb,
  Smartphone: Smartphone,
  Settings: Settings,
  Send: Send,
  Mail: Mail,
  MessageCircle: MessageCircle,
  User: User,
  Users: Users,
  ArrowRight: ArrowRight,
  Star: Star,
  Home: Home,
  Briefcase: Briefcase,
  BookOpen: BookOpen,
  Folder: Folder,
  Twitter: Twitter,
  ExternalLink: ExternalLink,
  CheckCircle: CheckCircle,
  XCircle: XCircle,
  Clock: Clock,
  Menu: Menu,
  X: X,
  Github: Github,
  Linkedin: Linkedin,
  MapPin: MapPin,
  Upload: Upload,
  ArrowDown: ArrowDown,
  Repeat: Repeat,
  Heart: Heart,
  Sparkles: Sparkles,
  Award: Award,
  TrendingUp: TrendingUp,
  Loader: Loader,
  Handshake: Handshake,
  RefreshCw: RefreshCw,
  LifeBuoy: LifeBuoy,
  Code: Code,
  Server: Server,
  Cpu: Cpu,
  Database: Database,
  Cloud: Cloud,
  Shield: Shield,
  Share2: Share2,
  Youtube: Youtube,
  Printer: Printer,
};

export const Icon: React.FC<IconProps> = ({ name, size = 24, className, ...props }) => {
  const LucideIcon = iconMap[name];

  if (!LucideIcon) {
    console.warn(`Icon with name "${name}" not found.`);
    return null;
  }

  return <LucideIcon size={size} className={className} {...props} />;
};