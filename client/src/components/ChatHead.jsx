import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { useChatStore } from '../store/chat';
import { useAuthStore } from '../store/auth';

export default function ChatHead({ data }) {
  const [online, setOnline] = useState(false);

  const user = useAuthStore((state) => state.user);
  const room = useChatStore((state) => state.room);
  const setRoom = useChatStore((state) => state.setRoom);

  const startChat = () => {
    const uidRoom = [user.userName, data.userName].sort().join('-');
    console.log(uidRoom);

    setRoom(uidRoom);
    // setMessages([]);

    socket.emit('start-chat', uidRoom);
  };

  useEffect(() => {
    socket.on('connect', () => setOnline(true));

    return () => socket.on('disconnect', () => setOnline(false));
  }, []);

  return (
    <div
      className="flex gap-4 border-b last-of-type:border-none border-darkerBG pb-3 mb-3 cursor-pointer"
      onClick={startChat}
    >
      <div className="relative w-12 h-12">
        <div
          className={`w-2 h-2 rounded-full absolute bottom-1 right-1 ${
            online ? 'bg-green-600' : 'bg-gray-400'
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
        <p>
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
  // startChat: PropTypes.func,
};
