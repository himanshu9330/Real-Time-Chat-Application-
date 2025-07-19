import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import useAuth from './useAuth';

const useChat = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  isUsersLoading: false,
  isUserMessageLoading: false,

  // Fetch all users
  Allusers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get('/chat/users');
      console.log('Fetched users:', res.data);

      const users = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.users)
        ? res.data.users
        : [];

      set({ users });
      toast.success('All users loaded');
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Fetch messages of selected user
  userMessage: async (userId) => {
    set({ isUserMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/chat/${userId}`);
      console.log('Fetched messages:', res.data);
      set({ messages: res.data });
      toast.success('Messages loaded');
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      set({ isUserMessageLoading: false });
    }
  },

  // Send a message to selected user
  sendMessages: async (messageData) => {
    const { selectedUser, messages } = get();

    if (!selectedUser?._id) {
      toast.error('No user selected');
      return;
    }

    try {
      const res = await axiosInstance.post(`/chat/message/${selectedUser._id}`, messageData);
      console.log('Sent message:', res.data);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.error('Send message error:', error);
      toast.error(error?.response?.data?.message || 'Failed to send message');
    }
  },

  subscribeToMessages : ()=>{
           const {selectedUser}=get();
           if(!selectedUser) return
           const socket=useAuth.getState().socket;
          
           socket.on("newMessage", (newMessage)=>{
                 const newMessageSenderId=newMessage.senderId===selectedUser._id
                 if(!newMessageSenderId) return

                 set({
                    messages:[...get().messages, newMessage]
                 })
           })
  },

   unsubscribeToMessages: ()=>{
         const socket=useAuth.getState().socket;
         socket.off("newMessage")
   },


  setselectedUser: (user) => set({ selectedUser: user }),
}));

export default useChat;
