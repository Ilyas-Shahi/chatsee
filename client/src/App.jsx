import ChatBody from './components/ChatBody';
import ChatHead from './components/ChatHead';

function App() {
  return (
    <div className="w-full h-screen bg-darkerBG text-gray-50">
      <div className="flex h-full">
        <div className="m-2 rounded-md w-[300px] bg-darkBg px-5 py-10">
          <h2 className="pb-4 mb-8 text-3xl font-semibold border-b border-darkMid">
            Chats
          </h2>

          <ChatHead />
        </div>

        <div className="m-2 w-full">
          <ChatBody />
        </div>
      </div>
    </div>
  );
}

export default App;
