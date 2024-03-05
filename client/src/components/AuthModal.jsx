import { socket } from '../socket';
import { useAuthStore } from '../store/auth';
import { useChatStore } from '../store/chat';

export default function AuthModal() {
  const setUser = useAuthStore((state) => state.setUser);
  const authModal = useAuthStore((state) => state.authModal);
  const setAuthModal = useAuthStore((state) => state.setAuthModal);
  const setErrorModal = useChatStore((state) => state.setErrorModal);

  const handleSubmit = (e) => {
    e.preventDefault();

    const { firstName, lastName, userName, email, password } = e.target;

    if (authModal.for === 'login') {
      login(email, password);
    } else {
      signup(firstName, lastName, userName, email, password);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value, password: password.value }),
      });
      const data = await res.json();

      if (res.status === 200) {
        setUser(data);
        setAuthModal({ ...authModal, show: false });

        socket.auth = { userId: data._id }; // pass user id to server on socket handshake
        socket.connect();
      } else {
        console.error(data.message);
        setErrorModal({ message: data.message, show: true });
      }
    } catch (err) {
      console.error(err);
      setErrorModal({ message: err.message, show: true });
    }
  };

  const signup = async (firstName, lastName, userName, email, password) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.value,
          lastName: lastName.value,
          userName: userName.value,
          email: email.value,
          password: password.value,
        }),
      });

      const data = await res.json();

      if (res.status === 201) {
        setUser(data);
        setAuthModal({ ...authModal, show: false });
      } else {
        setErrorModal({
          message:
            'Check all the fields and ensure your have entered valid data.',
          show: true,
        });
      }
    } catch (err) {
      console.error(err);
      setErrorModal({ message: err.message, show: true });
    }
  };

  return (
    <div
      id="parent"
      onClick={(e) =>
        e.target.id === 'parent' && setAuthModal({ ...authModal, show: false })
      }
      className="cursor-pointer absolute top-0 left-0 flex items-center justify-center w-full h-full backdrop-blur-md bg-black/60 bg"
    >
      <div className="p-10 rounded-md bg-darkBg w-[480px]">
        <img
          src="/close-icon.svg"
          alt="close modal icon"
          className="w-5 mb-4 ml-auto cursor-pointer"
          onClick={() => setAuthModal({ ...authModal, show: false })}
        />

        <form onSubmit={handleSubmit} className="space-y-3">
          {authModal.for === 'signup' && (
            <>
              {' '}
              <div className="flex gap-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="firstName" className="ml-1 text-gray-200">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    className="w-full h-10 px-4 border rounded-md outline-none bg-darkerBG border-darkMid"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="lastName" className="ml-1 text-gray-200">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    className="w-full h-10 px-4 border rounded-md outline-none bg-darkerBG border-darkMid"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="userName" className="ml-1 text-gray-200">
                  User name
                </label>
                <input
                  type="text"
                  name="userName"
                  id="userName"
                  className="w-full h-10 px-4 border rounded-md outline-none bg-darkerBG border-darkMid"
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="ml-1 text-gray-200">
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              className="w-full h-10 px-4 border rounded-md outline-none bg-darkerBG border-darkMid"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="ml-1 text-gray-200">
              Password
            </label>
            <input
              type="text"
              name="password"
              id="password"
              className="w-full h-10 px-4 border rounded-md outline-none bg-darkerBG border-darkMid"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-1/2 px-10 py-2 my-2 capitalize rounded-md bg-accentDark text-darkerBG"
            >
              {authModal.for}
            </button>

            {authModal.for === 'login' && (
              <p className="text-sm text-gray-300">
                Not have an account yet?{' '}
                <span
                  className="underline cursor-pointer text-accentDark"
                  onClick={() => setAuthModal({ ...authModal, for: 'signup' })}
                >
                  Sign-up here
                </span>
              </p>
            )}

            {authModal.for === 'signup' && (
              <p className="text-sm text-gray-300">
                Already have an account?{' '}
                <span
                  className="underline cursor-pointer text-accentDark"
                  onClick={() => setAuthModal({ ...authModal, for: 'login' })}
                >
                  Login here
                </span>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
