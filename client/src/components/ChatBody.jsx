import React, { useEffect, useRef, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { socket } from '../socket';
import { storage } from '../../firebase.config';
import { useChatStore } from '../store/chat';
import { useAuthStore } from '../store/auth';
import MessageBubble from './MessageBubble';
import RoomInfo from './RoomInfo';

export default function ChatBody() {
  const [file, setFile] = useState();
  const [activityStatus, setActivityStatus] = useState();
  const user = useAuthStore((state) => state.user);
  const room = useChatStore((state) => state.room);
  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);
  const setErrorModal = useChatStore((state) => state.setErrorModal);

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

    // emit the new message to socket and on success sent add it to the messages
    socket.emit('send', newMessage, (response) => {
      if (response.sent) {
        setMessages(newMessage);
        setActivityStatus('sent');
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageText = e.target.message.value.trim();

    // If there is a file attachment, upload to firebase storage and send the url in message
    if (file) {
      try {
        const storageRef = ref(storage, `${room.roomId}/${file.name}`); // firebase storage reference
        // Upload file and get back the URL
        const uploadFile = await uploadBytes(storageRef, file);
        const fileURL = await getDownloadURL(uploadFile.ref);

        sendMessage(messageText === '' ? ' ' : messageText, fileURL);
      } catch (err) {
        setErrorModal({
          message: `Error uploading: ${err.message}`,
          show: true,
        });
      }
    } else if (messageText && messageText !== '') {
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

  useEffect(() => {
    // Remove the selected file on room change to avoid sending to wrong room
    setFile(null);

    // Fetch the last message and activity status for the current room on chat open
    socket.emit('room-activity-request', room.roomId, 'fetch', (response) => {
      if (response?.roomActivity) {
        setActivityStatus(response.roomActivity?.status);

        // if the last unread message is for the current user, set it as seen on chat open
        if (
          response.roomActivity?.lastMessage.receiver === user._id &&
          response.roomActivity?.status === 'sent'
        ) {
          socket.emit('room-activity-request', room.roomId, 'mark-seen');
        }
      }
    });
  }, [room]);

  useEffect(() => {
    // Add a listener for any received messages and update the messages
    socket.on('receive', (message) => {
      setMessages(message);

      // emit a mark-seen event to the room to notify the sender of message being received
      socket.emit('room-activity-request', room.roomId, 'mark-seen');
    });

    // check for an activity in room to check if the message sent has been seen
    socket.on('room-activity-updated', (response) => {
      if (response) {
        setActivityStatus(response.status);
      }
    });

    return () => {
      socket.off('receive');
      socket.off('room-activity-updated');
    };
  }, []);

  return (
    <div className="flex flex-col justify-between w-auto h-full gap-2 overflow-hidden">
      <RoomInfo />

      <div
        style={{ backgroundImage: 'url(/chat-bg.svg)' }}
        className="p-4 w-full h-[88vh] flex-col flex gap-2 md:gap-3 scrollbar-hidden overflow-y-scroll border rounded-md border-darkBg bg-cover bg-center"
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

                <MessageBubble
                  data={mes}
                  scrollToBottom={scrollToBottom}
                  status={messages.length === i + 1 && activityStatus}
                />
              </React.Fragment>
            );
          } else {
            return (
              <MessageBubble
                key={i}
                data={mes}
                scrollToBottom={scrollToBottom}
                status={messages.length === i + 1 && activityStatus}
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
            placeholder={
              file ? `Attachment selected: ${file.name}` : 'Type a message'
            }
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
