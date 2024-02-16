import ChatBody from './components/ChatBody';
import ChatHead from './components/ChatHead';
import { useEffect, useState } from 'react';
import { socket } from './socket';
import User from './components/User';

const dummyUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe23',
    email: 'john@example.com',
  },
  {
    firstName: 'Jane',
    lastName: 'Doe',
    username: 'jandeo495',
    email: 'jane@example.com',
  },
  {
    firstName: 'Mark',
    lastName: 'Jackson',
    username: 'mark98',
    email: 'mark@example.com',
  },
];

function App() {
  const [user, setUser] = useState({
    firstName: 'Mark',
    lastName: 'Jackson',
    username: 'mark98',
    email: 'mark@example.com',
    friends: dummyUsers,
  });
  const [room, setRoom] = useState();
  const [messages, setMessages] = useState([]);

  const startChat = (room) => {
    const uidRoom = prompt('enter room');
    console.log(uidRoom);

    setRoom(uidRoom);
    setMessages([]);

    socket.emit('start-chat', uidRoom);
  };

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
          <div className="px-5 py-5 m-2 rounded-md bg-darkBg">
            <User data={user} />
          </div>

          <div className="h-full px-5 py-10 m-2 rounded-md bg-darkBg overflow-hidden border-b-8 border-darkBg">
            <h2 className="pb-4 mb-8 text-3xl font-semibold border-b border-darkMid">
              Chats
            </h2>

            {user && (
              <div className="scrollbar-hidden overflow-scroll h-full">
                {user.friends ? (
                  user.friends.map((user) => (
                    <ChatHead
                      key={user.username}
                      data={user}
                      startChat={startChat}
                    />
                  ))
                ) : (
                  <div className="flex flex-col gap-2 items-center">
                    <p className="text-lg">No friends yet</p>
                    <button className="flex justify-center items-center gap-1 bg-darkerBG px-6 py-2 rounded-md">
                      <p className="text-sm text-gray-100">Add friend</p>

                      <img
                        src="../../public/add-user-icon.svg"
                        alt="add use icon"
                        className="w-6 ml-2"
                      />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
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
                    <button className="bg-accentDark text-darkerBG font-semibold px-10 py-2 rounded-md hover:bg-accent transition-all">
                      Login
                    </button>
                    <button className="bg-accentDark text-darkerBG font-semibold px-10 py-2 rounded-md hover:bg-accent transition-all">
                      Sign up
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
