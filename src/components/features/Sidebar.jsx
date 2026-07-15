import React, { useState } from 'react'
import { NavLink } from 'react-router'
import { ShoppingBag } from 'lucide-react';
import { PackageSearch } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import { Users } from 'lucide-react';
import { Ticket } from 'lucide-react';
import { LayoutDashboard } from 'lucide-react';
import {useContext} from 'react'
import { sidebarContext } from "@/Context/SideBarProvider"
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { X } from 'lucide-react';
import { Tag } from 'lucide-react';
import { auth } from '@/service/firebase';
import { signOut } from 'firebase/auth';
import { Spinner } from '../ui/spinner';

function Sidebar() {

  const [loading, setLoading] = useState(false);
  const {sidebarOpen, setSidebarOpen} = useContext(sidebarContext);
  const navigate = useNavigate();
  
  function NavigatePages(){
    if (window.innerWidth < 1024) {
    setSidebarOpen(false);
  }
  }
  
  async function signout(){
    try{
      setLoading(true);
      await signOut(auth);
      navigate('/')
    }
    catch(error){
      alert(error)
    }
    finally{
      setLoading(false)
    }
  }
  return (
    <div className={`max-lg:h-full max-lg:fixed  max-lg:z-50  top-0 left-0 max-lg:bg-foreground/40 ${sidebarOpen? ' max-lg:w-full':' max-lg:w-0'}`} onClick={()=>setSidebarOpen(false)}>

    <div className={`flex flex-col  py-4 max-lg:absolute  bg-sidebar text-foreground h-screen  shadow-2xl overflow-hidden  ${sidebarOpen? 'w-70 px-3 border-r-2 ' : 'w-0 px-0 '} transition-all duration-300`} onClick={(e)=>{e.stopPropagation()}}>

    <div className="logo text-foreground flex items-center justify-between  text-2xl  mb-7  font-bold p-2"><span className='flex items-center gap-1'><ShoppingBag className='text-primary'/>StoreFlow</span> <X size='27' className='lg:hidden' onClick={() => {setSidebarOpen(false)}}/> </div>

    <div className="navigations *:mb-3 *:p-3 mb-6 border-b-2">
    <NavLink to='/home/dashboard' className={({isActive})=>`flex items-center gap-2 text-foreground  transition-all duration-300   rounded-2xl ${isActive? 'bg-accent text-primary' : 'hover:text-accent-foreground hover:bg-accent'}`} onClick={NavigatePages}><LayoutDashboard/>Dashboard</NavLink>
    <NavLink to='/home/products' className={({isActive})=>`flex items-center gap-2 text-foreground  transition-all duration-300   rounded-2xl ${isActive? 'bg-accent text-primary ' : 'hover:text-accent-foreground hover:bg-accent'}`} onClick={NavigatePages}><PackageSearch />Products</NavLink>
    <NavLink to='/home/orders' className={({isActive})=>`flex items-center gap-2 text-foreground   transition-all duration-300   rounded-2xl ${isActive? 'bg-accent text-primary ' : 'hover:text-accent-foreground hover:bg-accent'}`} onClick={NavigatePages}><ShoppingCart />Orders</NavLink>
    <NavLink to='/home/customers' className={({isActive})=>`flex items-center gap-2 text-foreground   transition-all duration-300  rounded-2xl ${isActive? 'bg-accent text-primary ' : 'hover:text-accent-foreground hover:bg-accent'}`} onClick={NavigatePages}><Users />Customers</NavLink>
    <NavLink to='/home/category' className={({isActive})=>`flex items-center gap-2 text-foreground   transition-all duration-300 rounded-2xl ${isActive? 'bg-accent text-primary ' : 'hover:text-accent-foreground hover:bg-accent'}`} onClick={NavigatePages}> <Tag />Categories</NavLink>
    <NavLink to='/home/coupons' className={({isActive})=>`flex items-center gap-2 text-foreground   transition-all duration-300 rounded-2xl ${isActive? 'bg-accent text-primary ' : 'hover:text-accent-foreground hover:bg-accent'}`} onClick={NavigatePages}><Ticket />Coupons</NavLink>
    </div>

    <Button className='bg-primary text-md cursor-pointer' disabled={loading} variant='default' size='lg' onClick={signout}>
      {loading? <><span>Logging Out</span><Spinner/></>:'Log Out'}
    </Button>
    </div>

    </div>
  )
}

export default Sidebar