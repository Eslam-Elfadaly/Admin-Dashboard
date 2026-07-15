import React, { useState } from 'react'
// import api from '@/service/api'
import {useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import ChartLineMultiple from '@/components/charts/Sales-chart'
import { Skeleton } from "@/components/ui/skeleton"
import { Eye } from 'lucide-react';
import ViewOrder from './Orders/ViewOrder'
import ChartPieSeparatorNone from '@/components/charts/OrderStatus-chart'
import { toast } from "sonner"
import { supabase } from "@/lib/supabase";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



function Dashboard() {

  const [page, setPage] = useState(1);
  const [viewOrder, setViewOrder] = useState(false)
  const [viewOrderId, setViewOrderId] = useState(null)


  // get dashboardstates
  const {data:dashboard, isLoading:dashboardLoading} = useQuery({
    queryKey:['dashboard'],
    queryFn: getDashboardData,
  })

  async function getDashboardData() {
  const { data, error } = await supabase
    .from("dashboard_stats")
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

  // get recentOrders
  const {data: recentOrders} = useQuery({
    queryKey:['recentOrders'],
    queryFn: getRecentOrders,
  })

  async function getRecentOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*");

  if (error) {
    throw error;
  }

  const recentOrders = [...data]
  .sort((a, b) => {
    const dateDiff = new Date(b.date) - new Date(a.date);

    if (dateDiff !== 0) {
      return dateDiff;
    }

    return a.id.localeCompare(b.id);
  })
  .slice(0, 5);

  return recentOrders || [];
}


  // changeOrderStatus
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn:changeOrderStatus,
    onSuccess: () => {
  queryClient.invalidateQueries({
    queryKey: ["recentOrders"],
  });

  queryClient.invalidateQueries({
    queryKey: ["dashboard"],
  });

  toast.success(`State updated successfully`, {
          style: {
            background: "green",
            color: "white",
          },
        });
}
  })

async function changeOrderStatus({ id, status }) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
  
