import { useEffect } from 'react';
import { useAuthStore } from '../store/auth';
import ChatHead from './ChatHead';
import { socket } from '../socket';
import { useChatStore } from '../store/chat';

const apiUrl = import.meta.env.SERVER_ORIGIN || '/api';

export default function Chats() {
  const user = useAuthStore((state) => state.user);
  const room = useChatStore((state) => state.room);
  const friendsData = useAuthStore((state) => state.friendsData);
  const setFriendsData = useAuthStore((state) => state.setFriendsData);
  const setShowAddFriend = useAuthStore((state) => state.setShowAddFriend);
  const setErrorModal = useChatStore((state) => state.setErrorModal);

  const fetchFriendsData = async () => {
    if (user) {
      try {
        const res = await fetch(`${apiUrl}/user/${user._id}/friends`);
        const data = await res.json();

        if (res.status === 200) setFriendsData(data);
      } catch (err) {
        console.error(err);
        setErrorModal({ message: err.message, show: true });
      }
    }
  };

  // update friends if another add this user as a friend
  socket.on('update-friends', () => {
    fetchFriendsData();
  });

  // fetch friends on user login
  useEffect(() => {
    if (user) {
      fetchFriendsData();
    }
  }, [user]);

  return (
    <div
      className={`h-full px-5 py-10 m-2 rounded-md bg-darkBg overflow-hidden border-b-8 border-darkBg md:block ${
        room ? 'hidden' : 'block'
      }`}
    >
      <h2 className="pb-4 mb-8 text-2xl tracking-wide border-b border-darkMid">
        Chats
      </h2>

      {user ? (
        <div className="scrollbar-hidden overflow-scroll h-full">
          {friendsData.length > 0 ? (
            friendsData.map((friend) => (
              <ChatHead key={friend.userName} data={friend} />
            ))
          ) : (
            <div className="flex flex-col gap-2 items-center">
              <p className="text-lg">No friends yet</p>
              <button
                onClick={() => setShowAddFriend(true)}
                className="flex justify-center items-center gap-1 bg-darkerBG px-6 py-2 rounded-md"
              >
                <p className="text-sm text-gray-100">Add friend</p>

                <img
                  src="/add-user-icon.svg"
                  alt="add use icon"
                  className="w-6 ml-2"
                />
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>Login to access chats.</p>
      )}
    </div>
  );
}
