import { useEffect } from 'react';

import { socket } from './socket';
import { useAuthStore } from './store/auth';
import { useChatStore } from './store/chat';
import ChatBody from './components/ChatBody';
import User from './components/User';
import AuthModal from './components/AuthModal';
import Chats from './components/Chats';
import AddFriend from './components/AddFriend';
import ErrorModal from './components/ErrorModal';

function App() {
  const user = useAuthStore((state) => state.user);
  const showAddFriend = useAuthStore((state) => state.showAddFriend);

  const authModal = useAuthStore((state) => state.authModal);
  const setAuthModal = useAuthStore((state) => state.setAuthModal);

  const room = useChatStore((state) => state.room);
  const setOnlineUsers = useChatStore((state) => state.setOnlineUsers);
  const errorModal = useChatStore((state) => state.errorModal);
  const setErrorModal = useChatStore((state) => state.setErrorModal);

  useEffect(() => {
    socket.on('online-users-updated', (onlineUsers) => {
      setOnlineUsers(onlineUsers);
    });

    socket.on('error', (error) => setErrorModal({ ...error, show: true }));

    return () => {
      socket.off('online-users-updated');
      socket.off('error');
    };
  }, []);

  return (
    <div className="w-full h-screen bg-darkerBG text-gray-50">
      <div className="h-full md:flex">
        <div className="flex flex-col min-w-[300px] h-max">
          <User />

          {showAddFriend && <AddFriend />}

          <Chats />
        </div>

        <div
          className={`w-full h-screen p-2 md:m-2 md:p-0 md:h-auto md:block ${
            room ? 'block' : 'hidden'
          }`}
        >
          {room ? (
            <ChatBody />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-lg text-center text-gray-300 border rounded-md border-darkBg">
              {user ? (
                <p>Open chat to see messages here. Or Start a new chat.</p>
              ) : (
                <div className="flex flex-col items-center gap-8">
                  <p className="text-2xl">
                    Login or Sign up to start using the chat.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setAuthModal({ for: 'login', show: true })}
                      className="px-10 py-2 font-semibold transition-all rounded-md bg-accentDark text-darkerBG hover:bg-accent"
                    >
                      Login
                    </button>
                    <button
                      onClick={() =>
                        setAuthModal({ for: 'sign-up', show: true })
                      }
                      className="px-10 py-2 font-semibold transition-all rounded-md bg-accentDark text-darkerBG hover:bg-accent"
                    >
                      Sign up
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {authModal.show && <AuthModal />}

      {errorModal.show && <ErrorModal />}
    </div>
  );
}

export default App;
