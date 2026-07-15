import React, {useState, useEffect} from 'react'
import { X } from 'lucide-react';
import { useForm , Controller} from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";   
import z from 'zod';
// import api from '@/service/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from "sonner"
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function EditProduct({editProduct, setEditProduct, id}) {

    const [imageHidden, setImageHidden] = useState(true);
    const statueItems = [
                      { label: "Active", value: 'Active' },
                      { label: "Inactive", value: "Inactive" },
                      { label: "Draft", value: "Draft" },
                      { label: "Out Of Stock", value: "Out Of Stock" }]


    const productSchema = z.object({
        name: z.string().trim().min(3, 'name must be at least 3 characters'),
        description: z.string().trim().min(3, 'description must be at least 3 characters'),
        price:z.coerce.number('Price should be Number').gt(0,'Price required and should be Positive'),
        stock: z.coerce.number('Quantity should be Number').positive('Quantity required and should be positive'),
        category: z.string({error : "Category is required"}).min(1, "Category is required"),
        image:z.any().optional(),
        status:z.string({error : "Statue is required"}).min(1, "status is required"),
    })
    const {register, handleSubmit,control,reset, formState:{errors}} = useForm({
        resolver:zodResolver(productSchema),
    })

      // get Categories

    async function getCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("*");
    
      if (error) {
        throw error;
      }
    
      return data || [];
    }

   const {data:categories} = useQuery({

    queryKey:['categories'],
    queryFn: getCategories,
  })
  const categoryitems = categories?.map((c)=>({label:c.name, value:c.name})) || []

//   getCurrentProduct

const {data:product, isPending: getProductPending} = useQuery({
    queryKey: ['products', id],
    queryFn: () => getProduct(id),
})

async function getProduct(id) {

  if (!id) {
    return null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

//  editProduct
const queryClient = useQueryClient();

const {mutate, isPending : editProductPending} = useMutation({
    mutationFn: PatchProduct,
    onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:['products']});
        reset();
        setEditProduct(false);
        toast.success(`Product updated successfully`, {
          style: {
            background: "green",
            color: "white",
          },
        });
    }
})
async function PatchProduct(data){

    let imageUrl = product?.image;
    if(data.image?.[0]){

        const file = data.image[0];
        
       const formData = new FormData();
  
     formData.append("file", file);
     formData.append("upload_preset", "products");
  
  const upload = await axios.post(
    "https://api.cloudinary.com/v1_1/ykupxxdn/image/upload",
    formData
  );

    imageUrl = upload.data.secure_url;
}

 const { data: updatedProduct, error } = await supabase
    .from("products")
    .update({
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      category: data.category,
      status: data.status,
      image: imageUrl,
    })
    .eq("id", id)
    .select()
    .single();


  if (error) {
    throw error;
  }

  return updatedProduct;
}

