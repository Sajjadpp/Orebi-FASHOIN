const jwt = require('jsonwebtoken')

const isAuth = (req, res, next) => {
    console.log('eotrking')
    const token = req.headers['authorization']?.split(' ')[1];
    console.log(token)
    if (!token) {
      return res.status(403).json({ message: 'Token missing or invalid' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token invalid or expired' });
      }
      console.log(user)
      req.user = user; // Attach user information to the request
      next();
    });
};


module.exports = {
    isAuth
}