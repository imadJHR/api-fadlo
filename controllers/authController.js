export const loginWithCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || code.length !== 6) {
      return res
        .status(400)
        .json({ success: false, message: "Code invalide" });
    }

    const VALID_CODE = process.env.LOGIN_CODE;

    if (code !== VALID_CODE) {
      return res
        .status(401)
        .json({ success: false, message: "Code incorrect" });
    }

    return res.status(200).json({
      success: true,
      message: "Connexion réussie",
      token: process.env.ACCESS_TOKEN,
    });

  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Erreur serveur" });
  }
};
