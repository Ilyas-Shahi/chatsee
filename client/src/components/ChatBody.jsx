import { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';

const dummyMessages = [
  {
    type: 'send',
    message: 'Lorem ipsum dolor sit amet',
    time: new Date(Date.now() + 5 * 60000), // Current time + 5 minutes
    state: 'seen',
  },
  {
    type: 'receive',
    message: 'Lorem ipsum dolor sit amet',
    time: new Date(Date.now() + 10 * 60000), // Current time + 10 minutes
  },
  {
    type: 'send',
    message: 'Consectetur adipiscing elit',
    time: new Date(Date.now() + 15 * 60000), // Current time + 15 minutes
    state: 'seen',
  },
  {
    type: 'receive',
    message: 'Consectetur adipiscing elit',
    time: new Date(Date.now() + 20 * 60000), // Current time + 20 minutes
  },
  {
    type: 'send',
    message: 'Sed do eiusmod tempor incididunt',
    time: new Date(Date.now() + 25 * 60000), // Current time + 25 minutes
    state: 'seen',
  },
  {
    type: 'receive',
    message: 'Sed do eiusmod tempor incididunt',
    time: new Date(Date.now() + 30 * 60000), // Current time + 30 minutes
  },
  {
    type: 'send',
    message: 'Labore et dolore magna aliqua',
    time: new Date(Date.now() + 35 * 60000), // Current time + 35 minutes
    state: 'seen',
  },
  {
    type: 'receive',
    message: 'Labore et dolore magna aliqua',
    time: new Date(Date.now() + 40 * 60000), // Current time + 40 minutes
  },
  {
    type: 'send',
    message: 'Ut enim ad minim veniam',
    time: new Date(Date.now() + 45 * 60000), // Current time + 45 minutes
    state: 'seen',
  },
  {
    type: 'receive',
    message: 'Ut enim ad minim veniam',
    time: new Date(Date.now() + 50 * 60000), // Current time + 50 minutes
  },
  {
    type: 'send',
    message: 'Quis nostrud exercitation ullamco laboris nisi',
    time: new Date(Date.now() + 55 * 60000), // Current time + 55 minutes
    state: 'seen',
  },
  {
    type: 'receive',
    message: 'Quis nostrud exercitation ullamco laboris nisi',
    time: new Date(Date.now() + 60 * 60000), // Current time + 60 minutes
  },
  {
    type: 'send',
    message: 'ullamco laboris nisi',
    time: new Date(Date.now() + 61 * 60000), // Current time + 60 minutes
    state: 'seen',
  },
  {
    type: 'send',
    message: 'Duis aute irure dolor in reprehenderit',
    time: new Date(Date.now() + 65 * 60000), // Current time + 65 minutes
    state: 'seen',
  },
  {
    type: 'receive',
    message: 'Duis aute irure dolor in reprehenderit',
    time: new Date(Date.now() + 70 * 60000), // Current time + 70 minutes
  },
  {
    type: 'send',
    message: 'In voluptate velit esse cillum dolore',
    time: new Date(Date.now() + 75 * 60000), // Current time + 75 minutes
    state: 'seen',
  },
  {
    type: 'receive',
    message: 'In voluptate velit esse cillum dolore',
    time: new Date(Date.now() + 80 * 60000), // Current time + 80 minutes
  },
];

export default function ChatBody() {
  const [messages, setMessages] = useState(dummyMessages);
  const messagesContainerRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMessage = {
      type: 'send',
      message: e.target.message.value,
      time: new Date(Date.now()),
      state: 'sent',
    };

    setMessages((prev) => [...prev, newMessage]);

    e.target.message.value = '';
  };

  useEffect(() => {
    messagesContainerRef.current.scrollTop =
      messagesContainerRef.current.scrollHeight -
      messagesContainerRef.current.clientHeight;
  }, [messages]);

  return (
    <div className="flex flex-col justify-between w-auto h-full gap-2 overflow-hidden">
      <div
        style={{ backgroundImage: 'url(/chat-bg.svg)' }}
        ref={messagesContainerRef}
        className="p-4 h-[88vh] flex-col flex gap-3 scrollbar-hidden overflow-y-scroll border rounded-md border-darkBg bg-cover bg-center"
      >
        {messages.map((mes, i) => (
          <MessageBubble key={i} data={mes} />
        ))}
      </div>

      <div className="w-full h-[10vh] min-h-20 justify-self-end border rounded-md border-darkBg p-4">
        <form className="flex items-center gap-4" onSubmit={handleSubmit}>
          <label
            htmlFor="file"
            className="transition-all cursor-pointer opacity-70 hover:opacity-100"
          >
            <input type="file" name="file" id="file" className="hidden" />
            <img
              src="/attachment-icon.svg"
              alt="attachment-icon"
              className="w-7"
            />
          </label>

          <input
            type="text"
            name="message"
            id="message"
            placeholder="Type a message"
            className="w-full h-12 p-4 break-words rounded-lg appearance-none bg-darkBg focus:outline-none"
          />

          <button type="submit" className="pr-2">
            <img src="/send-icon.svg" alt="attachment-icon" className="w-8" />
          </button>
        </form>
      </div>
    </div>
  );
}
