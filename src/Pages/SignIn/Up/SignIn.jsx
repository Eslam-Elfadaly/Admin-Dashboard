import React, { useEffect, useState } from 'react'
import { HexagonBackground } from '@/components/animate-ui/components/backgrounds/hexagon';
import { LogIn, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider } from '@/service/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { toast } from "sonner"
import { Spinner } from '@/components/ui/spinner';

function SignIn() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const loginSchema = z.object({
    email: z.email('Please enter a valid email address'),
    password: z.string().trim().min(6, 'password should be at least 6 characters').max(50, "Password is too long"),
  })
  const {register, handleSubmit, reset, formState:{errors}} = useForm({
    resolver: zodResolver(loginSchema),
  })

  async function SignInWithEmail(data){

    try{
        setLoading(true);
        const result = await signInWithEmailAndPassword(auth, data.email, data.password);
        console.log(result);
        navigate('/home/dashboard')
        toast.success(`Welcome, ${result.user?.displayName?.split(" ")[0].toUpperCase()}`, {
        style: {
          background: "green",
          color: "white",
        },
      });
      }
      catch(error){
        reset();
        if(error.code === 'auth/invalid-credential'){
          toast.warning("Invalid account", {
            style: {
              background: "red",
              color: "white",
            },
          });
        }

        else{
          toast.warning("Logging In Error !", {
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

  async function signInWithGoogle(){
    setLoading(true);
      try{
          const result = await signInWithPopup(auth, googleProvider);
          setLoading(false);
          navigate('/home/dashboard');

          toast.success(`Welcome, ${result.user?.displayName?.split(" ")[0]}`, {
          style: {
          background: "green",
          color: "white",
        },

      });
          console.log(result);
      }
      catch(error){
        toast.warning(`Sign In Error ,${error}`, {
        style: {
          background: "red",
          color: "white",
        },
      });
      }
      finally{
        setLoading(false)
      }
  }

  useEffect(()=>{
    reset({
      email: 'guest21@gmail.com',
      password: '123456789'
    })
  },[])
  
  return (
    <>
    <HexagonBackground className='w-full z-50 h-dvh relative'>
      <div className='absolute top-1/2 left-1/2 -translate-1/2 font-bold border-2 bg-card max-md:w-[90%] md:w-2/6 shadow-xl rounded-2xl p-6'>
      <h1 className='font-bold text-2xl text-center text-primary mb-10'>Sign In</h1>

      <form onSubmit={handleSubmit(SignInWithEmail)}>

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

        <div className='flex items-center gap-3 cursor-pointer hover:bg-foreground/10 active:bg-foreground/10 py-1 px-3 rounded-2xl' onClick={()=>signInWithGoogle()}>
          <span>Sign in with google</span>
          <FcGoogle  className='size-6 flex-1'/>
        </div>
        </div>
      </form>
      <div className='text-center text-sm mt-3'>You Don't Have An Account ? <NavLink to='/signUp' className='text-primary underline'>Sign Up</NavLink></div>

      </div>
    </HexagonBackground>
    </>
  )
}

export default SignIn