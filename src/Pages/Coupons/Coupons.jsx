import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import api from '@/service/api'
import AddCoupon from '@/Pages/Coupons/AddCoupons'
import { Spinner } from '@/components/ui/spinner'
import { Skeleton } from '@/components/ui/skeleton'
import { Trash2 } from 'lucide-react';
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


function Coupons() {

  const [addCoupon, setAddCoupon] = useState(false)

  // get Coupons
  const {data: coupons, isPending : couponsLoading} = useQuery({
    queryKey:['coupons'],
    queryFn: async ()=>{
      const {data} = await api.get('coupons');
      return data
    }
  });

  const lastId = useMemo(() => {
    if (!coupons?.length) return 0;
  
    return Math.max(
      ...coupons.map((c) => Number(c.id.split("-")[1]))
    );
  }, [coupons]);
  
  // delete Coupons
  const queryClient = useQueryClient();
  const {mutate: deleteCoupons, isPending : deleteCouponsLoading} = useMutation({
    mutationKey:['coupons'],
    mutationFn: async ({id})=>{
      const {data} = await api.delete(`coupons/${id}`);
      return data;
    },
    onSuccess: ()=>{
      queryClient.invalidateQueries({
        queryKey:['coupons']
      });
      toast.success(`Coupon deleted successfully`, {
          style: {
            background: "green",
            color: "white",
          },
        });
    }
  });

  return (
    <>
    <div className="title flex flex-col">
      <div>
      <h1 className='text-2xl font-bold'>Coupons</h1>
      <p className='text-foreground/60 mb-5'>{coupons?.length} discount codes · manage promotions</p>
      </div>
      <Button className='self-end text-md font-bold rounded-[10px] cursor-pointer p-4' onClick={()=>setAddCoupon(true)}>Add Coupon</Button>
    </div>

      {
        coupons?.length === 0? 
        <div className='flex justify-center h-full'>
          <h1 className='mt-50 font-bold text-xl'>No Coupons</h1>
        </div>
        : 
        couponsLoading? 
        <ul className='grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-5 mt-2'>
          <li><Skeleton className='w-full h-50'/></li> 
          <li><Skeleton className='w-full h-50'/></li> 
          <li><Skeleton className='w-full h-50'/></li> 
          <li><Skeleton className='w-full h-50'/></li> 
          <li><Skeleton className='w-full h-50'/></li> 
          <li><Skeleton className='w-full h-50'/></li> 
          <li><Skeleton className='w-full h-50'/></li> 
          <li><Skeleton className='w-full h-50'/></li> 
          <li><Skeleton className='w-full h-50'/></li> 
        </ul>
      :
    <ul className='grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-4 mt-2'>
      {coupons?.map((c)=>{
        return(
          <li key={c?.id} className='p-3 font-bold border-2 bg-card rounded-3xl'>

            <div className='flex items-center justify-between mb-2'>
            <span className='bg-foreground/20 p-1.5 rounded-[11px] text-[13px]'>{c?.code}</span>
            <span className={`
              ${c?.status === 'Active' && 'text-green-500'}
              ${c?.status === 'Expired' && 'text-red-500'}
              ${c?.status === 'Scheduled' && 'text-primary'}
              ${c?.status === 'Disabled' && 'text-yellow-500'}
               text-[14.5px]`}>
              {c?.status}
            </span>
            </div>

            <h1 className='text-[19px]'>{c?.type === 'Free Shipping'? 'Free Shipping' : c?.type === 'Fixed Amount' ? `$${c?.value} off`:`${c?.value}% off`}</h1>
            <div className='text-sm text-foreground/50 mb-3'>Min. spend ${c?.minSpend}. Expires {c?.expires}</div>
            <div className='border-b pb-4'>
              <div className='flex items-center justify-between text-sm text-foreground/50 lg:mb-1'><span>Usage</span> <span>{c?.used} / <span>{(c?.limit || c?.used * 3)}</span></span></div>
              
              <div className='w-full h-1 bg-muted rounded-2xl relative'>
                <span className={`absolute top-0 left-0 ${c?.status === 'Expired'? 'bg-red-500' : 'bg-primary'} z-20 h-full rounded-2xl`} style={{width:`${(c?.used / (c?.limit || c?.used * 3)) * 100}%`}}/>
              </div>
            </div>

            <div className='flex mt-2 justify-end'>
            <AlertDialog>
                    <AlertDialogTrigger><Trash2 className='text-foreground/40 hover:text-red-400 size-5.5 mr-2 cursor-pointer'/></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className='font-bold'>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the Product and its associated data from the database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className='cursor-pointer font-bold rounded-[8px] p-3'>Cancel</AlertDialogCancel>
                        <AlertDialogAction className='cursor-pointer font-bold rounded-[8px] p-3' disabled={deleteCouponsLoading} onClick={()=>deleteCoupons({id: c?.id})}>{deleteCouponsLoading?<><span>Deleting</span><Spinner/></>:'Delete'}</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
            </div>
          </li>
        )
      })}
    </ul>
      }
    <AddCoupon lastId = {lastId} addCoupon={addCoupon} setAddCoupon={setAddCoupon}/>
    </>
  )
}

export default Coupons