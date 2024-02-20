import { useEffect } from 'react';
import { useAuthStore } from '../store/auth';
import ChatHead from './ChatHead';

export default function Chats() {
  const user = useAuthStore((state) => state.user);
  const friendsData = useAuthStore((state) => state.friendsData);
  const setFriendsData = useAuthStore((state) => state.setFriendsData);
  const setShowAddFriend = useAuthStore((state) => state.setShowAddFriend);

  console.log('Chats', user, friendsData);

  useEffect(() => {
    if (user) {
      const fetchFriendsData = async () => {
        const res = await fetch(`/api/user/${user._id}/friends`);
        const data = await res.json();

        setFriendsData(data);

        console.log(data);
      };

      fetchFriendsData();
    }
  }, [user, setFriendsData]);

  return (
    <div className="h-full px-5 py-10 m-2 rounded-md bg-darkBg overflow-hidden border-b-8 border-darkBg">
      <h2 className="pb-4 mb-8 text-3xl font-semibold border-b border-darkMid">
        Chats
      </h2>

      {user && (
        <div className="scrollbar-hidden overflow-scroll h-full">
          {friendsData.length > 0 ? (
            friendsData.map((friend) => (
              <ChatHead
                key={friend.userName}
                data={friend}
                // startChat={startChat}
              />
              // <p key={friend.userName}>{friend.userName}</p>
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
      )}
    </div>
  );
}
