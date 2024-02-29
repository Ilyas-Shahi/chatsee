import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ error: 'Not Authorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ error: `Forbidden: ${err.message}` });

    req.user = user;
    next();
  });
};

// Verify user through web socket connection
export const verifySocketToken = (socket) => {
  let user;

  // Get the cookies from socket headers and convert to object
  const cookies = socket.handshake.headers.cookie
    ? Object.fromEntries(
        socket.handshake.headers.cookie
          .split(';')
          .map((c) => c.trim().split('='))
      )
    : {};

  if (cookies?.access_token) {
    jwt.verify(
      cookies.access_token,
      process.env.JWT_SECRET,
      (err, decodedUser) => {
        if (err) return new Error(err);

        user = decodedUser;
      }
    );
  }

  return user;
};
