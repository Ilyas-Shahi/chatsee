import ChatBody from './components/ChatBody';
import ChatHead from './components/ChatHead';
import { useEffect, useState } from 'react';
import { socket } from './socket';

function App() {
  const [messages, setMessages] = useState([]);

  console.log('App.js ran');
  console.log(messages);
  console.log(messages.length);

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
      console.log('received message');
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

  // socket.on('connect', () => {
  //   console.log('connecting...');
  // });

  return (
    <div className="w-full h-screen bg-darkerBG text-gray-50">
      <div className="flex h-full">
        <div className="m-2 rounded-md w-[300px] bg-darkBg px-5 py-10">
          <h2 className="pb-4 mb-8 text-3xl font-semibold border-b border-darkMid">
            Chats
          </h2>

          <ChatHead />
        </div>

        <div className="m-2 w-full">
          <ChatBody messages={messages} sendMessage={sendMessage} />
        </div>
      </div>
    </div>
  );
}

export default App;
