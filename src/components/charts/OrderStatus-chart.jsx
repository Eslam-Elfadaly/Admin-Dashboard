"use client"

import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


import api from '@/service/api'
import { useQuery } from '@tanstack/react-query'

export const description = "A pie chart for Orders Statue"


const chartConfig = {
  success: {
    label: "succes",
  },
  info: {
    label: "info",
    color: "var(--chart-1)",
  },
  brand: {
    label: "brand",
    color: "var(--chart-2)",
  },
  warning: {
    label: "warning",
    color: "var(--chart-3)",
  },
  danger: {
    label: "danger",
    color: "var(--chart-4)",
  },
}

export default function ChartPieSeparatorNone() {

    const {data} = useQuery({
    queryKey:['dashboard'],
    queryFn: getDashboardData,
  })

  async function getDashboardData(){
    const data =await api.get('dashboardStats')
    console.log(data?.data)
    return data?.data
  }

const chartData = data?.orderStatusSplit.map((p)=>({
    ...p, fill: p.label === 'Delivered' ?
     "#22c55e" : p.label === "Shipped"?
    '#1c9cf0': p.label === "Processing"?
    "#8b5cf6": p.label === "Pending"?
     "#f59e0b": "#ef4444"
})) || []


  return (
    <Card className="flex flex-col lg:max-h-80 max-md:w-full lg:w-1/3">
      <CardHeader className="items-center pb-0">
        <CardTitle className='font-bold text-lg'>Order status</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">

    <div className="flex items-center justify-center h-full  overflow-x-auto">

        <ChartContainer
          config={chartConfig}
          className=" max-lg:size-45 md:size-60"
          >
          
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              stroke="0"
            />
          </PieChart>
        </ChartContainer>

          <ul className="flex flex-col gap-3 font-bold">
          {chartData.map((p)=>{
              return(
               <li key={p.label} className="flex items-center gap-1 lg:gap-2">
                <span className="rounded-full inline-block size-3" style={{backgroundColor: p.fill }}/>
                <span>{p.label}</span>
                <span>{p.value}%</span>
               </li>   
            )
        })}
        </ul>
    </div>
      </CardContent>
    </Card>
  )
}
