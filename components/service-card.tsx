interface ServiceCardProps {
  key: string;
  service: {
    title: string;
    description: string;
    icon: string;
  };
  index: number;
  messages?: any; // Making messages optional
}

export function ServiceCard({ service, index, messages }: ServiceCardProps) {
  // ... existing code ...
} 