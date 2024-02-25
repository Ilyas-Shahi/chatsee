import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import MessageBubble from './MessageBubble';
import { useChatStore } from '../store/chat';
import { socket } from '../socket';

export default function ChatBody() {
  const room = useChatStore((state) => state.room);
  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);
  // const [messages, setMessages] = useState([]);

  const sendMessage = (message) => {
    const newMessage = {
      sender: room.sender,
      receiver: room.receiver,
      message: message,
      sentAt: new Date(Date.now()),
    };

    setMessages(newMessage);
    console.log('sent message', newMessage);

    socket.emit('send', newMessage);
  };

  useEffect(() => {
    socket.on('receive', (message) => {
      console.log('received message', message);
      setMessages(message);
    });

    return () => socket.off('receive');
  }, []);

  const messagesContainerRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageText = e.target.message.value.trim();

    if (messageText !== '') sendMessage(messageText);

    e.target.message.value = '';
  };

  useEffect(() => {
    console.log('all messages', messages);
    messagesContainerRef.current.scrollTop =
      messagesContainerRef.current.scrollHeight -
      messagesContainerRef.current.clientHeight;
  }, [messages]);

  return (
    <div className="flex flex-col justify-between w-auto h-full gap-2 overflow-hidden">
      <div
        style={{ backgroundImage: 'url(/chat-bg.svg)' }}
        ref={messagesContainerRef}
        className="p-4 w-full h-[88vh] flex-col flex gap-3 scrollbar-hidden overflow-y-scroll border rounded-md border-darkBg bg-cover bg-center"
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

ChatBody.propTypes = {
  // messages: PropTypes.array,
  // sendMessage: PropTypes.func,
};
