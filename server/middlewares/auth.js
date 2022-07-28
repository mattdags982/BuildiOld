const User = require("./../model/user.model");

const authMiddleware = async (req, res, next) => {
  // console.log(req.session.uid);
  try {
    const { uid } = req.session;
    console.log(uid);
    const user = await User.findOne({ _id: uid });
    console.log("user", user);
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (e) {
    res.sendStatus(404);
  }
};

module.exports = authMiddleware;
