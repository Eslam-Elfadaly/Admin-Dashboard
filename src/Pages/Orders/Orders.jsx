import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import api from '@/service/api'
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
import { toast } from "sonner"

import { Skeleton } from "@/components/ui/skeleton"
import { Eye } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';
import ViewOrder from './ViewOrder'
import { Search } from 'lucide-react';

function Orders() {

  const [page, setPage] = useState(1);
  const [viewOrder, setViewOrder] = useState(false)
  const [viewOrderId, setViewOrderId] = useState(null)
  const [search, setSearch] = useState('');
  const [state, setState] = useState('All Status');
  const [payment, setPayment] = useState('All Payments');
  const payments = ['Paid', 'Unpaid', 'Refunded'];

  // get Orders
  const { data: orders, isPending: ordersLoading } = useQuery({
  queryKey: ["orders"],
  queryFn: async () => {

    const { data, error } = await supabase
   .from("orders")
   .select("*")
   .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  },
});

    
    const filterdOrders =  orders?.filter((o)=>{
      const matchStatus = state === 'All Status' || o?.status === state;
      const matchPayment = payment === 'All Payments' || o?.payment === payment;
      const matchSearch = search.trim() === '' || o?.id.includes(search) || o?.customer.toLowerCase().includes(search.toLowerCase());
      
      return matchSearch && matchStatus && matchPayment;
    })


  // changeOrderStatus
  const queryClient = useQueryClient();

  const {mutate: changeOrderState} = useMutation({
    mutationFn:changeOrderStatus,
    onSuccess: () => {
  queryClient.invalidateQueries({
    queryKey: ["orders"],
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

// get orders status

  const {data:status} = useQuery({
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

// order status
const items = status?.orderStatusSplit?.map((o)=> ({label: o.label, value: o.label})) || [];

// order status for filter
const filterStatus = [{label:'All Status', value:'All Status'},...(status?.orderStatusSplit?.map((c)=>({label:c.label, value:c.label}))) ?? []] || []

// order payment for filter
const filterPayment = [{label:'All Payments', value:'All Payments'},...(payments?.map((p)=>({label:p, value:p}))) ?? []] || []


    // pagination
  const limit = 8;
  const numberOfPages = [];
  for(let i = 1; i <= Math.ceil(filterdOrders?.length/limit); i++){
    numberOfPages.push(i)
  }

  const start = (page - 1) * limit;
  const end = start + limit;

  function handleNextPage(){
    if(page < numberOfPages.length){
      setPage(page + 1);
    }
  }
  function handlePreviousPage(){
    if(page > 1){
      setPage(page - 1)
    }
  }
  useEffect(() => {
  setPage(1);
}, [state, search , payment]);

  return (
    <>
        <h1 className='text-2xl font-bold'>Orders</h1>
        <p className='text-foreground/60 mb-5'>Track and manage every order · <span className='font-bold text-foreground'>{filterdOrders?.length}</span> total</p>

    <div className='flex max-lg:flex-col items-center gap-2 justify-end mb-4'>

{/* search bar */}
      <div className='relative w-full'>
      <Search className='absolute size-4.5 top-1/2 -translate-y-1/2 left-2'/>
      <input type="text" className='w-full border-2 p-1 rounded-[8px] pl-8' placeholder= {`Search by orderID or customerName...`} onChange={(e)=>setSearch(e.target.value)}/>
      </div>

{/* select state */}

      <div className='flex items-center gap-2 *:max-lg:flex-1 max-lg:w-full'>
      <Select value={state} disabled={ordersLoading} onValueChange={(value)=>setState(value)}> 
      <SelectTrigger className="rounded-[8px] cursor-pointer border-2 px-2 bg-muted font-bold py-4 text-md">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>
          {filterStatus.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>

{/* select Payment */}
    <Select value={payment} disabled={ordersLoading} onValueChange={(value)=>setPayment(value)}> 
      <SelectTrigger className="rounded-[8px] cursor-pointer border-2 px-2 bg-muted font-bold py-4 text-md">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Payments</SelectLabel>
          {filterPayment.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
      </div>

    </div>
        {/* orders */}
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
                  filterdOrders?.length === 0? 
                 <tr className=''>
                   <td colSpan={7} className='lg:text-center font-bold lg:p-10 p-5'>
                     <h1>No Orders</h1>
                   </td>
                 </tr>
                :
                  ordersLoading? 
                     <tr>
                     <td colSpan={7} className='w-full'>
                        <Skeleton className="w-full mt-1 h-100"/>
                     </td>
                     </tr>
                     :
                      filterdOrders?.slice(start, end)?.map((o)=>{
                     return(
                       <tr key={o?.id} className='*:p-3 *:text-start border-b *:font-bold'>
                         <td>{o?.id}</td>
                         <td >{o?.customer}</td>
                         <td>{o?.date}</td>
                         <td>{o?.payment}</td>
                         <td>$ {o?.total}</td>

                         <td className='w-8'>
                           <Select value={o?.status} onValueChange={(value)=> {changeOrderState({id: o?.id, status: value})}}>
                             <SelectTrigger className=" cursor-pointer w-full bg-muted max-w-40">
                               <SelectValue className='text-[17px]' style={{color: o.status === 'Delivered' ?
                                        "#22c55e" : o.status === "Shipped"?
                                        '#1c9cf0': o.status === "Processing"?
                                        "#8b5cf6": o.status === "Pending"?
                                        "#f59e0b": "#ef4444"}}
                                        />

                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Status</SelectLabel>
                                  {items.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                      {item.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </td>

                          <td ><Eye className='ml-2 cursor-pointer hover:text-primary' onClick={()=>{setViewOrder(true); setViewOrderId(o?.id)}}/></td>
                       </tr>
                     )
                   })
                 }
               </tbody>
             </table>
             </div>

             {/* pagination */}
             <div className='flex lg:gap-5 gap-1 lg:items-center items-end mt-5 justify-end max-lg:flex-col lg:mr-10 mr-5'>
              <h1 className='lg:pl-5 text-foreground/50'>Page {page} From {numberOfPages?.length}</h1>
             <ul className='flex items-center gap-2 '>
               <li className={`bg-primary px-2 py-0.5 text-white  font-bold cursor-pointer select-none`} onClick={() => setPage(1)}> First Page</li>
               <li className={`bg-primary size-7 text-white flex items-center justify-center font-bold cursor-pointer  ${page === 1 ? 'bg-primary/50 cursor-not-allowed':'cursor-pointer'}`} onClick={handlePreviousPage}> <ChevronLeft /></li>
               <span className='font-bold text-lg select-none'>{page}</span>
               <li className={`bg-primary size-7 text-white flex items-center justify-center font-bold cursor-pointer ${page === numberOfPages?.length ? 'bg-primary/50 cursor-not-allowed':'cursor-pointer'}`} onClick={handleNextPage}> <ChevronRight /></li>
               <li className={`bg-primary px-2 py-0.5 text-white  font-bold cursor-pointer select-none`} onClick={() => setPage(numberOfPages?.length)}> Last Page</li>
             </ul>
              </div>

              <ViewOrder id={viewOrderId} setViewOrder={setViewOrder} viewOrder={viewOrder}/>
    </>
  )
}

export default Orders