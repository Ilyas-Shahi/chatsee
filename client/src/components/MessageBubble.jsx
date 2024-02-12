import PropTypes from 'prop-types';

export default function MessageBubble({ data }) {
  return (
    <div
      className={`flex gap-4 max-w-[50%] ${
        data.type === 'send' && 'self-end flex-row-reverse'
      }`}
    >
      <div
        className={`px-4 py-2 rounded-xl w-max ${
          data.type === 'send'
            ? 'bg-darkBg rounded-br-none'
            : 'bg-accentDark text-darkerBG rounded-bl-none'
        }`}
      >
        {data.message}
      </div>
      <div
        className={`flex flex-col justify-center gap-1 w-full max-w-max text-xs font-light text-gray-500 ${
          data.type === 'send' && 'items-end'
        }`}
      >
        <p>
          {data.time.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
          })}
        </p>

        {data.type === 'send' && <p>{data.state}</p>}
      </div>
    </div>
  );
}

MessageBubble.propTypes = {
  data: PropTypes.object,
};
