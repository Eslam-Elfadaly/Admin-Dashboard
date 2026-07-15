import React, { useState } from 'react'
import { X } from 'lucide-react';
import { useForm , Controller} from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/service/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import axios from 'axios';
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

function AddCategory({addCategory, setAddCategory, lastId}) {

    const categoryStatus = ['Active', 'Draft', 'Inactive']
     const statueItems = categoryStatus?.map((s)=>({label: s , value: s }))
    const categorySchema = z.object({
                name: z.string().trim().min(3,'Name must be at least 3 characters'),
                slug: z.string().trim().min(3,'Slug must be at least 3 characters'),
                products: z.coerce.number('Products should be Number').positive('Products required and should be positive'),
                status:z.string({error : "Statue is required"}).min(1, "status is required"),
                image:z.any().refine((files) => files?.length > 0, "Choose File Please"),
                
    })
    const {register, handleSubmit, control ,formState:{errors}, reset} = useForm({
        resolver: zodResolver(categorySchema)
    })

    // add category
    const queryClient = useQueryClient();

    const {mutate: addCategories, isPending: categoryLoading} = useMutation({
       mutationKey:['categories'],
       mutationFn: async(categoryData)=>{

        const file = categoryData.image[0];
        
        const formData = new FormData();
        
        formData.append("file", file);
        formData.append("upload_preset", "products");
        
        const upload = await axios.post(
          "https://api.cloudinary.com/v1_1/ykupxxdn/image/upload",
          formData
        );
        
        const imageUrl = upload.data.secure_url;

        const {data} = await api.post(`categories`,{
            id: `cat-${lastId + 1 }`,
            name: categoryData?.name,
            slug: categoryData?.slug,
            products: categoryData?.products,
            status: categoryData?.status,
            image:imageUrl
        })
        return data;
       }, 
       onSuccess: ()=>{
        queryClient.invalidateQueries(['categories']);
        reset();
        setAddCategory(false);
        toast.success(`Category added successfully`, {
          style: {
            background: "green",
            color: "white",
          },
        });
       }
    })
  return (
    <div className= {`fixed top-0 left-0 z-50 w-full h-dvh ${addCategory? 'opacity-100 visible':'opacity-0 invisible'} transition-all duration-300 bg-black/70 overflow-hidden`} onClick={()=>setAddCategory(false)}>
         <div className={`bg-sidebar h-full lg:w-3/5 max-lg:w-[90%] ${addCategory? 'translate-x-0':'translate-x-full'} transition-all duration-400 absolute top-0 right-0`} onClick={(e)=> e.stopPropagation()}>

         <div className="title flex items-center justify-between lg:p-7 p-3 border-b-2">
           <div className='font-bold '>
               <h1 className='text-xl'>Add Category</h1>
               <p className='text-sm text-foreground/60'>Add necessary Category information here</p>
           </div>
           <X className='size-7 cursor-pointer' onClick={()=>setAddCategory(false)}/>
       </div>

       <div className="content overflow-y-auto lg:h-[76%] max-lg:h-[78%] mb-3 w-full bg-muted lg:p-7 p-4">
           <form onSubmit={handleSubmit(addCategories)} className='flex flex-col  mb-3 lg:gap-10 gap-9'>

               <label className='flex max-lg:flex-col lg:gap-15 gap-1 lg:items-center'>
               <span className='font-bold text-lg'>Category Name</span>
               <div className='lg:flex-1 max-lg:w-full lg:p-2'>
               <input type="text" placeholder='Category Name...' className='border-1 mb-1 rounded-[8px] border-foreground w-full p-2 border-2' {...register('name')}/>
               {errors.name && <p className='pl-1 text-sm text-red-500 font-bold'>* {errors.name?.message}</p>}
               </div>  
               </label>

               <label  className='flex max-lg:flex-col lg:gap-15 gap-1'>
               <span className='font-bold text-lg'>Category Slug</span>    
               <div className='lg:flex-1 max-lg:w-full lg:p-2'>
               <input type="text" placeholder='Category Slug' className='lg:flex-1 rounded-[9px] w-full max-lg:w-full p-2 border-2 border-foreground'  {...register('slug')} required/>
               {errors.slug && <p className='pl-1 text-sm text-red-500 font-bold'>* {errors.slug?.message}</p>}
               </div>
               </label>


               <label  className='flex max-lg:flex-col lg:gap-15 gap-1 lg:items-center'>
               <span className='font-bold text-lg'>Category Products</span> 
               <div className='lg:flex-1 max-lg:w-full lg:p-2'>
               <input type="number" placeholder='Category Products' className='border-1 mb-1 w-full rounded-[8px] border-foreground lg:flex-1 max-lg:w-full p-2 border-2'  {...register('products')} required/>
                 {errors.products && <p className='pl-1 text-sm text-red-500 font-bold'>* {errors.products?.message}</p>}
               </div>
               </label>

               <label className='flex max-lg:flex-col lg:gap-15 gap-1 lg:items-center'>
               <span className='font-bold text-lg'>Category Image</span>   
               <div className='lg:flex-1 max-lg:w-full lg:p-2'>
               <input type="file" placeholder='Category Quantity' className='border-1 w-full text-foreground/50 mb-1 rounded-[8px] border-foreground lg:flex-1 max-lg:w-full p-2 border-2'  {...register('image')} required/>
                 {errors.image && <p className='pl-1 text-sm text-red-500 font-bold'>* {errors.image?.message}</p>}
               </div>
               </label>

               <label className='flex max-lg:flex-col lg:gap-15 gap-1 lg:items-center'>
                   <span className='font-bold text-lg'>Category State</span>
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
               <Button className='bg-foreground/40 rounded-[8px] hover:bg-foreground/20 cursor-pointer'  onClick={()=>setAddCategory(false)}>Cancel</Button>
               <Button type="button" onClick={handleSubmit(addCategories)} className='rounded-[8px] cursor-pointer' disabled={categoryLoading}>{categoryLoading? <><span>Adding</span> <Spinner/></>:'Add Category'}</Button>
           </div>
        </div>
    </div>
  )
}

export default AddCategory