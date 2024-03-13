import ChatBody from './components/ChatBody';
import { useEffect } from 'react';
import { socket } from './socket';
import User from './components/User';
import { useAuthStore } from './store/auth';
import AuthModal from './components/AuthModal';
import Chats from './components/Chats';
import AddFriend from './components/AddFriend';
import { useChatStore } from './store/chat';
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
    socket.on('get-online-users', (onlineUsers) => {
      setOnlineUsers(onlineUsers);
    });

    socket.on('error', (error) => setErrorModal({ ...error, show: true }));

    return () => {
      socket.off('get-online-users');
      socket.off('error');
    };
  }, []);

  return (
    <div className="w-full h-screen bg-darkerBG text-gray-50">
      <div className="flex h-full">
        <div className="flex flex-col min-w-[300px]">
          <User />

          {showAddFriend && <AddFriend />}

          <Chats />
        </div>

        <div className="w-full m-2">
          {room ? (
            <ChatBody />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-lg text-center text-gray-300 border rounded-md border-darkBg">
              {user ? (
                <p>Open chat to see messages here. Or Start a new chat.</p>
              ) : (
                <div className="flex flex-col gap-8  items-center">
                  <p className="text-2xl">
                    Login or Sign up to start using the chat.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setAuthModal({ for: 'login', show: true })}
                      className="bg-accentDark text-darkerBG font-semibold px-10 py-2 rounded-md hover:bg-accent transition-all"
                    >
                      Login
                    </button>
                    <button
                      onClick={() =>
                        setAuthModal({ for: 'signup', show: true })
                      }
                      className="bg-accentDark text-darkerBG font-semibold px-10 py-2 rounded-md hover:bg-accent transition-all"
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
