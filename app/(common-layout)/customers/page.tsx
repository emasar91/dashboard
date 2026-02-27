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
      queryFn: getDashboardData,
    }),
  ])

  const selectedUserId = params?.userId
  const selectedUser =
    data.users.find((c) => c.id.toString() === selectedUserId) || data.users[0]

  return (
    <div className="max-w-7xl space-y-3 md:space-y-4 mx-auto">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-4">
        <StatCard
          title="totalUsers"
          value={data.totalUsers}
          change="+7.8%"
          changeType="positive"
          icon={Users}
          type="number"
          since="since"
          trend="up"
          intl="customers.statsCustomers"
        />
        <StatCard
          title="usersActive"
          value={data.usersWithOrders}
          change="+22.1%"
          changeType="positive"
          icon={UserCheck}
          type="number"
          since="since"
          trend="up"
          intl="customers.statsCustomers"
        />
        <StatCard
          title="newCustomers"
          value={data.totalUsers / 4}
          change="+3.1%"
          changeType="negative"
          icon={UserPlus}
          type="number"
          since="since"
          trend="down"
          intl="customers.statsCustomers"
        />
      </div>
      <div>
        <CustomersList users={data.users} />
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
