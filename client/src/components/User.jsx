import { useAuthStore } from '../store/auth';
import { useChatStore } from '../store/chat';

export default function User() {
  const room = useChatStore((state) => state.room);
  const user = useAuthStore((state) => state.user);
  const setAuthModal = useAuthStore((state) => state.setAuthModal);
  const setShowAddFriend = useAuthStore((state) => state.setShowAddFriend);

  const onlineUsers = useChatStore((state) => state.onlineUsers);

  return (
    <div
      className={`px-5 py-5 md:block m-2 rounded-md bg-darkBg ${
        room ? 'hidden' : 'block'
      }`}
    >
      {user ? (
        <div className="flex gap-4">
          <div className="relative w-12 h-12">
            <div
              className={`w-4 h-4 border-4 border-darkBg rounded-full absolute bottom-0 right-0 ${
                onlineUsers.includes(user._id) ? 'bg-green-600' : 'bg-gray-400'
              }`}
            />

            <div className="flex items-center justify-center w-12 h-12 text-gray-400 rounded-full bg-darkerBG">
              <p>
                {user.firstName[0]}
                {user.lastName[0]}
              </p>
            </div>
          </div>

          <div className="flex flex-col">
            <p>
              {user.firstName} {user.lastName}
            </p>

            <div className="flex">
              <p className="text-gray-400 text-sm">@{user.userName}</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddFriend(true)}
            className="flex flex-col items-center justify-center gap-1 ml-auto"
          >
            <img
              src="/add-user-icon.svg"
              alt="add use icon"
              className="w-6 ml-2"
            />
            <p className="text-xs text-gray-100">Add friend</p>
          </button>
        </div>
      ) : (
        <div className="flex justify-between gap-4">
          <button
            onClick={() => setAuthModal({ for: 'login', show: true })}
            className="w-full px-6 py-2 font-semibold transition-all rounded-md bg-darkerBG hover:bg-accent hover:text-darkerBG"
          >
            Login
          </button>
          <button
            onClick={() => setAuthModal({ for: 'sign-up', show: true })}
            className="w-full px-6 py-2 font-semibold transition-all rounded-md bg-darkerBG hover:bg-accent hover:text-darkerBG"
          >
            Sign up
          </button>
        </div>
      )}
    </div>
  );
}
