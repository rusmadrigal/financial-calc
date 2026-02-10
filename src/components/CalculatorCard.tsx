import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowRight } from 'lucide-react';

interface CalculatorCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badges?: string[];
  onOpen: () => void;
}

export function CalculatorCard({
  title,
  description,
  icon: Icon,
  badges = [],
  onOpen,
}: CalculatorCardProps) {
  return (
    <Card
      className="group flex h-full cursor-pointer flex-col transition-all hover:border-accent/50 hover:shadow-md"
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <CardHeader className="pb-4">
        <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
          <Icon className="size-6 text-primary" />
        </div>
        <CardTitle className="line-clamp-1 text-lg">{title}</CardTitle>
        <CardDescription className="line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        {badges.length > 0 && (
          <div className="mb-4 flex min-h-[28px] flex-wrap gap-2">
            {badges.slice(0, 2).map((badge) => (
              <Badge key={badge} variant="secondary" className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
          <span>Open Calculator</span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </div>
      </CardContent>
    </Card>
  );
}
