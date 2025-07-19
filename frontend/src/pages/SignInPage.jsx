import React, { useState } from 'react'
import useAuth from '../store/useAuth';
import { toast } from 'react-hot-toast';
import { data } from 'react-router-dom';
import{MessageSquare,Mail,Lock, Eye, EyeOff, Loader2} from 'lucide-react'
import AuthImagePattern from '../components/AuthImagePattern';
import { Link } from 'react-router-dom';


function SignInPage() {
  const [password, setPassword]=useState(false);
  const [formData, setFormData]=useState({
    email:"",
    password:""
  })

  const {signin, isLoggingIng}=useAuth();

  const validateForm=()=>{
    if(!formData.email.trim()) {
      toast.error("Email is required!");
      return false;
    }
    if(!/\S+@\S+\.\S+/.test(formData.email)){
      toast.error("Invalid Email Formate!");
      return false;
    }
    if(!formData.password.trim()){
       toast.error("password is requird!");
      return false;
    }
    if(formData.password.length<6){
      toast.error("Password length should be more than 6 !");
      return false;
    }
    return true
  }

  const handleSubmit=(e)=>{
       e.preventDefault();
       const success= validateForm()
       if(success===true) signin(formData);
         
    
  }
  return (
     <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">

           {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>


          {/*form*/}
          <form  onSubmit={handleSubmit} className="space-y-6">

               {/*email*/}
               <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/*password*/}
             <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={password ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setPassword(!password)}
                >
                  {password ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>


                </div>

              </div>
                 {/*submit button*/}
                 <button className="btn btn-primary w-full"  type='submit' disabled={isLoggingIng}>
                  {isLoggingIng ?(
                    <>
                     <Loader2 className="h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ):
                  (
                    
                     "Sign in"
                    
                  )
                 }

                 </button>
           
          </form>
             <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
          

          {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"Sign in to continue your conversations and catch up with your messages."}
      />
     </div>
  )
}

export default SignInPage
