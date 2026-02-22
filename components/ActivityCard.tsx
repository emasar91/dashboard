import {
  ShoppingCart,
  UserPlus,
  Star,
  Package,
  CreditCard,
  type LucideIcon,
} from "lucide-react"

interface ActivityItem {
  icon: LucideIcon
  text: string
  time: string
  iconBg: string
  iconColor: string
}

const activities: ActivityItem[] = [
  {
    icon: ShoppingCart,
    text: "New order placed by Sarah J.",
    time: "2 min ago",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: UserPlus,
    text: "New customer registered",
    time: "15 min ago",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    icon: Star,
    text: "5-star review on Headphones",
    time: "32 min ago",
    iconBg: "bg-chart-3/15",
    iconColor: "text-chart-3",
  },
  {
    icon: Package,
    text: "Order #7820 shipped",
    time: "1 hr ago",
    iconBg: "bg-chart-4/10",
    iconColor: "text-chart-4",
  },
  {
    icon: CreditCard,
    text: "Payment of $299.00 received",
    time: "2 hr ago",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: UserPlus,
    text: "New team member added",
    time: "3 hr ago",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    icon: ShoppingCart,
    text: "Bulk order from Enterprise Co.",
    time: "5 hr ago",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
]

export function ActivityCard() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-4 lg:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-card-foreground">
          Recent Activity
        </h3>
        <p className="text-xs text-muted-foreground">Latest updates</p>
      </div>
      <div className="flex-1 overflow-auto space-y-1">
        {activities.map((activity, i) => (
          <div
            key={i}
            className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-secondary/50"
          >
            <div
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${activity.iconBg} ${activity.iconColor}`}
            >
              <activity.icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-card-foreground leading-relaxed">
                {activity.text}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
