// Мост «имя иконки (kebab) → компонент lucide-react» для данных,
// где иконка задаётся строкой (ссылки, роли, требования, боссы).
import {
  Trophy, BarChart3, MessageCircle, ExternalLink, MonitorPlay, Clapperboard,
  Swords, Crosshair, Shield, HeartPulse, Mic, TrendingUp, Target, CalendarCheck,
  Check, Skull, type LucideIcon, type LucideProps,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  trophy: Trophy,
  "bar-chart-3": BarChart3,
  "message-circle": MessageCircle,
  "external-link": ExternalLink,
  "monitor-play": MonitorPlay,
  clapperboard: Clapperboard,
  swords: Swords,
  crosshair: Crosshair,
  shield: Shield,
  "heart-pulse": HeartPulse,
  mic: Mic,
  "trending-up": TrendingUp,
  target: Target,
  "calendar-check": CalendarCheck,
  check: Check,
  skull: Skull,
};

export function Icon({ name, ...props }: LucideProps & { name: string }) {
  const Cmp = MAP[name] ?? ExternalLink;
  return <Cmp {...props} />;
}
