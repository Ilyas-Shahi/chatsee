import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { socket } from '../socket';
import { useChatStore } from '../store/chat';
import { useAuthStore } from '../store/auth';

export default function ChatHead({ data }) {
  const [notification, setNotification] = useState(false);
  const user = useAuthStore((state) => state.user);
  const onlineUsers = useChatStore((state) => state.onlineUsers);
  const room = useChatStore((state) => state.room);
  const setRoom = useChatStore((state) => state.setRoom);
  const setMessagesFromDB = useChatStore((state) => state.setMessagesFromDB);
  const setLoading = useChatStore((state) => state.setLoading);

  const roomId = [user._id, data._id].sort().join('-');

  const startChat = async () => {
    setNotification(false); // remove notification in any
    // start a chat if not already in the chat room
    if (room?.receiverId !== data._id) {
      const roomData = { roomId, senderId: user._id, receiverId: data._id };

      setRoom(roomData);

      socket.emit('start-chat', roomData, (response) => {
        // getting the prev chats for this room in response from server
        setMessagesFromDB(response?.prevChats ? response.prevChats : []);

        // set the loading false after receiving messages based on messages length
        if (response) {
          setTimeout(() => {
            setLoading(false);
          }, response.prevChats?.length * 5 || 500);
        }
      });
    }
  };

  // If not already in the room, check for any activity on user/chat and show notification
  useEffect(() => {
    setLoading(true);

    socket.on(`${roomId}-activity`, () => {
      if (room?.roomId !== roomId) {
        setNotification(true);
      }
    });

    return () => socket.off(`${roomId}-activity`);
  }, [room, roomId]);

  useEffect(() => {
    socket.emit('room-activity-request', roomId, 'fetch', (response) => {
      const activity = response?.roomActivity;

      if (
        activity &&
        activity.lastMessage.receiver === user._id &&
        activity.status === 'sent'
      ) {
        setNotification(true);
      }
    });
  }, [roomId, user]);

  return (
    <div
      className="flex gap-4 border-b last-of-type:border-none border-darkerBG pb-3 mb-3 cursor-pointer"
      onClick={startChat}
    >
      <div className="relative w-12 h-12">
        <div
          className={`w-2 h-2 rounded-full absolute bottom-1 right-1 ${
            onlineUsers.includes(data._id) ? 'bg-green-600' : 'bg-gray-400'
          }`}
        />

        {notification && (
          <div className="w-2 h-2 rounded-full absolute top-1 left-1 bg-accent flex justify-center items-center" />
        )}

        <div className="flex items-center justify-center w-12 h-12 text-gray-400 rounded-full bg-darkerBG">
          <p>
            {data.firstName[0]}
            {data.lastName[0]}
          </p>
        </div>
      </div>

      <div className="flex flex-col">
        <p
          className={`${
            room?.receiverId === data._id && 'text-accent/90 font-bold'
          }`}
        >
          {data.firstName} {data.lastName}
        </p>

        <div className="flex">
          <p className="text-gray-400 text-sm">@{data.userName}</p>
        </div>
      </div>
    </div>
  );
}

ChatHead.propTypes = {
  data: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    userName: PropTypes.string,
    _id: PropTypes.string,
  }),
};
