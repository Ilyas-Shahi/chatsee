import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { useChatStore } from '../store/chat';
import { socket } from '../socket';

export default function ChatBody() {
  const room = useChatStore((state) => state.room);
  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);

  let date = new Date(Date.now()).toDateString();

  const sendMessage = (message) => {
    const newMessage = {
      sender: room.senderId,
      receiver: room.receiverId,
      message: message,
      sentAt: new Date(Date.now()),
    };

    setMessages(newMessage);

    socket.emit('send', newMessage);
  };

  const messagesContainerRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageText = e.target.message.value.trim();

    console.log(e.target.file.value === '');

    if (messageText !== '') sendMessage(messageText);

    e.target.message.value = '';
  };

  useEffect(() => {
    socket.on('receive', (message) => {
      setMessages(message);
    });

    return () => socket.off('receive');
  }, []);

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
        className="p-4 w-full h-[88vh] flex-col flex gap-3 scrollbar-hidden overflow-y-scroll border rounded-md border-darkBg bg-cover bg-center"
      >
        {/* loop over all messages */}
        {messages.map((mes, i) => {
          const messageDate = new Date(mes.sentAt).toDateString();

          // show the date if changes between messages and the message
          // else show the message
          if (messageDate !== date) {
            date = messageDate;

            return (
              <React.Fragment key={i}>
                <div className="flex items-center gap-2 my-2">
                  <div className="w-full h-px bg-darkMid/30" />
                  <p className="text-sm text-darkMid min-w-max">
                    {date === new Date(Date.now()).toDateString()
                      ? 'Today'
                      : date}
                  </p>
                  <div className="w-full h-px bg-darkMid/30" />
                </div>

                <MessageBubble data={mes} />
              </React.Fragment>
            );
          } else {
            return <MessageBubble key={i} data={mes} />;
          }
        })}
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
