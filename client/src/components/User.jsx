import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { socket } from '../socket';

export default function User({ data }) {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    socket.on('connect', () => setOnline(true));

    return () => socket.on('disconnect', () => setOnline(false));
  }, []);

  return (
    <div className="flex gap-4">
      <div className="relative w-12 h-12">
        <div
          className={`w-2 h-2 rounded-full absolute bottom-1 right-1 ${
            online ? 'bg-green-600' : 'bg-gray-400'
          }`}
        />

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
          <p className="text-green-100">(you)</p>
        </div>
      </div>

      <button className="flex flex-col justify-center items-center ml-auto gap-1">
        <img
          src="../../public/add-user-icon.svg"
          alt="add use icon"
          className="w-6 ml-2"
        />
        <p className="text-xs text-gray-100">Add friend</p>
      </button>
    </div>
  );
}

User.propTypes = {
  data: PropTypes.object,
};
