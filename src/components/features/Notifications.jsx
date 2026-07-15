import React from 'react'
import api from '@/service/api';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '../ui/spinner';

function Notifications({notification, setNotification}) {
    const {data : notifications , isPending: notificationLoading} = useQuery({
      queryKey: ['notifications'],
      queryFn : async ()=>{
        const {data} = await api.get('notifications');

        const selected = data?.filter((n)=> n?.read === false)
        return selected || []; 
      },
    })
  return (
    <div className={`fixed top-0 right-0 bg-transparent z-30 w-screen h-screen ${notification? 'opacity-100 visible':'opacity-0 invisible'} transition-all duration-300`} onClick={()=>setNotification(false)}>
    <div className='bg-muted z-40 max-md:w-[95%] lg:w-1/2 select-none absolute top-16 right-2 lg:right-15  border-2 border-foreground/20 p-2 rounded-[10px] shadow-[0_20px_55px_rgba(0,0,0,0.35)]' onClick={(e)=> e.stopPropagation()}>
        <ul className='overflow-y-auto max-h-90 scrollbar-thumb-accent scrollbar-thin'>
        {notificationLoading?
        <div className='p-3 flex items-center font-bold gap-1 justify-center'>
            <span>Loading</span><Spinner/>
        </div>
        :
        notifications?.length === 0?
        <div className='p-3 text-center'>
            <h1 className='font-bold'>You have no notifications!</h1>
        </div>
        :
        notifications?.slice(0, 5)?.map((n)=>{
            return(
             <li key={n?.id} className='mb-3 border-b-2 pb-2 hover:bg-foreground/10 transition-colors duration-200  active:bg-foreground/10 p-2 cursor-pointer rounded-2xl'>

                <div className='flex gap-2'>
                <span className='bg-primary mt-2 shrink-0 size-2 rounded-full'/>

                <div className='flex flex-col '>
                <h1 className='font-bold '>{n?.title}</h1>
                <p className='text-sm text-foreground/60'>{n?.description}</p>
                <span className='text-xs text-foreground/60'>{n?.date}</span>
                </div>
                </div>
             </li>   
            )
        })}
        </ul>
    </div>
    </div>
  )
}

export default Notifications