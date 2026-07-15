"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import {useQuery} from '@tanstack/react-query'
import api from "@/service/api"


export const description = "Sales And Orders Chart"


function ChartLineMultiple() {

    const {data, isLoading, isError} = useQuery({
    queryKey:['dashboard'],
    queryFn: getDashboardData,
  })

  async function getDashboardData(){
    const data =await api.get('dashboardStats')
    console.log(data?.data)
    return data?.data
  }

const chartData = data?.salesSeries || [];

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--chart-1)",
  },
  orders: {
    label: "Orders",
    color: "var(--chart-2)",
  },
} 
  return (
    <Card className='flex-1 max-md:w-full max-md:mb-5 md:size-80'>
      <CardHeader>
        <CardTitle className='font-bold text-lg'>Daily Sales</CardTitle>
        <CardDescription>+12% This Week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='md:h-[180px] w-full'>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="sales"
              type="monotone"
              stroke="var(--color-sales)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="orders"
              type="monotone"
              stroke="var(--color-orders)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
export default ChartLineMultiple