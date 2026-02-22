const orders = [
  {
    id: "#ORD-7821",
    customer: "Sarah Johnson",
    product: "Premium Headphones",
    amount: "$299.00",
    status: "Delivered",
  },
  {
    id: "#ORD-7820",
    customer: "Mike Chen",
    product: "Wireless Keyboard",
    amount: "$149.00",
    status: "Shipped",
  },
  {
    id: "#ORD-7819",
    customer: "Emily Davis",
    product: "USB-C Hub Pro",
    amount: "$89.00",
    status: "Processing",
  },
  {
    id: "#ORD-7818",
    customer: "James Wilson",
    product: "Ergonomic Mouse",
    amount: "$59.00",
    status: "Delivered",
  },
  {
    id: "#ORD-7817",
    customer: "Anna Lee",
    product: "Monitor Stand",
    amount: "$45.00",
    status: "Cancelled",
  },
]

const statusStyles: Record<string, string> = {
  Delivered: "bg-accent/10 text-accent",
  Shipped: "bg-primary/10 text-primary",
  Processing: "bg-chart-3/20 text-chart-3",
  Cancelled: "bg-destructive/10 text-destructive",
}

export function OrdersTable() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-4 lg:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-card-foreground">
          Recent Orders
        </h3>
        <p className="text-xs text-muted-foreground">Latest transactions</p>
      </div>
      <div className="flex-1 overflow-auto -mx-4 lg:-mx-5">
        <table className="w-full min-w-[400px]">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 lg:px-5 pb-2 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Order
              </th>
              <th className="hidden sm:table-cell pb-2 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Customer
              </th>
              <th className="pb-2 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Product
              </th>
              <th className="pb-2 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Amount
              </th>
              <th className="px-4 lg:px-5 pb-2 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border/50 transition-colors last:border-0 hover:bg-secondary/30"
              >
                <td className="px-4 lg:px-5 py-2.5 text-xs font-mono font-medium text-card-foreground">
                  {order.id}
                </td>
                <td className="hidden sm:table-cell py-2.5 text-xs text-muted-foreground">
                  {order.customer}
                </td>
                <td className="py-2.5 text-xs text-muted-foreground">
                  {order.product}
                </td>
                <td className="py-2.5 text-right text-xs font-medium text-card-foreground">
                  {order.amount}
                </td>
                <td className="px-4 lg:px-5 py-2.5 text-right">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
