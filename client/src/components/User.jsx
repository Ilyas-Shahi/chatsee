import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { useAuthStore } from '../store/auth';

export default function User() {
  const user = useAuthStore((state) => state.user);
  const setShowModal = useAuthStore((state) => state.setShowModal);
  const setShowAddFriend = useAuthStore((state) => state.setShowAddFriend);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    socket.on('connect', () => setOnline(true));

    return () => socket.on('disconnect', () => setOnline(false));
  }, []);

  return (
    <div className="px-5 py-5 m-2 rounded-md bg-darkBg">
      {user ? (
        <div className="flex gap-4">
          <div className="relative w-12 h-12">
            <div
              className={`w-4 h-4 border-4 border-darkBg rounded-full absolute bottom-0 right-0 ${
                online ? 'bg-green-600' : 'bg-gray-400'
              }`}
            />

            <div className="flex items-center justify-center w-12 h-12 text-gray-400 rounded-full bg-darkerBG">
              <p>
                {user.firstName[0]}
                {user.lastName[0]}
              </p>
            </div>
          </div>

          <div className="flex flex-col">
            <p>
              {user.firstName} {user.lastName}
            </p>

            <div className="flex">
              <p className="text-gray-400">@{user.userName} (you)</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddFriend(true)}
            className="flex flex-col items-center justify-center gap-1 ml-auto"
          >
            <img
              src="/add-user-icon.svg"
              alt="add use icon"
              className="w-6 ml-2"
            />
            <p className="text-xs text-gray-100">Add friend</p>
          </button>
        </div>
      ) : (
        <div className="flex justify-between gap-4">
          <button
            onClick={() => setShowModal({ for: 'login', show: true })}
            className="w-full px-6 py-2 font-semibold transition-all rounded-md bg-darkerBG hover:bg-accent hover:text-darkerBG"
          >
            Login
          </button>
          <button
            onClick={() => setShowModal({ for: 'signup', show: true })}
            className="w-full px-6 py-2 font-semibold transition-all rounded-md bg-darkerBG hover:bg-accent hover:text-darkerBG"
          >
            Sign up
          </button>
        </div>
      )}
    </div>
  );
}

// User.propTypes = {
//   data: PropTypes.object,
// };
