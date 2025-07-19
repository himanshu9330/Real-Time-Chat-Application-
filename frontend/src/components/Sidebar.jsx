import React, { useEffect, useState } from 'react';
import useChat from '../store/useChat';
import useAuth from '../store/useAuth';
import SidebarSkeleton from './skeleton/SidebarSkeleton';
import { Users } from 'lucide-react';

function Sidebar() {
  const { Allusers, users, selectedUser, setselectedUser, isUserLoading } = useChat();
  const { onlineUsers } = useAuth();
  const [showonlineonly, setShowonlineonly] = useState(false);

  useEffect(() => {
    Allusers();
  }, [Allusers]);

  // Filter users based on online status
  const filteruser = showonlineonly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Top Section */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* Toggle for Online Only */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showonlineonly}
              onChange={(e) => setShowonlineonly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      {/* User List */}
      <div className="overflow-y-auto w-full py-3">
        {filteruser.map((user) => (
          <button
            key={user._id}
            onClick={() => setselectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? 'bg-base-300 ring-1 ring-base-300' : ''}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profile || '/avatar.png'}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.name}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
