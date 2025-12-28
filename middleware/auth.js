export const protegerRoute = (req, res, next) => {
  // ✅ Laisser passer le preflight CORS
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  const authHeader = req.headers.authorization || "";
  if (!authHeader) {
    return res.status(403).json({
      success: false,
      message: "Accès refusé : aucun token fourni.",
    });
  }

  // ✅ Accepte "Bearer <token>" ou "<token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  if (token !== process.env.ACCESS_TOKEN) {
    return res.status(401).json({
      success: false,
      message: "Token invalide ou expiré.",
    });
  }
  next();
};