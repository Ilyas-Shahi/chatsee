import { useChatStore } from '../store/chat';

export default function ErrorModal() {
  const errorModal = useChatStore((state) => state.errorModal);
  const setErrorModal = useChatStore((state) => state.setErrorModal);

  return (
    <div
      id="parent"
      onClick={(e) =>
        e.target.id === 'parent' &&
        setErrorModal({ ...errorModal, show: false })
      }
      className="absolute top-0 left-0 flex items-center justify-center w-full h-full cursor-pointer backdrop-blur-md bg-black/60 bg"
    >
      <div className="p-10 rounded-md bg-darkBg w-[480px]">
        <img
          src="/close-icon.svg"
          alt="close modal icon"
          className="w-5 mb-4 ml-auto cursor-pointer"
          onClick={() => setErrorModal({ ...errorModal, show: false })}
        />

        <p className="text-xl text-red-800">Error: {errorModal.message}</p>
      </div>
    </div>
  );
}
