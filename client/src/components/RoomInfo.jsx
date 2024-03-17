import { useAuthStore } from '../store/auth';
import { useChatStore } from '../store/chat';

export default function RoomInfo() {
  const room = useChatStore((state) => state.room);
  const setRoom = useChatStore((state) => state.setRoom);
  const friendsData = useAuthStore((state) => state.friendsData);

  const onlineUsers = useChatStore((state) => state.onlineUsers);

  const receiverData = friendsData?.find(
    (friend) => friend._id === room.receiverId
  );

  return (
    <div className="md:hidden flex gap-4 p-1">
      <div className="relative w-12 h-12">
        <div
          className={`w-4 h-4 border-4 border-darkerBG rounded-full absolute bottom-0 right-0 ${
            onlineUsers.includes(room.receiverId)
              ? 'bg-green-600'
              : 'bg-gray-400'
          }`}
        />

        <div className="flex items-center justify-center w-12 h-12 text-gray-400 rounded-full bg-darkBg">
          <p>
            {receiverData.firstName[0]}
            {receiverData.lastName[0]}
          </p>
        </div>
      </div>

      <div className="flex flex-col">
        <p>
          {receiverData.firstName} {receiverData.lastName}
        </p>

        <div className="flex">
          <p className="text-gray-400 text-sm">@{receiverData.userName}</p>
        </div>
      </div>

      <button
        onClick={() => setRoom(null)}
        className="flex flex-col items-center justify-center gap-1 ml-auto"
      >
        <img src="/close-icon.svg" alt="close icon" className="w-6 ml-2" />
      </button>
    </div>
  );
}