// select items
const items = dashboard?.orderStatusSplit?.map((o)=> ({label: o.label, value: o.label})) || [];

  // pagination
  const limit = 3;
  const paginationNumber = [];
  for(let i = 1; i <= Math.ceil(dashboard?.topSellingProducts?.length/limit); i++){
    paginationNumber.push(i)
  }

  const start = (page - 1) * limit;
  const end = start + limit ;


  // if loading
  if(dashboardLoading){
    return(
      <>
    <h1 className='text-2xl font-bold mb-5'>Dashboard Overview</h1>

    <ul className='grid lg:grid-cols-4 grid-cols-2 gap-4 items-center justify-between *:bg-card *:p-3 font-bold *:rounded-2xl mb-8'>

        <li className='space-y-2'>
        <Skeleton className="h-4 w-[50px] lg:w-[100px]"/>
        <Skeleton className="h-4 w-[90px] lg:w-[200px]" />
        </li>
        <li className='space-y-2'>
        <Skeleton className="h-4 w-[50px] lg:w-[100px]"/>
        <Skeleton className="h-4 w-[90px] lg:w-[200px]" />
        </li>
        <li className='space-y-2'>
        <Skeleton className="h-4 w-[50px] lg:w-[100px]"/>
        <Skeleton className="h-4 w-[90px] lg:w-[200px]" />
        </li>
        <li className='space-y-2'>
        <Skeleton className="h-4 w-[50px] lg:w-[100px]"/>
        <Skeleton className="h-4 w-[90px] lg:w-[200px]" />
        </li>
    </ul>

    <div className="charts flex max-lg:flex-col gap-5">
    <div className="space-y-2 flex-1 h-80 p-2">
        <Skeleton className="h-4 w-[100px]"/>
        <Skeleton className="h-4 w-[250px] mb-3" />
        <Skeleton className="h-65 w-full" />
      </div>

    <div className="space-y-2 lg:w-1/3 p-2 lg:py-6 h-80">
        <Skeleton className="h-5 mb-3 w-[100px]"/>
        <Skeleton className="h-65 " />
    </div>

    </div>

    <div className='p-2'>
        <Skeleton className="h-5 mt-5 w-full h-100"/>
    </div>
    </>
    )
  }

  // if not
  return (
    <>
    <h1 className='text-2xl font-bold mb-5'>Dashboard Overview</h1>

    <ul className='grid lg:grid-cols-4 grid-cols-2 gap-4 items-center justify-between *:bg-card *:border-1 *:p-3 font-bold *:rounded-2xl mb-5'>
    {dashboard?.cards.map((c)=>{
      return(
        <li key={c?.id}>
          <h2 className='text-primary'>{c?.label}</h2>
          <span className='text-foreground text-2xl'>{c?.format === "number" ? <>{c?.value}</> : <>${c?.value.toLocaleString("en-US", {
             minimumFractionDigits: 0,
             maximumFractionDigits: 0,
              })}</>}</span>
        </li>
      )
    })}
    </ul>

{/* charts */}

    <div className="charts md:flex gap-5 mb-5">
    <ChartLineMultiple/>
    <ChartPieSeparatorNone/>
    </div>


{/* recent orders */}
<div className='bg-card rounded-2xl p-4 mb-5 border-1'>
    <h1 className='mb-5 text-lg font-bold'>Recent Orders</h1>

    <div className='overflow-x-auto'>
    <table className='max-lg:min-w-[800px] md:min-w-full table-fixed border-collapse'>
      <thead className='bg-muted'>
        <tr className='*:p-3 *:text-start text-foreground/60'>
          <th className='rounded-l-2xl'>Id</th>
          <th>Customer</th>
          <th>Time</th>
          <th>Payment</th>
          <th>Total</th>
          <th>Status</th>
          <th className='rounded-r-2xl'>View</th>
        </tr>
      </thead>
      <tbody>
        {
          recentOrders?.map((o)=>{
            return(
              <tr key={o?.id} className='*:p-3 *:text-start border-b *:font-bold'>
                <td>{o?.id}</td>
                <td >{o?.customer}</td>
                <td>{o?.date}</td>
                <td>{o?.payment}</td>
                <td>$ {o?.total}</td>

                <td className='w-8'>
                  <Select value={o?.status} onValueChange={(value)=> {mutation.mutate({id: o?.id, status: value})}}>
                    <SelectTrigger className="w-full bg-muted cursor-pointer max-w-40">
                      <SelectValue className='text-[17px]' style={{color: o.status === 'Delivered' ?
                  "#22c55e" : o?.status === "Shipped"?
                  '#1c9cf0': o?.status === "Processing"?
                  "#8b5cf6": o?.status === "Pending"?
                  "#f59e0b": "#ef4444"}}/>
                     </SelectTrigger>
                     <SelectContent>
                       <SelectGroup>
                         <SelectLabel>Status</SelectLabel>
                         {items.map((item) => (
                           <SelectItem key={item.value}  value={item.value}>
                             {item.label}
                           </SelectItem>
                         ))}
                       </SelectGroup>
                     </SelectContent>
                   </Select>
                 </td>
                <td onClick={()=>{setViewOrder(true); setViewOrderId(o?.id)}} className='cursor-pointer'><Eye className='ml-2'/></td>

              </tr>
            )
          })
        }
      </tbody>
    </table>
    </div>
    </div>

<div className='flex max-lg:flex-col gap-5'>

    {/* best Selling */}
    <div className='bg-card rounded-2xl  p-4 lg:w-2/3 flex flex-col border-1'>
      <h1 className='mb- text-lg font-bold'>Top selling products</h1>
      <p className='text-foreground/60 text-sm mb-5'>Best performers this month</p>

      <div className='overflow-x-auto flex-1'>

        <table className='max-lg:min-w-[800px] md:min-w-full table-fixed border-collapse'>
          <thead className='bg-muted'>
            <tr className='*:p-3 *:text-start text-foreground/60'>
              <th className='rounded-l-2xl'>Product</th>
              <th>Category</th>
              <th>Units sold</th>
              <th className='rounded-r-2xl'>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {dashboard?.topSellingProducts?.slice(start, end)?.map((p)=>{
              return(
                <tr key={p?.id} className='border-b *:p-2 *:pl-3 *:font-bold'>
                  <td className='flex items-center gap-3 '>{<img src={p.image} alt={p?.name} className='size-12 rounded-full'/>}{p?.name}</td>
                  <td>{p?.category}</td>
                  <td>{p?.sold}</td>
                  <td>$ {p?.revenue.toLocaleString("en-US", {
                       minimumFractionDigits: 0,
                       maximumFractionDigits: 0,
              })}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
        <ul className='flex items-center gap-1.5 place-self-end mt-5 px-5'>
        {paginationNumber.map((p)=>(<li key={p} className={` ${page === p? 'bg-primary':'border-primary border-1 hover:bg-primary/20'} flex items-center justify-center size-7 p-1 rounded-full cursor-pointer`} onClick={()=>setPage(p)}>{p}</li>))}
      </ul>
    </div>

    {/* totals */}
    <div className='p-4 rounded-2xl flex-1 bg-card border-1'>
      <h1 className='text-lg font-bold mb-5'>Totals</h1>
      <ul className='   grid lg:grid-cols-3 max-lg:grid-cols-2 gap-5'>
        {Object.entries(dashboard?.totals || {}).map(([key, value])=>{
          return(
            <li key={key} className='bg-primary text-white p-3 rounded-2xl flex flex-col'>
            <span>{key}</span>
            <span className='text-2xl font-bold'>{value}</span>
          </li>
          )
        })}
      </ul>

    </div>

    </div>

      <ViewOrder id={viewOrderId} setViewOrder={setViewOrder} viewOrder={viewOrder}/>

    </>
      
  )
}

export default Dashboard
