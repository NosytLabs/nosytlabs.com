declare module "lucide-react" {
  import { ComponentType, SVGProps } from "react";

  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }

  export const Search: ComponentType<LucideProps>;
  export const X: ComponentType<LucideProps>;
  export const Calendar: ComponentType<LucideProps>;
  export const Clock: ComponentType<LucideProps>;
  export const Tag: ComponentType<LucideProps>;
  export const Filter: ComponentType<LucideProps>;
  export const ChevronDown: ComponentType<LucideProps>;
  export const ChevronUp: ComponentType<LucideProps>;
  export const ExternalLink: ComponentType<LucideProps>;
  export const Github: ComponentType<LucideProps>;
  export const Linkedin: ComponentType<LucideProps>;
  export const Twitter: ComponentType<LucideProps>;
  export const Mail: ComponentType<LucideProps>;
  export const Phone: ComponentType<LucideProps>;
  export const MapPin: ComponentType<LucideProps>;
  export const Send: ComponentType<LucideProps>;
  export const CheckCircle: ComponentType<LucideProps>;
  export const AlertCircle: ComponentType<LucideProps>;
  export const Info: ComponentType<LucideProps>;
  export const AlertTriangle: ComponentType<LucideProps>;

  // Add more icons as needed
  const lucideReact: {
    [key: string]: ComponentType<LucideProps>;
  };

  export default lucideReact;
}
