'use client'

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, Activity, Package } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    title: "Total Users",
    value: "1,234",
    icon: Users,
    change: "+12%",
    changeType: "positive"
  },
  {
    title: "Revenue",
    value: "$45,231",
    icon: DollarSign,
    change: "+8%",
    changeType: "positive"
  },
  {
    title: "Active Sessions",
    value: "573",
    icon: Activity,
    change: "-3%",
    changeType: "negative"
  },
  {
    title: "Products",
    value: "24",
    icon: Package,
    change: "0%",
    changeType: "neutral"
  }
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={cn(
                  "text-xs",
                  stat.changeType === "positive" && "text-green-500",
                  stat.changeType === "negative" && "text-red-500"
                )}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 