const { User } = require("../models");
const { signToken } = require("../utils/auth");

module.exports = {
  // get user by id/username
  async getUser({ user = null, params }, res) {
    const foundUser = await User.findOne({
      $or: [
        { _id: user ? user._id : params.id },
        { username: params.username },
      ],
    });

    if (!foundUser) {
      return res.status(400).json({ message: "User not found" });
    }

    res.json(foundUser);
  },

  // add user/sign token/send token
  async addUser({ body }, res) {
    const user = await User.create(body);
    if (!user) {
      return res
        .status(400)
        .json({ message: `Oops...that didn't go as planned.` });
    }
    const token = signToken(user);
    res.json({ token, user });
  },

  // login user/sign token/send token
  async login({ body }, res) {
    const user = await User.findOne({
      $or: [{ username: body.username }, { email: body.email }],
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const correctPw = await user.isCorrectPassword(body.password);
    if (!correctPw) {
      return res.status(400).json({ message: "Incorrect credentials" });
    }
    const token = signToken(user);
    res.json({ token, user });
  },

  // save book to user
  async saveBook({ user, body }, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedBooks: body } },
        { new: true, runValidators: true }
      );
      return res.json(updatedUser);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },

  // remove book from user
  async deleteBook({ user, params }, res) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { savedBooks: { bookId: params.bookId } } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(updatedUser);
  },
};
