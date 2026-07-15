import React from 'react'
import { X } from 'lucide-react';
import { useForm , Controller} from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/service/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from "sonner"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function AddCoupon({addCoupon, setAddCoupon, lastId}) {

    const couponStatus = ['Active', 'Expired', 'Scheduled', 'Disabled']
     const statueItems = couponStatus?.map((s)=>({label: s , value: s }))

    const couponSchema = z.object({
                code: z.string().trim().min(3, 'Code must be at least 3 characters'),
                type: z.string().trim().min(3, 'Type must be at least 3 characters'),
                value: z.coerce.number('value should be Number').positive('value required and should be positive'),
                minSpend: z.coerce.number('minSpend should be Number').positive('minSpend required and should be positive'),
                limit: z.coerce.number('limit should be Number').positive('limit required and should be positive'),
                expires: z.string('expires is required '),
                status:z.string({error : "Statue is required"}).min(1, "status is required"),
    })
    const {register, handleSubmit, control ,formState:{errors}, reset} = useForm({
        resolver: zodResolver(couponSchema)
    })

    // add Coupon
    const queryClient = useQueryClient();
    const {mutate: addCoupons, isPending: couponLoading} = useMutation({
       mutationKey:['coupons'],
       mutationFn: async(formData)=>{
        const {data} = await api.post(`coupons`,{
            id: `CPN-${lastId + 1 }`,
            code: formData?.code,
            type: formData?.type,
            value: formData?.value,
            minSpend: formData?.minSpend,
            used: 0,
            limit: formData?.limit,
            expires: formData?.expires,
            status: formData?.status,
        })
        return data;
       }, 
       onSuccess: ()=>{
        queryClient.invalidateQueries(['coupons']);
        reset();
        setAddCoupon(false);
        toast.success(`Coupon added successfully`, {
          style: {
            background: "green",
            color: "white",
          },
        });
       }
    })
  return (
    <div className= {`fixed top-0 left-0 z-50 w-full h-dvh ${addCoupon? 'opacity-100 visible':'opacity-0 invisible'} transition-all duration-300 bg-black/70 overflow-hidden`} onClick={()=>setAddCoupon(false)}>
         <div className={`bg-sidebar h-full lg:w-3/5 max-lg:w-[90%] ${addCoupon? 'translate-x-0':'translate-x-full'} transition-all duration-400 absolute top-0 right-0`} onClick={(e)=> e.stopPropagation()}>

         <div className="title flex items-center justify-between lg:p-7 p-3 border-b-2">
           <div className='font-bold '>
               <h1 className='text-xl'>Add Coupon</h1>
               <p className='text-sm text-foreground/60'>Add necessary Coupon information here</p>
           </div>
           <X className='size-7 cursor-pointer' onClick={()=>setAddCoupon(false)}/>
       </div>

       <div className="content overflow-y-auto lg:h-[76%] max-lg:h-[78%] mb-3 w-full bg-muted lg:p-7 p-4">
           <form onSubmit={handleSubmit(addCoupons)} className='flex flex-col  mb-3 lg:gap-10 gap-9'>

               <label className='flex max-lg:flex-col lg:gap-15 gap-1 lg:items-center'>
               <span className='font-bold text-lg'>Coupon Code</span>
               <div className='lg:flex-1 max-lg:w-full lg:p-2'>
               <input type="text" placeholder='Coupon Code (EXTRA26)' className='border-1 mb-1 rounded-[8px] border-foreground w-full p-2 border-2' {...register('code')}/>
               {errors.code && <p className='pl-1 text-sm text-red-500 font-bold'>* {errors.code?.message}</p>}
               </div>  
               </label>

               <label  className='flex max-lg:flex-col lg:gap-15 gap-1'>
               <span className='font-bold text-lg'>Coupon Type</span>    
               <div className='lg:flex-1 max-lg:w-full lg:p-2'>
               <input type="text" placeholder='Coupon Type (Free Shipping)' className='lg:flex-1 rounded-[9px] w-full max-lg:w-full p-2 border-2 border-foreground'  {...register('type')} required/>
               {errors.type && <p className='pl-1 text-sm text-red-500 font-bold'>* {errors.type?.message}</p>}
               </div>
               </label>


               <label  className='flex max-lg:flex-col lg:gap-15 gap-1 lg:items-center'>
               <span className='font-bold text-lg'>Coupon Value</span> 
               <div className='lg:flex-1 max-lg:w-full lg:p-2'>
               <input type="number" placeholder='Coupon Value' className='border-1 mb-1 w-full rounded-[8px] border-foreground lg:flex-1 max-lg:w-full p-2 border-2'  {...register('value')} required/>
                 {errors.value && <p className='pl-1 text-sm text-red-500 font-bold'>* {errors.value?.message}</p>}
               </div>
               </label>

               <label className='flex max-lg:flex-col lg:gap-15 gap-1 lg:items-center'>
               <span className='font-bold text-lg'>Coupon MinSpend</span>   
               <div className='lg:flex-1 max-lg:w-full lg:p-2'>
               <input type="number" placeholder='Coupon MinSpend' className='border-1 w-full mb-1 rounded-[8px] border-foreground lg:flex-1 max-lg:w-full p-2 border-2'  {...register('minSpend')} required/>
                 {errors.minSpend && <p className='pl-1 text-sm text-red-500 font-bold'>* {errors.minSpend?.message}</p>}
               </div>
               </label>

               <label  className='flex max-lg:flex-col lg:gap-15 gap-1 lg:items-center'>
               <span className='font-bold text-lg'>Coupon Limit</span>   
               <div className='lg:flex-1 max-lg:w-full lg:p-2'>
               <input type="number" placeholder='Coupon Limit' className='border-1 w-full mb-1 rounded-[8px] border-foreground lg:flex-1 max-lg:w-full p-2 border-2'  {...register('limit')} required/>
                 {errors.limit && <p className='pl-1 text-sm text-red-500 font-bold'>* {errors.limit?.message}</p>}
               </div>
               </label>

               <label className='flex max-lg:flex-col lg:gap-15 gap-1 lg:items-center'>
               <span className='font-bold text-lg'>Coupon Expires</span>   
               <div className='lg:flex-1 max-lg:w-full lg:p-2'>
               <input type="date" placeholder='Coupon Quantity' className='border-1 w-full mb-1 rounded-[8px] border-foreground lg:flex-1 max-lg:w-full p-2 border-2'  {...register('expires')} required/>
                 {errors.expires && <p className='pl-1 text-sm text-red-500 font-bold'>* {errors.expires?.message}</p>}
               </div>
               </label>

               <label className='flex max-lg:flex-col lg:gap-15 gap-1 lg:items-center'>
                   <span className='font-bold text-lg'>Coupon State</span>
                   <Controller
                     name="status"
                     control={control}
                     render={({ field }) => (
                       <Select
                         value={field.value || ''}
                         onValueChange={field.onChange}
                       >

                        <div className='lg:flex-1 max-lg:w-full lg:p-2'>
                         <SelectTrigger className='lg:flex-1 w-full mb-1 bg-foreground/15 rounded-[10px] max-lg:w-full font-bold text-md border-2 '>
                           <SelectValue placeholder="Select State" />
                         </SelectTrigger>
                          {errors.status && <p className='pl-1 text-sm text-red-500 font-bold'>* {errors.status?.message}</p>}
                        </div>

                         <SelectContent>
                           <SelectGroup>
                             {statueItems.map((item) => (
                               <SelectItem
                                 key={item.value}
                                 value={item.value}
                               >
                                 {item.label}
                               </SelectItem>
                             ))}
                           </SelectGroup>
                         </SelectContent>
                       </Select>
                       )}
                       />
               </label>
           </form>
       </div>

           <div className="buttons flex gap-2 px-4 w-full *:flex-1 *:p-4.5 *:text-lg font-bold">
               <Button className='bg-foreground/40 rounded-[8px] hover:bg-foreground/20 cursor-pointer'  onClick={()=>setAddCoupon(false)}>Cancel</Button>
               <Button type="button" onClick={handleSubmit(addCoupons)} className='rounded-[8px] cursor-pointer' disabled={couponLoading}>{couponLoading? <><span>Adding</span> <Spinner/></>:'Add Coupon'}</Button>
           </div>
        </div>
    </div>
  )
}

export default AddCoupon