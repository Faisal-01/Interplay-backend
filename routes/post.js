
const express = require('express');
const router = express.Router();

const {
  createPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
  getTimeline,
  getUserPost,
  getAllPosts,
} = require("../controllers/post");

//create post
router.post('/', createPost);

//update post
router.patch('/:id', updatePost);

// delete post
router.delete('/:id', deletePost);

// like post
router.patch("/:id/like", likePost);

// comment post
//timeline
router.get("/timeline/:userId", getTimeline);

router.get("/userposts/:userId", getUserPost);

router.get("/all", getAllPosts);


module.exports = router;