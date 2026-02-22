const products = [
  {
    name: "Premium Headphones",
    sales: 1245,
    revenue: "$62,250",
    trend: "+12%",
  },
  { name: "Wireless Keyboard", sales: 986, revenue: "$39,440", trend: "+8%" },
  { name: "USB-C Hub Pro", sales: 879, revenue: "$35,160", trend: "+18%" },
  { name: "Ergonomic Mouse", sales: 742, revenue: "$22,260", trend: "+5%" },
  { name: "Monitor Stand", sales: 631, revenue: "$18,930", trend: "-2%" },
]

export function TopSelling() {
  const maxSales = Math.max(...products.map((p) => p.sales))

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-4 lg:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-card-foreground">
          Top Selling Products
        </h3>
        <p className="text-xs text-muted-foreground">By units sold</p>
      </div>
      <div className="flex-1 space-y-3 overflow-auto">
        {products.map((product, i) => (
          <div key={product.name} className="group flex items-center gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-secondary text-[10px] font-bold text-secondary-foreground">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="truncate text-xs font-medium text-card-foreground">
                  {product.name}
                </p>
                <span
                  className={`ml-2 text-[10px] font-semibold ${
                    product.trend.startsWith("+")
                      ? "text-accent"
                      : "text-destructive"
                  }`}
                >
                  {product.trend}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{
                      width: `${(product.sales / maxSales) * 100}%`,
                    }}
                  />
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {product.sales}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
