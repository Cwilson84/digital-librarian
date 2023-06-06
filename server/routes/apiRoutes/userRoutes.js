const router = require("express").Router();
const {
  addUser,
  getUser,
  saveBook,
  deleteBook,
  login,
} = require("../../controllers/userController");

const { authMiddleware } = require("../../utils/auth");

router.route("/").post(addUser).put(authMiddleware, saveBook);

router.route("/login").post(login);

router.route("/me").get(authMiddleware, getUser);

router.route("/books/:bookId").delete(authMiddleware, deleteBook);

module.exports = router;
