import React, { useState } from 'react'
import { HexagonBackground } from '@/components/animate-ui/components/backgrounds/hexagon';
import { NavLink, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { auth} from '@/service/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { toast } from "sonner"
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft } from 'lucide-react';

function SignUp() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const loginSchema = z.object({
    firstName: z.string('First Name should be string').min(3, 'First Name should be at least 3 characters'),
    lastName: z.string('Last Name should be string').min(3, 'Last Name should be at least 3 characters'),
    email: z.email('Please enter a valid email address'),
    password: z.string().trim().min(6, 'password should be at least 6 characters').max(50, "Password is too long"),
  })
  const {register, handleSubmit, reset, formState:{errors}} = useForm({
    resolver: zodResolver(loginSchema),
  })

  async function signUpp(data){

    try{
        setLoading(true);
        const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
        await updateProfile (result?.user,{
          displayName : `${data?.firstName} ${data?.lastName}`
        })

        console.log(result);
        navigate('/home/dashboard');

        toast.success("SignUp Successful", {
        style: {
          background: "green",
          color: "white",
        },
      });
      }
      catch(error){
        reset();
        if(error.code === 'auth/email-already-in-use'){
          toast.warning("Email is already exist", {
        style: {
          background: "red",
          color: "white",
        },
      });
      }

      else{
          toast.warning("SomeThing Wrong", {
        style: {
          background: "red",
          color: "white",
        },
      });
      }
      }
      finally{
        setLoading(false)
      }
  };

  
  return (
    <>
    <HexagonBackground className='w-full z-50 h-dvh relative'>
      <div className='absolute top-1/2 left-1/2 -translate-1/2 font-bold border-2 bg-card max-md:w-[90%] md:w-2/6 shadow-xl rounded-2xl p-6'>
      <ArrowLeft className='size-7 hover:text-primary active:text-primary cursor-pointer' onClick={()=> navigate('/')}/>
      <h1 className='font-bold text-2xl text-center text-primary mb-10'>Sign Up</h1>

      <form onSubmit={handleSubmit(signUpp)}>

        <label htmlFor="firstName" className='flex flex-col mb-5'>
          <span className='text-lg'>First Name</span>
        <input type="text" name='firstName' id='firstName' placeholder='First Name' className='p-2 border rounded-[10px]' {...register('firstName')}/>
        {errors?.firstName && <p className='text-[13px] text-red-500'>* {errors?.firstName?.message}</p>}
        </label>

        <label htmlFor="lastName" className='flex flex-col mb-5'>
          <span className='text-lg'>Last Name</span>
        <input type="text" name='lastName' id='lastName' placeholder='Last Name' className='p-2 border rounded-[10px]' {...register('lastName')}/>
        {errors?.lastName && <p className='text-[13px] text-red-500'>* {errors?.lastName?.message}</p>}
        </label>

        <label htmlFor="email" className='flex flex-col mb-5'>
          <span className='text-lg'>Email</span>
        <input type="email" name='email' id='email' placeholder='example@gmail.com' className='p-2 border rounded-[10px]' {...register('email')}/>
        {errors?.email && <p className='text-[13px] text-red-500'>* {errors?.email?.message}</p>}
        </label>

        <label htmlFor="password" className='flex flex-col mb-5'>
          <span className='text-lg'>Password</span>
        <input type="password" name='password' id='password' placeholder='password...'  className='p-2 border rounded-[10px]' {...register('password')}/>
        {errors?.password && <p  className='text-[13px] text-red-500'>* {errors?.password?.message}</p>}
        </label>

        <div className="buttons flex flex-col items-center gap-3">          
        <Button className='w-full rounded-[10px] text-md cursor-pointer' disabled={loading} type='submit'>{loading? <><span>Signing In</span><Spinner/></>:'Sign In'}</Button>
        </div>
      </form>

      </div>
    </HexagonBackground>
    </>
  )
}

export default SignUp