import ChatBody from './components/ChatBody';
import ChatHead from './components/ChatHead';
import { useEffect, useState } from 'react';
import { socket } from './socket';
import User from './components/User';
import { useAuthStore } from './store/auth';
import AuthModal from './components/AuthModal';
import Chats from './components/Chats';
import AddFriend from './components/AddFriend';
import { useChatStore } from './store/chat';

function App() {
  const user = useAuthStore((state) => state.user);
  const showAddFriend = useAuthStore((state) => state.showAddFriend);
  const setUser = useAuthStore((state) => state.setUser);
  const friendsData = useAuthStore((state) => state.friendsData);

  const showModal = useAuthStore((state) => state.showModal);
  const setShowModal = useAuthStore((state) => state.setShowModal);

  const room = useChatStore((state) => state.room);
  const setRoom = useChatStore((state) => state.setRoom);
  const [messages, setMessages] = useState([]);

  const sendMessage = (message) => {
    const newMessage = {
      type: 'send',
      message: message,
      time: new Date(Date.now()),
      state: 'sent',
    };

    setMessages((prev) => [...prev, newMessage]);

    socket.emit('send', message);
  };

  useEffect(() => {
    socket.on('receive', (message) => {
      const newMessage = {
        type: 'receive',
        message: message,
        time: new Date(Date.now()),
      };

      // console.log(newMessage);
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => socket.off('receive');
  }, []);

  // useEffect(() => {
  //   if (room) socket.connect();

  //   return () => socket.disconnect();
  // }, [room]);

  // socket.on('connect', () => {
  //   console.log('connecting...');
  // });

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
            <ChatBody messages={messages} sendMessage={sendMessage} />
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
                      onClick={() => setShowModal({ for: 'login', show: true })}
                      className="bg-accentDark text-darkerBG font-semibold px-10 py-2 rounded-md hover:bg-accent transition-all"
                    >
                      Login
                    </button>
                    <button
                      onClick={() =>
                        setShowModal({ for: 'signup', show: true })
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

      {showModal.show && <AuthModal />}
    </div>
  );
}

export default App;
