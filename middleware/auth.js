export const protegerRoute = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: "Accès refusé : aucun token fourni.",
    });
  }

  // Ici tu peux comparer avec un token plus sécurisé ou un JWT.
  // Pour ton cas simple : token stocké dans le frontend
  if (token !== process.env.ACCESS_TOKEN) {
    return res.status(401).json({
      success: false,
      message: "Token invalide ou expiré.",
    });
  }

  next();
};
