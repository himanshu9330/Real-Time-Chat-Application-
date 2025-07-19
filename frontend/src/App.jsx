import React from 'react'
import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { axiosInstance} from './lib/axios'
import  useAuth from './store/useAuth'
import {useTheme} from './store/useTheme'
import Navbar from './components/Navbar'
import  HomePage from './pages/HomePage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'



function App() {
  const  {authUser , checkAuth, isCheckingAuth, onlineUsers}=useAuth()

  const {theme}=useTheme();
  console.log({ onlineUsers });

  useEffect(()=>{
    checkAuth();
  }, [checkAuth]);
  console.log({authUser});


  //Loading porsing during authenthication for each user request
  if(isCheckingAuth && !useAuth) return(
          <div className="flex items-center justify-center h-screen">
              <Loader className="size-10 animate-spin"/>

          </div>

  )

  return (
    <div data-theme={theme}>
      <Navbar/>
       <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/signin"/>}/>
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/"/>}/>
        <Route path='/signin' element={!authUser ? <SignInPage /> :<Navigate to="/"/>}/>
        <Route path='/settings' element={<SettingsPage />}/>
        <Route path='/profile' element={authUser ? <ProfilePage />: <Navigate to="/signin"/>}/>
       </Routes>

       <Toaster/>
    </div>
  )
}

export default App
