import { auth } from "@/service/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router";
import { Spinner } from "@/components/ui/spinner";

function ProtectedRoute({children}) {

    const [user, setUser] = useState();

    useEffect(()=>{
        const unsubscripe = onAuthStateChanged(auth, (currentUser)=>{
            setUser(currentUser)
        });
        return () => unsubscripe();
    },[])

if (user === undefined) {
    return <div className="text-lg font-bold flex justify-center items-center gap-2  w-screen h-screen"><span>Loading</span> <Spinner /></div> 
  }

  if (!user) {
    return <Navigate to="/"/>;
  }
    return children
}

export default ProtectedRoute