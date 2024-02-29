import PropTypes from 'prop-types';
import { socket } from '../socket';
import { useChatStore } from '../store/chat';
import { useAuthStore } from '../store/auth';

export default function ChatHead({ data }) {
  const user = useAuthStore((state) => state.user);
  const onlineUsers = useChatStore((state) => state.onlineUsers);
  const room = useChatStore((state) => state.room);
  const setRoom = useChatStore((state) => state.setRoom);
  const setMessagesFromDB = useChatStore((state) => state.setMessagesFromDB);

  const startChat = async () => {
    // start a chat if not already in the chat room
    if (room?.receiverId !== data._id) {
      const roomData = { senderId: user._id, receiverId: data._id };

      setRoom(roomData);

      socket.emit('start-chat', roomData, (response) => {
        // getting the prev chats for this room in response from server
        setMessagesFromDB(
          response?.prevChats ? response.prevChats.messages : []
        );
      });
    }
  };

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
        ></div>

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
