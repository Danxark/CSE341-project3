/**
 * middleware/auth.js
 * Placeholder for OAuth authentication.
 * Later you can integrate GitHub OAuth with Passport or other methods.
 */

module.exports = (req, res, next) => {
  // TEMPORARY: log that auth middleware is running
  console.log('✅ Auth middleware called - user is allowed (placeholder)');

  // Example: you can check for a token in headers (replace with real OAuth later)
  // const authHeader = req.headers.authorization;
  // if (!authHeader) {
  //   return res.status(401).json({ message: 'Unauthorized - no token' });
  // }

  // For now, allow all requests to pass
  next();
};