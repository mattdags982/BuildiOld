const User = require("./../model/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    const { uid } = req.session;
    const user = await User.findOne({ _id: uid });
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (e) {
    res.sendStatus(404);
  }
};

module.exports = authMiddleware;
