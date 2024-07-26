import { socket } from '../socket';
import { useAuthStore } from '../store/auth';
import { useChatStore } from '../store/chat';

const apiUrl = import.meta.env.PROD
  ? import.meta.env.VITE_SERVER_ORIGIN
  : '/api';

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
      const res = await fetch(`${apiUrl}/auth/login`, {
        credentials: 'include',
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
      const res = await fetch(`${apiUrl}/auth/signup`, {
        credentials: 'include',
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
      } else if (data.keyPattern) {
        setErrorModal({
          message: `Check or change: ${Object.keys(data.keyPattern)}`,
          show: true,
        });
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
      className="p-2 cursor-pointer absolute top-0 left-0 flex items-center justify-center w-full h-full backdrop-blur-md bg-black/60"
    >
      <div className="p-10 rounded-md bg-darkBg w-[480px]">
        <img
          src="/close-icon.svg"
          alt="close modal icon"
          className="w-5 mb-4 ml-auto cursor-pointer"
          onClick={() => setAuthModal({ ...authModal, show: false })}
        />

        <form onSubmit={handleSubmit} className="space-y-3">
          {authModal.for === 'sign-up' && (
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
                    min={1}
                    required
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
                    min={1}
                    required
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
                  required
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
              required
              className="w-full h-10 px-4 border rounded-md outline-none bg-darkerBG border-darkMid"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="ml-1 text-gray-200">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
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

            <p className="text-sm text-gray-300 mt-1">
              {authModal.for === 'login'
                ? 'Do not have an account yet? '
                : 'Already have an account? '}
              <span
                className="underline cursor-pointer text-accentDark"
                onClick={() =>
                  setAuthModal({
                    ...authModal,
                    for: authModal.for === 'login' ? 'sign-up' : 'login',
                  })
                }
              >
                {authModal.for === 'login' ? 'Sign-up' : 'Login'} here
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
