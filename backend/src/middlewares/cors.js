const allowedCors = [
  'https://mesto-new.nomoredomains.club',
  'http://mesto-new.nomoredomains.club',
  'http://localhost:3000',
  'http://localhost:3001',
];

// eslint-disable-next-line no-unused-vars
module.exports = function (req, res, next) {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.status(200).send('ok');
    return;
  }
  next();
};
