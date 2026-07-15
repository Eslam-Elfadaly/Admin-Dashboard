import { PanelLeft } from 'lucide-react';
import { Bell } from 'lucide-react';
import ModeToggle from '@/components/ui/mode-toggle';
import { useContext, useEffect, useState} from 'react';
import { sidebarContext } from "@/Context/SideBarProvider"
import Notifications from '@/components/features/Notifications';
// import api from '@/service/api';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '@/service/firebase';
import TextType from '@/components/TextType';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


function Navbar() {
    const {sidebarOpen, setSidebarOpen} = useContext(sidebarContext);
    const [notification, setNotification] = useState(false);
    const [user, setUser] = useState(null);

    // getNotifications

    const {data : notifications} = useQuery({
      queryKey: ['notifications'],
      queryFn: async () => {
       const { data, error } = await supabase
         .from("notifications")
         .select("*")
         .eq("read", true)
         .order("date", { ascending: false });
     
       if (error) {
         throw error;
       }
     
       return data || [];
     }
    })

    useEffect(()=>{
      const unsubscribe = onAuthStateChanged(auth, (currentUser)=>{
        setUser(currentUser)
      });
      return () => unsubscribe();
    },[])
  return (

    <div className='relative lg:py-4 py-3 px-5 flex gap-3 items-center justify-between bg-sidebar border-b-2 lg:mb-3 '>

      <div className='flex items-center gap-5'>
        <PanelLeft onClick={()=>setSidebarOpen(!sidebarOpen)} className='cursor-pointer'/>
        <TextType 
           className='text-[21px] font-bold text-primary'
           text={[`${user?.displayName.toUpperCase()}`]}
           typingSpeed={75}
           pauseDuration={1500}
           showCursor
           cursorCharacter="_"
           texts={["Welcome to React Bits! Good to see you!","Build some amazing experiences!"]}
           deletingSpeed={50}
           variablespeedenabled='false'
           variablespeedmin={60}
           variablespeedmax={120}
           cursorBlinkDuration={0.5}
/>
      </div>

        <div className='flex items-center gap-3 lg:pr-5'>
           <ModeToggle  className='border-primary'/>

           <div className='Notifications relative' onClick={()=>setNotification(!notification)}>
             <Bell className='size-5.5 cursor-pointer hover:text-primary active:text-primary'/>
             {notifications?.length !== 0 && <span className='absolute bg-primary size-2 rounded-full -top-1 right-0 z-20'/>}
           </div>

        {/* avatar in desktop */}
        <div className='flex items-center gap-3 max-md:hidden'>
          {user?.photoURL ? 
          <img src={user?.photoURL} className='size-10 rounded-full' alt={user?.displayName}/>
          :
          <span className='size-9 rounded-full bg-primary flex items-center justify-center text-white font-bold'>{user?.displayName.slice(0, 1).toUpperCase()}</span>
          }
        <div>
          <h1 ><span className='font-bold'>Full Name: </span>{user?.displayName}</h1>
          <span><span className='font-bold'>Email: </span>{user?.email}</span>
        </div>
        </div>

        {/* avatar in mobile */}

                    {user?.photoURL?
                     <DropdownMenu className='md:hidden'>
                       <DropdownMenuTrigger  className='md:hidden'>
                         <img src={user?.photoURL} className='size-10 rounded-full' alt={user?.displayName} />
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end" className='w-72 p-5'>
                        <div className="flex flex-col mb-2">
                          <img src={user?.photoURL} alt="" className="self-center rounded-full mb-5"/>
                          <div><span className="font-bold">Full Name : </span> <span className="text-sm">{user?.displayName}</span></div>
                          <div><span className="font-bold">Email : </span> <span className="text-sm">{user?.email}</span></div>
                        </div>
                       </DropdownMenuContent>
                      </DropdownMenu>
                     :
                    //  user hasNot photo
                     <DropdownMenu className='md:hidden'>
                       <DropdownMenuTrigger  className='md:hidden'>
                           <div className="bg-primary size-9 text-white rounded-full font-bold cursor-poiter flex items-center justify-center md:hidden">{user?.displayName?.slice(0, 1).toUpperCase()}</div>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end" className='w-72 p-5'>
                        <div className="flex flex-col mb-2">
                         <div className="bg-primary text-white size-15 font-bold flex items-center justify-center text-xl self-center rounded-full mb-5">{user?.displayName?.split('')[0].toUpperCase()}</div>
                          <div><span className="font-bold">Full Name : </span> <span className="text-sm">{user?.displayName}</span></div>
                          <div><span className="font-bold">Email : </span> <span className="text-sm">{user?.email}</span></div>
                        </div>
                       </DropdownMenuContent>
                      </DropdownMenu>
}

        </div>
      <Notifications notification={notification} setNotification={setNotification}/>
    </div>

  )
}

export default Navbar