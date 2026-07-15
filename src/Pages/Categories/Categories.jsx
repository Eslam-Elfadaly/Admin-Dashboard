import React, { useMemo } from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
// import api from '@/service/api'
import { supabase } from "@/lib/supabase";
import AddCategory from '@/Pages/Categories/AddCategory'
import EditCategory from './EditCategory'
import { Skeleton } from '@/components/ui/skeleton'
import { Trash2 } from 'lucide-react';
import { SquarePen } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner'
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

function Categories() {
      const [addCategory, setAddCategory] = useState(false);
      const [editCategory, setEditCategory] = useState(false);
      const [editCategoryId, setEditCategoryId] = useState();
      
      
  // get Categories
  const { data: categories, isPending: categoriesLoading } = useQuery({
  queryKey: ["categories"],
  queryFn: async () => {

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  },
});

const lastId = useMemo(() => {
  if (!categories?.length) return 0;

  return Math.max(
    ...categories.map((c) => Number(c.id.split("-")[1]))
  );
}, [categories]);

  // delete Categories
  const queryClient = useQueryClient();
  const {mutate: deleteCategories, isPending : deleteCategoriesLoading} = useMutation({
    mutationKey:['categories'],
    mutationFn: async ({ id }) => {

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  },
    onSuccess: ()=>{
      queryClient.invalidateQueries({
        queryKey:['categories']
      });
      toast.success(`Category deleted successfully`, {
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
      <h1 className='text-2xl font-bold'>Categories</h1>
      <p className='text-foreground/60 mb-5'>Organize your catalog · {categories?.length} categories</p>
      </div>
      <Button className='self-end text-md font-bold rounded-[10px] cursor-pointer p-4' onClick={()=>setAddCategory(true)}>Add Category</Button>
    </div>
       {
        categories?.length === 0? 
        <div className='flex justify-center h-full'>
          <h1 className='mt-50 font-bold text-xl'>No Categories</h1>
        </div>
        : 
        categoriesLoading? 
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
    <ul className='grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-5 mt-2'>
      {categories?.map((c)=>{
        return(
          <li key={c?.id} className='p-4 bg-card font-bold border-2 rounded-3xl'>

            <div className='border-b pb-2 mb-2'>
            <div className='flex justify-between mb-2'>
            <img src={c?.image} className='size-12 rounded-[12px]' alt="" />
            <span className={`
              ${c?.status === 'Active' && 'text-green-500'}
              ${c?.status === 'Inactive' && 'text-red-500'}
              ${c?.status === 'Draft' && 'text-foreground/60'}
               text-[14.5px]`}>
              {c?.status}
            </span>
            </div>

            <h1 className='text-[19px]'>{c?.name}</h1>
            <div className='text-sm text-foreground/50 mb-1'>/{c?.slug}</div>
            <span className='text-sm text-foreground/50 mb-2 '> <span className='text-foreground'>{c?.products}</span> Products</span>
            </div>
            <div className='flex items-center gap-3'>
            <div className='text-foreground flex items-center justify-center flex-1 border-2 p-1 rounded-2xl gap-1 cursor-pointer hover:bg-foreground/10 transition-colors duration-200' onClick={()=> {setEditCategory(true); setEditCategoryId(c?.id)}}>Edit <SquarePen className='size-5'/></div>

            <AlertDialog>
                    <AlertDialogTrigger><Trash2 className='text-foreground/40 hover:text-red-400 size-5.5 cursor-pointer'/></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className='font-bold'>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the Category and its associated data from the database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className='cursor-pointer font-bold rounded-[8px] p-3'>Cancel</AlertDialogCancel>
                        <AlertDialogAction className='cursor-pointer font-bold rounded-[8px] p-3' disabled={deleteCategoriesLoading} onClick={()=>deleteCategories({id: c?.id})}>{deleteCategoriesLoading?<><span>Deleting</span><Spinner/></>:'Delete'}</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
            </AlertDialog>
            </div>
          </li>
        )
      })}
    </ul>
      }
      <AddCategory lastId = {lastId} addCategory={addCategory} setAddCategory={setAddCategory}/>
      <EditCategory id={editCategoryId} editCategory={editCategory} setEditCategory={setEditCategory}/>
    </>
  )
}

export default Categories