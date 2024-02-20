import { useAuthStore } from '../store/auth';

export default function AddFriend() {
  const user = useAuthStore((state) => state.user);
  const friendsData = useAuthStore((state) => state.friendsData);
  const setFriendsData = useAuthStore((state) => state.setFriendsData);
  const setShowAddFriend = useAuthStore((state) => state.setShowAddFriend);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const friendUsername = e.target.friendUsername.value;

    try {
      const res = await fetch(`api/user/${user._id}/friends/add`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendUsername }),
      });
      const data = await res.json();

      // console.log('res', res);
      // console.log(data);
      if (res.status === 200) {
        const updateFriendsData = [data, ...friendsData];
        setFriendsData(updateFriendsData);
        setShowAddFriend(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="px-5 py-5 m-2 rounded-md bg-darkBg">
      <img
        src="/close-icon.svg"
        alt="close modal icon"
        className="w-4 mb-0 ml-auto cursor-pointer"
        onClick={() => setShowAddFriend(false)}
      />

      <form onSubmit={handleSubmit} className="space-y-3 flex gap-2 items-end">
        <div className="flex flex-col gap-1">
          <label htmlFor="friendUsername" className="ml-1 text-gray-200">
            Friends User name
          </label>
          <input
            type="text"
            name="friendUsername"
            id="friendUsername"
            className="w-full h-10 px-4 border rounded-md outline-none bg-darkerBG border-darkMid"
          />
        </div>

        <button
          type="submit"
          className="text-2xl h-10 px-4 py-1 font-bold my-2 capitalize rounded-md bg-accentDark hover:bg-accent text-darkerBG"
        >
          +
        </button>
      </form>
    </div>
  );
}
