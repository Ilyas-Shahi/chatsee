import PropTypes from 'prop-types';
import { useAuthStore } from '../store/auth';

export default function MessageBubble({ data }) {
  const user = useAuthStore((state) => state.user);

  const sendType = user._id === data.sender;

  return (
    <div
      className={`flex gap-4 max-w-[80%] ${
        sendType && 'self-end flex-row-reverse'
      }`}
    >
      <div
        className={`px-4 py-2 rounded-xl w-max ${
          sendType
            ? 'bg-darkBg rounded-br-none'
            : 'bg-accentDark text-darkerBG rounded-bl-none font-semibold'
        }`}
      >
        {data.message}
      </div>
      <div
        className={`flex flex-col justify-center gap-1 w-full max-w-max text-xs font-light text-gray-600 ${
          sendType && 'items-end'
        }`}
      >
        <p>
          {new Date(data.sentAt).toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
          })}
        </p>

        {/* {sendType && <p>{data.state}</p>} */}
      </div>
    </div>
  );
}

MessageBubble.propTypes = {
  data: PropTypes.object,
};
