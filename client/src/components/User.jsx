import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { useAuthStore } from '../store/auth';

export default function User() {
  const user = useAuthStore((state) => state.user);
  const showModal = useAuthStore((state) => state.showModal);
  const setShowModal = useAuthStore((state) => state.setShowModal);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    socket.on('connect', () => setOnline(true));

    return () => socket.on('disconnect', () => setOnline(false));
  }, []);

  return (
    <>
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

          <button className="flex flex-col justify-center items-center ml-auto gap-1">
            <img
              src="/add-user-icon.svg"
              alt="add use icon"
              className="w-6 ml-2"
            />
            <p className="text-xs text-gray-100">Add friend</p>
          </button>
        </div>
      ) : (
        <div className="flex gap-4 justify-between">
          <button className="w-full bg-darkerBG font-semibold px-6 py-2 rounded-md hover:bg-accent transition-all">
            Login
          </button>
          <button className="w-full bg-darkerBG font-semibold px-6 py-2 rounded-md hover:bg-accent transition-all">
            Sign up
          </button>
        </div>
      )}
    </>
  );
}

// User.propTypes = {
//   data: PropTypes.object,
// };
