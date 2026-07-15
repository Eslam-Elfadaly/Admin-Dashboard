import { Outlet } from "react-router"
import Sidebar from "@/components/features/Sidebar"
import Navbar from "@/components/features/Navbar"
import SideBarProvider from "@/Context/SideBarProvider"
import ScrollToTop from "@/components/features/ScrollToTop"

function MainLayout(){

    return(
        <SideBarProvider>
        <div className='lg:flex bg-sidebar  overflow-hidden'>
            <Sidebar/>
            <div className="flex-1 flex flex-col h-screen">
                
                <Navbar />
                <ScrollToTop/>

                <div className='lg:px-3 lg:pb-3 h-dvh overflow-hidden'>
                <div id="main-content" className={`bg-background lg:rounded-2xl max-lg:pb-17 lg:px-5 py-5 max-lg:px-3 overflow-y-auto h-full scrollbar-thumb-accent scrollbar-thin`}>
                <Outlet/>
                </div>
                </div>
            </div>
        </div>
        </SideBarProvider>
    )
}

export default MainLayout