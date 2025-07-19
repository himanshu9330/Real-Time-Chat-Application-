import React, { useState, useRef } from 'react';
import useChat from '../store/useChat';
import toast from 'react-hot-toast';
import { Image, Send, X } from 'lucide-react';

function ChatInput() {
  const [Text, setText] = useState('');
  const [ImagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessages } = useChat();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!Text.trim() && !ImagePreview) return;

    try {
      await sendMessages({
        text: Text.trim(),
        image: ImagePreview,
      });

      // Clear form
      setText('');
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="p-4 w-full">
      {ImagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={ImagePreview}
              alt="preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={handleImageRemove}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
                        flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message...."
            value={Text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              ImagePreview ? 'text-emerald-500' : 'text-zinc-400'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        <button
          type="submit"
          className={`btn btn-sm btn-circle ${
            !Text.trim() && !ImagePreview ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!Text.trim() && !ImagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
}

export default ChatInput;
