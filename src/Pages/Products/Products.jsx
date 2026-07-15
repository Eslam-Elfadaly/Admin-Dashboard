import React from 'react'
// import api from '@/service/api'
import { supabase } from "@/lib/supabase";
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Switch } from "@/components/ui/switch"
import { SquarePen } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton"
import AddProduct from '@/Pages/Products/AddProduct'
import EditProduct from '@/Pages/Products/EditProduct'
import { ChevronRight } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner'
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

function Products() {

  const [category, setCategory] = useState('All Categories');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [addProduct, setAddProduct] = useState(false)
  const [editProduct, setEditProduct] = useState(false);
  const [editProductId, setEditProductId] = useState();
  
  // get Products

  const { data: products, isPending: productsLoading } = useQuery({
  queryKey: ["products"],
  queryFn: async () => {

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  }
});

      const filterdProduct =  products?.filter((p)=>{
        const matchCategory = category === 'All Categories' || p?.category === category;
        const matchSearch = search.trim() === '' || p?.name.toLowerCase().includes(search.toLowerCase())
        return matchCategory && matchSearch
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
  const items = [{label:'All Categories', value:'All Categories'},...(categories?.map((c)=>({label:c.name, value:c.name}))) ?? []] || []

  
  // change Status
  const queryClient = useQueryClient();
  
  const {mutate : changeState} = useMutation({
  mutationFn : changeStatus,
  
  onSuccess:() => {
    queryClient.invalidateQueries({
      queryKey : ['products']
    })
    toast.success(`State updated successfully`, {
          style: {
            background: "green",
            color: "white",
          },
        });
  }
})

async function changeStatus({ id, status }) {

  const { data, error } = await supabase
    .from("products")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// delete product
const {mutate : deleteProduct, isPending:deleteProductLoading} = useMutation({
  mutationFn : deleteProducts,
  
  onSuccess:() => {
    queryClient.invalidateQueries({
      queryKey : ['products']
    })
    toast.success(`Product deleted successfully`, {
          style: {
            background: "green",
            color: "white",
          },
        });
  }
})

async function deleteProducts({ id }) {

  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// pagination
const limit = 7;
const start = (page - 1) * limit;
const end = start + limit;

const numberOfPages = [];

for(let i = 1; i <= Math.ceil(filterdProduct?.length/limit); i++){
  numberOfPages.push(i)
}
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
}, [search, category]);

return (
  <>
    <h1 className='text-2xl font-bold'>Products</h1>
    <p className='text-foreground/60 mb-5'>Manage your catalog · {filterdProduct?.length} products total</p>

    <div className='flex max-lg:flex-col items-center gap-2 justify-end mb-4'>

{/* search bar */}
      <div className='relative w-full'>
      <Search className='absolute size-4.5 top-1/2 -translate-y-1/2 left-2'/>
      <input type="text" className='w-full border-2 p-1 rounded-[8px] pl-8' placeholder= {`Search Product...`} onChange={(e)=>setSearch(e.target.value)}/>
      </div>

{/* select Category */}

      <div className='flex items-center gap-2 max-lg:w-full'>
      <Select value={category} disabled={productsLoading} onValueChange={(value)=>setCategory(value)}> 
      <SelectTrigger className="rounded-[8px] cursor-pointer border-2 px-2 bg-muted font-bold py-4 text-md">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categories</SelectLabel>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>

{/* add product */}
    <Button className='p-4 text-md rounded-[8px] max-lg:flex-1 font-bold cursor-pointer' onClick={()=>setAddProduct(!addProduct)}>Add Product</Button>
      </div>

    </div>

{/* table header */}
    <div className='overflow-x-auto'>
      <table className='max-lg:min-w-[1000px] lg:min-w-full table-fixed border-collapse'>
        <thead className='bg-muted'>
          <tr className='*:p-3 text-foreground/60 *:text-start'>
            <th className='rounded-l-2xl lg:w-1/3'>product</th>
            <th>Category</th>
            <th>Price</th>
            <th>stock</th>
            <th>Status</th>
            <th>published</th>
            <th className='rounded-r-2xl'>actions</th>
          </tr>
        </thead>

        {/* table body */}
        <tbody>
          {filterdProduct?.length === 0? 
          <tr className=''>
            <td colSpan={7} className='lg:text-center font-bold lg:p-10 p-5'>
              <h1>No Products</h1>
            </td>
          </tr>
          :
          productsLoading? 
          <tr>
          <td colSpan={7} className='w-full'>
             <Skeleton className="w-full mt-5 h-100"/>
          </td>
          </tr>
          :
          filterdProduct?.slice(start, end)?.map((p)=>{
            return(
              <tr className='*:p-3 border-b font-bold' key={p?.id}>
                <td className='flex items-center gap-2'>
                  <img src={p?.image} alt={p?.name} className='size-12 rounded-full'/>
                  <div className='flex flex-col'>
                    <span className='font-bold'>{p?.name}</span>
                    <span className='text-foreground/70 text-xs'>{p?.id}</span>
                  </div>
                </td>

                <td>{p?.category}</td>
                <td>$ {p?.price}</td>
                <td className='text-sm *:p-1 *:rounded-[8px]'>
                  {p?.stock >= 50 && <span className='bg-green-300 text-green-600'>In Stock . {p?.stock}</span>}
                  {(p?.stock < 50 && p?.stock > 0) && <span className='bg-yellow-300 text-yellow-600'>Low Stock . {p?.stock}</span>}
                  {p?.stock === 0 && <span className='bg-red-300 text-red-600'>Out Of Stock . {p?.stock}</span>}
               </td>
                <td>{p?.status}</td>
                <td className='*:cursor-pointer'><Switch checked={p?.status === 'Active' ? true : false} onCheckedChange={(value)=>  changeState({id:p?.id ,status: value?'Active':'Inactive'})}/></td>
                <td> 
                  <div className='flex gap-3 items-center *:cursor-pointer'>
                  <SquarePen className='text-primary' onClick={()=>{setEditProduct(!editProduct); setEditProductId(p?.id)}}/>

                  <AlertDialog>
                    <AlertDialogTrigger><Trash2 className='text-red-500'/></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className='font-bold'>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the Product and its associated data from the database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className='cursor-pointer font-bold rounded-[8px] p-3'>Cancel</AlertDialogCancel>
                        <AlertDialogAction className='cursor-pointer font-bold rounded-[8px] p-3' disabled={deleteProductLoading} onClick={()=>deleteProduct({id: p?.id})}>{deleteProductLoading?<><span>Deleting</span><Spinner/></>:'Delete'}</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  </div> 
                  </td>
              </tr>
            )
          })}
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

      <AddProduct  addProduct={addProduct} setAddProduct={setAddProduct}/>
      <EditProduct id={editProductId} editProduct={editProduct} setEditProduct={setEditProduct}/>
    </>
  )
}

export default Products