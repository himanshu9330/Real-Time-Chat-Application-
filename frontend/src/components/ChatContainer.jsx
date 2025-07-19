import React, { useEffect, useRef } from 'react';
import useChat from '../store/useChat';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import MessageSkeleton from './skeleton/MessageSkeleton';
import useAuth from '../store/useAuth';

function formatMessageTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function ChatContainer() {
  const messages = useChat((state) => state.messages);
  const selectedUser = useChat((state) => state.selectedUser);
  const isUserMessageLoading = useChat((state) => state.isUserMessageLoading);
  const userMessage = useChat((state) => state.userMessage);
  const  unsubscribeToMessages = useChat((state) => state. unsubscribeToMessages)
  const  subscribeToMessages = useChat((state) => state. subscribeToMessages)

  const authUser = useAuth((state) => state.authUser); // ✅ Correct Zustand usage
  const messageEndRef = useRef(null);

  useEffect(() => {
  userMessage(selectedUser._id);

    subscribeToMessages();

    return () =>  unsubscribeToMessages();
}, [selectedUser?._id, subscribeToMessages,]);


  
   useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);



  if (isUserMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <ChatInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isSender = message.senderId?._id === authUser?._id;


          // Debug log
          console.log({
            messageId: message._id,
            senderId: message.senderId,
            authUserId: authUser?._id,
            isSender
          });

          return (
            <div
              key={message._id}
              className={`chat ${isSender ? 'chat-end' : 'chat-start'}`}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      isSender
                        ? authUser?.profile || '/avatar.png'
                        : selectedUser?.profile || '/avatar.png'
                    }
                    alt="profile pic"
                  />
                </div>
              </div>

              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          );
        })}

        {/* Scroll-to-bottom anchor */}
        <div ref={messageEndRef}></div>
      </div>

      <ChatInput />
    </div>
  );
}

export default ChatContainer;
