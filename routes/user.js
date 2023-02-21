const express = require("express");
const {
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
  followUser,
  unfollowUser,
  getFollowings,
  getFollowers,
  searchUser
} = require("../controllers/user");

const router = express.Router();


router.get('/', getUser);
router.get('/all', getAllUsers);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/search", searchUser);
router.patch("/follow/:id", followUser);
router.patch("/unfollow/:id", unfollowUser);
router.get("/following/:id", getFollowings);
router.get("/follower/:id", getFollowers);


module.exports = router;