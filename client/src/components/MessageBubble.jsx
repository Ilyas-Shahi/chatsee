import PropTypes from 'prop-types';
import { useAuthStore } from '../store/auth';

export default function MessageBubble({ data, scrollToBottom }) {
  const user = useAuthStore((state) => state.user);

  const sendType = user._id === data.sender;

  return (
    <div
      className={`flex gap-4 max-w-[80%] ${
        sendType && 'self-end flex-row-reverse'
      }`}
    >
      <div
        className={`px-4 py-2 rounded-xl w-max sm:max-w-sm md:max-w-md xl:max-w-xl ${
          sendType
            ? 'bg-darkBg rounded-br-none'
            : 'bg-accentDark text-darkerBG rounded-bl-none font-semibold'
        }`}
      >
        {data.attachment && (
          <img
            src={data.attachment}
            alt="attachment"
            className="mx-auto my-2 rounded-md cursor-pointer w-60 max-h-96"
            onLoad={() => scrollToBottom()}
            onClick={() => window.open(data.attachment, '_blank')}
          />
        )}

        <span>{data.message}</span>
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
  scrollToBottom: PropTypes.func,
};
