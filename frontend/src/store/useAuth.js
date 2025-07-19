import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from "socket.io-client";

//change during deployment//
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

const useAuth = create((set, get) => ({
  authUser: null,
  isSigningup: false,
  isLoggingIng:false,
  isUpdatingProfile:false,
  isCheckingAuth: true,
  onlineUsers:[],
  socket:null,
  

  ///when user send request for some data server must check is user authorized or not if all okk 
  // then res.data mean send data
  ///we have check API in backend for Authentication we such call it 
  checkAuth: async ()=>{
    try {
        const res = await axiosInstance.get("/user/check");
        set({authUser: res.data})
        get().connectSocket();
    } catch (error) {
        console.log("Error in checkAuth:", error)
        set({authUser:null});

    }finally{
        set({isCheckingAuth:false});
    }
  },

  signup: async (data) => {
    set({ isSigningup: true });
    try {
      const res = await axiosInstance.post("/user/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
       get().connectSocket();
     
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningup: false });
    }
  },



  signin: async (data)=>{
     set({isLoggingIng:true})

     try {
        const res= await axiosInstance.post("/user/signin", data)
        set({authUser:res.data})
        toast.success("You Loggedin successfully");
        get().connectSocket();
     } catch (error) {
        toast.error(error?.response?.data?.message || "LogIn failed");
     }finally{
      set({isLoggingIng:false})
     }
  },



  logout: async()=>{
     try {
        await axiosInstance.post("/user/logout")
        set({authUser:null})
        toast.success("Logged out successfully");
        get().disconnectSocket();
     } catch (error) {
       toast.error(error.response.data.message);
     }
  },


  updateProfile: async(data)=>{
       set({isUpdatingProfile:true})
       try {
            const res=await axiosInstance.put("/user/update", data)
            set({authUser:res.data})
            toast.success("Update successfully")

       } catch (error) {
          toast.error(error?.response?.data?.message || "update failed")
       }finally{
          set({isUpdatingProfile:false})
       }
  },


  //socket connected
connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUser", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
disconnectSocket: ()=>{
    if (get().socket?.connected) get().socket.disconnect();

}

}));

 


export default useAuth;