useEffect(()=>{
    if(product){
        reset({
         name: product.name,
         description: product.description,
         price: product.price,
         stock: product.stock,
         category: product.category,
         status: product.status,
})
    }
},[product, reset])
  return (
    <div className= {`fixed top-0 left-0 z-50 w-full h-dvh ${editProduct? 'opacity-100 visible':'opacity-0 invisible'} transition-all duration-300 bg-black/70 overflow-hidden`} onClick={()=>setEditProduct(false)}>
        <div className={`bg-sidebar h-full lg:w-3/5 max-lg:w-[90%] ${editProduct? 'translate-x-0':'translate-x-full'} transition-all duration-400 absolute top-0 right-0`} onClick={(e)=> e.stopPropagation()}>

        <div className="title flex items-center justify-between lg:p-7 p-3 border-b-2">
            <div className='font-bold '>
                <h1 className='text-xl'>Edit Product</h1>
                <p className='text-sm text-foreground/60'>Edit necessary product information here</p>
            </div>
            <X className='size-7 cursor-pointer' onClick={()=>setEditProduct(false)}/>
        </div>

        <div className="content overflow-y-auto lg:h-[76%] max-lg:h-[78%] mb-3 w-full bg-muted lg:p-7 p-4">
            <form onSubmit={handleSubmit(mutate)} className='flex flex-col  mb-3 lg:gap-10 gap-9'>

                <label htmlFor="name" className='flex max-lg:flex-col lg:gap-15 gap-1 lg:items-center'>
                <span className='font-bold text-lg'>Product Name</span>
                <div className='lg:flex-1 max-lg:w-full lg:p-2'>
                <input type="text" placeholder='Product Name / Title' className='border-1 mb-1 rounded-[8px] border-foreground w-full p-2 border-2' id='name' {...register('name')}/>
                {errors.name && <p className='pl-1 text-sm text-red-500 font-bold'>* {errors.name?.message}</p>}
                </div>  
                </label>

                <label htmlFor="description" className='flex max-lg:flex-col lg:gap-15 gap-1'>
                <span className='font-bold text-lg'>Product Description</span>    
                <div className='lg:flex-1 max-lg:w-full lg:p-2'>
                <textarea type="text" placeholder='Product Description...' className='lg:flex-1 h-30 rounded-[9px] w-full max-lg:w-full p-2 border-1 border-foreground' id='description' {...register('description')} />
                {errors.description && <p className='pl-1 text-sm text-red-500 font-bold'>* {errors.description?.message}</p>}
                </div>
                </label>

                <label className='flex max-lg:flex-col lg:gap-15 gap-1 lg:items-center'>
                <span className='font-bold text-lg'>Product Image</span>    
                <div className='lg:flex-1 max-lg:w-full lg:p-2'>
                <input type="file" className='lg:flex-1 cursor-pointer w-full border-1 mb-1 border-foreground rounded-[8px] max-lg:w-full p-2 border-2' {...register('image')} />
                {errors.image && <p className='pl-1 text-sm text-red-500 font-bold'>* {errors.image?.message}</p>}
                </div>
                </label>
                <div className='relative w-fit'>
                {imageHidden && <X className= 'size-6 cursor-pointer absolute -top-5 peer -right-2' onClick={()=>setImageHidden(!imageHidden)}/>}
                {imageHidden && <img src={product?.image} className='size-28 peer-checked:hidden' alt="" />}
                </div>

                <label className='flex max-lg:flex-col lg:gap-15 gap-1 lg:items-center'>
                    <span className='font-bold text-lg'>Category</span>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value || ''}
                          onValueChange={field.onChange}
                          
                        >

                        <div className='lg:flex-1 max-lg:w-full lg:p-2'>
                          <SelectTrigger className='lg:flex-1 bg-foreground/15 mb-1 w-full rounded-[10px] max-lg:w-full font-bold text-md border-2 '>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          {errors.category && <p className='pl-1 text-sm text-red-500  font-bold'>* {errors.category?.message}</p>}
                         </div>


                          <SelectContent>
                            <SelectGroup>
                              {categoryitems.map((item) => (
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

                <label htmlFor="price" className='flex max-lg:flex-col lg:gap-15 gap-1 lg:items-center'>
                <span className='font-bold text-lg'>Product Price</span> 
                <div className='lg:flex-1 max-lg:w-full lg:p-2'>
                <input type="number"  placeholder='Product Price' className='border-1 mb-1 w-full rounded-[8px] border-foreground lg:flex-1 max-lg:w-full p-2 border-2' id='price' {...register('price')} required/>
                  {errors.price && <p className='pl-1 text-sm text-red-500 font-bold'>* {errors.price?.message}</p>}
                </div>
                </label>

                <label htmlFor="quantity" className='flex max-lg:flex-col lg:gap-15 gap-1 lg:items-center'>
                <span className='font-bold text-lg'>Product Quantity</span>   
                <div className='lg:flex-1 max-lg:w-full lg:p-2'>
                <input type="number"  placeholder='Product Quantity' className='border-1 w-full mb-1 rounded-[8px] border-foreground lg:flex-1 max-lg:w-full p-2 border-2' id='quantity' {...register('stock')} required/>
                  {errors.stock && <p className='pl-1 text-sm text-red-500 font-bold'>* {errors.stock?.message}</p>}
                </div>

                </label>

                <label className='flex max-lg:flex-col lg:gap-15 gap-1 lg:items-center'>
                    <span className='font-bold text-lg'>State</span>
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
                <Button className='bg-foreground/40 rounded-[8px] hover:bg-foreground/20 cursor-pointer'  onClick={()=>setEditProduct(false)}>Cancel</Button>
                <Button type="button" onClick={handleSubmit(mutate)} className='rounded-[8px] cursor-pointer' disabled={editProductPending}>{editProductPending? <><span>Editing</span> <Spinner/></>:'Edit Product'}</Button>
            </div>
        </div>
    </div>
  )
}

export default EditProduct