import React from 'react'
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/service/api';
import { Button } from '@/components/ui/button';
import { Spinner } from "@/components/ui/spinner"

function ViewOrder({viewOrder, setViewOrder, id }) {

const {data: order, isPending: orderLoading} = useQuery({
  queryKey:['orders', id],
  queryFn: getOrder,
})

async function getOrder(){
  
  if(id){
    const {data} = await api.get(`orders/${encodeURIComponent(id)}`);
    return data || [];
  }
  return []
}


  return (
    <>
    <div className= {`fixed top-0 left-0 z-50 w-full h-dvh ${viewOrder? 'opacity-100 visible':'opacity-0 invisible'} transition-all duration-300 bg-black/70 overflow-hidden`} onClick={()=>setViewOrder(false)}>
    <div className='bg-white text-black max-lg:w-full lg:w-3/6 h-[90%] absolute top-1/2 left-1/2 -translate-1/2 overflow-y-auto' onClick={(e)=> e.stopPropagation()}>
    {orderLoading?
     <div className='flex items-center justify-center h-full lg:p-7 p-4'>
      <Button className='font-bold text-md rounded-[8px]' disabled={orderLoading}>Loading Order Info <Spinner/></Button>
     </div>
     :

    <div>

    <div className='flex items-center justify-between text-black border-b border-black lg:p-5 p-4'>
      <h1 className='text-[21px] font-bold'>Invoice</h1>
      <X className='size-7 cursor-pointer no-print' onClick={()=>setViewOrder(false)}/>
    </div>

    <div className='font-bold text-black text-[17px] flex flex-col gap-3 border-b border-black lg:p-5 p-4'>
      <div>Order ID: <span className='dark:text-background/50 text-foreground/50'>{order?.id}</span></div>
      <div>Customer ID: <span className='dark:text-background/50 text-foreground/50'>{order?.customerId}</span></div>
      <div>Customer Name: <span className='dark:text-background/50 text-foreground/50'>{order?.customer}</span></div>
      <div>Email: <span className='dark:text-background/50 text-foreground/50'>{order?.email}</span></div>
      <div>Date: <span className='dark:text-background/50 text-foreground/50'>{order?.date}</span></div>
      <div>ShippingAddress: <span className='dark:text-background/50 text-foreground/50'>{order?.shippingAddress}</span></div>
      <div>ItemCount: <span className='dark:text-background/50 text-foreground/50'>{order?.itemCount}</span></div>
      <div>Total: <span className='dark:text-background/50 text-foreground/50'>$ {order?.total}</span></div>
      <div >Status: <span className='dark:text-background/50 text-foreground/50'
      style={{color: order?.status === 'Delivered' ?
            "#22c55e" : order?.status === "Shipped"?
            '#1c9cf0': order?.status === "Processing"?
            "#8b5cf6": order?.status === "Pending"?
            "#f59e0b": "#ef4444"
          }}
      >{order?.status}
      </span>
      </div>
      <div>Payment: <span className='dark:text-background/50 text-foreground/50'>{order?.payment}</span></div>
    </div>

               <div className='overflow-x-auto lg:p-5 p-4 '>
                <h1 className='font-bold text-xl mb-1'>Items</h1>
             <table className='max-lg:min-w-[800px] lg:min-w-full table-fixed border-collapse'>
               <thead className='bg-muted'>
                 <tr className='*:p-3 *:text-start text-foreground/60'>
                   <th className='rounded-l-2xl'>Product Id</th>
                   <th>Name</th>
                   <th>Price</th>
                   <th>Quantity</th>
                   <th className='rounded-r-2xl'>Total</th>
                 </tr>
               </thead>
               <tbody>
               {order?.items?.map((i)=>{
                return(
                  <tr key={i?.productId} className='*:p-3 *:text-start border-b *:font-bold'>
                    <td>{i?.productId}</td>
                    <td>{i?.name}</td>
                    <td>$ {i?.price}</td>
                    <td>{i?.quantity}</td>
                    <td>$ {i?.quantity * i?.price.toFixed(2)}</td>
                  </tr>
                )
               })}
               </tbody>
             </table>
             </div>
             </div>
  }

    </div>
    </div>
    </>
  )
}

export default ViewOrder