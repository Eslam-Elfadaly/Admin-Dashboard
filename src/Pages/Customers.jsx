import React, { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '@/service/api';
import { Trash2 } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronRight } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
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

function Customers() {

  const [page, setPage] = useState(1);
  const [state, setState] = useState('All Status');
  const [search, setSearch] = useState('')
  const customersStatue = ['Active', 'Inactive', 'Blocked'];

  // get Customers
  const {data: customers, isPending:customersLoading} = useQuery({
    queryKey:['customers',state, search],
    queryFn: async()=>{
      const {data} = await api.get('customers');
      return data || [];
    },
  })

    

    const filterdCustomers = customers?.filter((c)=>{
      const matchStatus = state === 'All Status' || c?.status === state;
      const matchSearch = search.trim() === '' || c?.name.includes(search.toLowerCase()) || c?.email.includes(search.toLowerCase());
      return matchStatus && matchSearch;
    })

  // customers Status
      const filterStatus = [{label:'All Status', value:'All Status'},...(customersStatue?.map((s)=>({label:s, value:s}))) ?? []] || []


  // Delete Customer
  const queryClient = useQueryClient();

  const {mutate: deleteCustomers, isPending:deleteCustomerLoading} = useMutation({
    mutationFn:deleteCustomer,
    onSuccess:()=>{queryClient.invalidateQueries({
      queryKey:['customers'],

    });
    toast.success(`Customer deleted successfully`, {
          style: {
            background: "green",
            color: "white",
          },
        });
  },
  })

   async function deleteCustomer({id}){
    const {data} = await api.delete(`customers/${id}`);

    return data || [];
  }
  
  // pagination
  const limit = 8;
  const numberOfPages = [];
  for(let i = 1; i <= Math.ceil(filterdCustomers?.length/limit); i++){
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
  }, [search, state]);
  

  return (
    <>
       <h1 className='text-2xl font-bold'>Customers</h1>
       <p className='text-foreground/60 mb-5'>{filterdCustomers?.length} people have shopped with you</p>

      <div className='flex max-lg:flex-col items-center gap-2 justify-end mb-4'>
{/* search bar */}
      <div className='relative w-full'>
      <Search className='absolute size-4.5 top-1/2 -translate-y-1/2 left-2'/>
      <input type="text" className='w-full border-2 p-1 rounded-[8px] pl-8' placeholder= {`Search by name or email...`} onChange={(e)=>setSearch(e.target.value)}/>
      </div>
      
{/* select state */}
      <Select value={state} disabled={customersLoading} onValueChange={(value)=>setState(value)}> 
      <SelectTrigger className="rounded-[8px] self-start cursor-pointer border-2 px-2 bg-muted font-bold py-4 text-md">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>
          {filterStatus?.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
    </div>

     {/* Customers */}
     <div className='overflow-x-auto'>
     <table className='max-lg:min-w-[1200px] lg:min-w-full table-fixed border-collapse'>
       <thead className='bg-muted'>
         <tr className='*:p-3 *:text-start text-foreground/60'>
           <th className='rounded-l-2xl'>Id</th>
           <th>Name</th>
           <th>Email</th>
           <th>Phone</th>
           <th>Joining Date</th>
           <th>Status</th>
           <th>Orders</th>
           <th >Total Spent</th>
           <th className='rounded-r-2xl'>Actions</th>
         </tr>
       </thead>
       <tbody>
         {
          filterdCustomers?.length === 0? 
         <tr className=''>
           <td colSpan={7} className='lg:text-center font-bold lg:p-10 p-5'>
             <h1>No Orders</h1>
           </td>
         </tr>
        :
          customersLoading? 
             <tr>
             <td colSpan={7} className='w-full'>
                <Skeleton className="w-full mt-1 h-100"/>
             </td>
             </tr>
             :
              filterdCustomers?.slice(start, end)?.map((c)=>{
             return(
               <tr key={c?.id} className='*:p-3 *:text-start border-b *:font-bold'>
                 <td className='flex items-center gap-1 '><img src={c?.avatar} className='size-11 rounded-full' alt={c?.name} />{c?.id}</td>
                 <td >{c?.name}</td>
                 <td>{c?.email}</td>
                 <td>{c?.phone}</td>
                 <td>{c?.joined}</td>
                 <td className={`
                  ${c?.status === 'Active' && 'text-green-500'}
                  ${c?.status === 'Inactive' && 'text-gray-400'}
                  ${c?.status === 'Blocked' && 'text-red-500'}
                  `}>{c?.status}</td>
                 <td>{c?.orders}</td>
                 <td>$ {c?.spent}</td>
                 <td> 
                  <div className='flex gap-3 justify-center items-center *:cursor-pointer'>                    
                  <AlertDialog>
                    <AlertDialogTrigger><Trash2 className='text-red-500'/></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className='font-bold'>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the Customer and its associated data from the database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className='cursor-pointer font-bold rounded-[8px] p-3'>Cancel</AlertDialogCancel>
                        <AlertDialogAction className='cursor-pointer font-bold rounded-[8px] p-3' disabled={deleteCustomerLoading} onClick={()=>deleteCustomers({id: c?.id})}>{deleteCustomerLoading?<><span>Deleting</span><Spinner/></>:'Delete'}</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  </div> 
                  </td>
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
       <li className={`bg-primary size-7 text-white flex items-center justify-center font-bold  ${page === 1 ? 'bg-primary/50 cursor-not-allowed':'cursor-pointer'}`} onClick={handlePreviousPage}> <ChevronLeft /></li>
       <span className='font-bold text-lg select-none'>{page}</span>
       <li className={`bg-primary size-7 text-white flex items-center justify-center font-bold  ${page === numberOfPages?.length ? 'bg-primary/50 cursor-not-allowed':'cursor-pointer'}`}  onClick={handleNextPage}> <ChevronRight /></li>
       <li className={`bg-primary px-2 py-0.5 text-white  font-bold cursor-pointer select-none`} onClick={() => setPage(numberOfPages?.length)}> Last Page</li>
     </ul>
      </div>

    </>
  )
}

export default Customers