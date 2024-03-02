import React, { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import { useChatStore } from '../store/chat';
import { socket } from '../socket';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebase.config';

export default function ChatBody() {
  const [file, setFile] = useState();
  const room = useChatStore((state) => state.room);
  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);

  const messagesEndRef = useRef(null);

  let date = new Date(Date.now()).toDateString();

  const sendMessage = (message, attachment) => {
    const newMessage = {
      sender: room.senderId,
      receiver: room.receiverId,
      message: message,
      attachment: attachment || null,
      sentAt: new Date(Date.now()),
    };

    setMessages(newMessage);

    socket.emit('send', newMessage);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageText = e.target.message.value.trim();

    // If there is a file attachment, upload to firebase storage and send the url in message
    if (file) {
      try {
        const roomID = [room.senderId, room.receiverId].sort().join('-');
        const storageRef = ref(storage, `${roomID}/${file.name}`);
        // Upload file and get back the URL
        const uploadFile = await uploadBytes(storageRef, file);
        const fileURL = await getDownloadURL(uploadFile.ref);

        sendMessage(messageText === '' ? ' ' : messageText, fileURL);
      } catch (err) {
        console.error('Error uploading', err);
      }
    } else if (messageText !== '') {
      sendMessage(messageText);
    } else {
      console.error('Fields empty');
    }

    e.target.message.value = '';
    setFile(null);
  };

  // Scroll to the bottom of the messages container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Remove the selected file on room change to avoid sending to wrong room
  useEffect(() => {
    setFile(null);
  }, [room]);

  // Add a listener for any received messages and update the messages
  useEffect(() => {
    socket.on('receive', (message) => {
      setMessages(message);
    });

    return () => socket.off('receive');
  }, []);

  return (
    <div className="flex flex-col justify-between w-auto h-full gap-2 overflow-hidden">
      <div
        style={{ backgroundImage: 'url(/chat-bg.svg)' }}
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

                <MessageBubble data={mes} scrollToBottom={scrollToBottom} />
              </React.Fragment>
            );
          } else {
            return (
              <MessageBubble
                key={i}
                data={mes}
                scrollToBottom={scrollToBottom}
              />
            );
          }
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className="w-full h-[10vh] min-h-20 justify-self-end border rounded-md border-darkBg p-4">
        <form className="flex items-center gap-4" onSubmit={handleSubmit}>
          <label
            htmlFor="file"
            className={`transition-all cursor-pointer hover:opacity-100 ${
              file ? 'opacity-100 cursor-auto' : 'opacity-60'
            }`}
          >
            <input
              type="file"
              name="file"
              id="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <img
              src="/attachment-icon.svg"
              alt="attachment-icon"
              className="w-8"
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
