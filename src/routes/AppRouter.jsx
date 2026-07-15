import {Route , Routes} from "react-router";
import MainLayout from "@/layouts/MainLayout";
import Dashboard from "@/Pages/Dashboard";
import Products from "@/Pages/Products/Products";
import Orders from "@/Pages/Orders/Orders";
import Customers from "@/Pages/Customers";
import Analytics from "@/Pages/Coupons/Coupons";
import SignIn from "@/Pages/SignIn/Up/SignIn";
import SignUp from "@/Pages/SignIn/Up/SignUp";
import Categories from "@/Pages/Categories/Categories";
import ProtectedRoute from "./ProtectedRoute";

import { useEffect } from 'react';
import { useLocation } from 'react-router';

const AppRouter = ()=>{
    return(
        
        <Routes>

        <Route path='/' element = {<SignIn/>}/>
        <Route path='/signUp' element = {<SignUp/>}/>

        <Route path='/home' element = {<ProtectedRoute><MainLayout/></ProtectedRoute>}>
        <Route path='dashboard' element = {<Dashboard/>}/>
        <Route path='products' element = {<Products/>}/>
        <Route path='orders' element = {<Orders/>}/>
        <Route path='customers' element = {<Customers/>}/>
        <Route path='coupons' element = {<Analytics/>}/>
        <Route path='category' element = {<Categories/>}/>
        </Route>
       </Routes>
    )
}

export default AppRouter;