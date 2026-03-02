import { StatCard } from "@/components/StateCard"
import { getDashboardData } from "@/services/dashboardData"
import { QueryClient } from "@tanstack/react-query"
import { Users, UserPlus, UserCheck } from "lucide-react"
import CustomerDetail from "@/components/CustomerDetail"
import CustomersList from "@/components/CustomersList"

interface CustomersPageProps {
  searchParams: Promise<{
    cartId?: string
    userId?: string
  }>
}

async function CustomersPage({ searchParams }: CustomersPageProps) {
  const queryClient = new QueryClient()

  const [data, params] = await Promise.all([
    getDashboardData(),
    searchParams,
    queryClient.prefetchQuery({
      queryKey: ["dashboard-data"],
      queryFn: () => getDashboardData(),
    }),
  ])

  const { customerKpis, users } = data

  const selectedUserId = params?.userId
  const selectedUser =
    users.find((c) => c.id.toString() === selectedUserId) || users[0]

  return (
    <div className="max-w-7xl space-y-3 md:space-y-4 mx-auto">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-4">
        <StatCard
          title="totalUsers"
          value={customerKpis.totalUsers.value}
          change={customerKpis.totalUsers.trend.change}
          changeType={customerKpis.totalUsers.trend.changeType}
          icon={Users}
          type="number"
          since="since"
          trend={customerKpis.totalUsers.trend.trend}
          intl="customers.statsCustomers"
        />
        <StatCard
          title="usersActive"
          value={customerKpis.usersActive.value}
          change={customerKpis.usersActive.trend.change}
          changeType={customerKpis.usersActive.trend.changeType}
          icon={UserCheck}
          type="number"
          since="since"
          trend={customerKpis.usersActive.trend.trend}
          intl="customers.statsCustomers"
        />
        <StatCard
          title="newCustomers"
          value={customerKpis.newCustomers.value}
          change={customerKpis.newCustomers.trend.change}
          changeType={customerKpis.newCustomers.trend.changeType}
          icon={UserPlus}
          type="number"
          since="since"
          trend={customerKpis.newCustomers.trend.trend}
          intl="customers.statsCustomers"
        />
      </div>
      <div>
        <CustomersList users={users} />
      </div>
      <div className="flex">
        {selectedUser && (
          <div className="w-full">
            <CustomerDetail user={selectedUser} />
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomersPage
