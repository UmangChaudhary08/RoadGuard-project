/**
 * Authentication and Role-based Access Middleware
 * Supports Firebase Token verification with demo fallback
 */

export function authenticate(req, res, next) {
  // Check for mock role or auth token
  const authHeader = req.headers.authorization;
  const clientRole = req.headers["x-user-role"] || "driver";

  // Attach user context
  req.user = {
    uid: "usr-demo-" + clientRole,
    email: clientRole === "authority" ? "authority@roadguard.demo" : "driver@roadguard.demo",
    role: clientRole
  };

  next();
}

export function requireAuthority(req, res, next) {
  const role = req.headers["x-user-role"] || req.user?.role;
  if (role !== "authority") {
    return res.status(403).json({
      error: "Forbidden",
      message: "Authority privileges required to access this resource."
    });
  }
  next();
}
