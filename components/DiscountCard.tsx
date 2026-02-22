import { Tag, Percent, Clock } from "lucide-react"

const discounts = [
  {
    code: "SUMMER25",
    type: "Percentage",
    value: "25% off",
    uses: 342,
    icon: Percent,
  },
  {
    code: "FREESHIP",
    type: "Free Shipping",
    value: "Free",
    uses: 891,
    icon: Tag,
  },
  {
    code: "FLASH10",
    type: "Flash Sale",
    value: "10% off",
    uses: 156,
    icon: Clock,
  },
]

export function DiscountsCard() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-4 lg:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-card-foreground">
          Active Discounts
        </h3>
        <p className="text-xs text-muted-foreground">Currently running</p>
      </div>
      <div className="flex-1 space-y-3 overflow-auto">
        {discounts.map((d) => (
          <div
            key={d.code}
            className="flex items-center gap-3 rounded-lg bg-secondary/50 p-2.5 transition-colors hover:bg-secondary"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <d.icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-card-foreground font-mono">
                  {d.code}
                </p>
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                  {d.value}
                </span>
              </div>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {d.uses} uses &middot; {d.type}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
