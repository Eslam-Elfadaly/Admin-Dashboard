import {createContext, useState} from "react";

export const sidebarContext = createContext();

function SideBarProvider({children}){

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth < 1024 ? false : true);
  return (
    <sidebarContext.Provider value={{sidebarOpen, setSidebarOpen}}>
      {children}
    </sidebarContext.Provider>
  )
  
}

export default SideBarProvider