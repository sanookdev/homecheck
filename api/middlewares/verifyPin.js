const verifyPin = (req, res, next) => {
  // PIN can come from header, query, or body (for FormData, multer parses it into req.body)
  const pin = req.headers['x-app-pin'] || req.query.pin || req.body?.pin;

  if (!pin) {
    return res.status(401).json({ error: 'PIN is required' });
  }

  if (String(pin) !== String(process.env.APP_PIN)) {
    return res.status(403).json({ error: 'Invalid PIN' });
  }

  next();
};

export default verifyPin;
