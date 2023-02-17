const Post = require("../models/post");
const User = require("../models/user");

const createPost = async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(200).send("Post created successfully");
  } catch (error) {
    res.status(500).json({ mesg: error });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      const updatedPost = await Post.findByIdAndUpdate(post._id, req.body);
      res.status(200).send("Post updated successfully");
    } else {
      res.status(403).send("You can only update your post");
    }
  } catch (error) {
    res.status(500).json({ mesg: error });
  }
};

const deletePost = async (req, res) => {
    try {
    const post = await Post.findById(req.params.id);

    if (
      post.userId === req.body.userId ||
      req.body.userId === "638f88d291604629cba6de21"
    ) {
      const updatedPost = await Post.findByIdAndDelete(post._id);
      res.status(200).send("Post deleted successfully");
    } else {
      res.status(403).send("You can only delete your post");
    }
  } catch (error) {
    res.status(500).json({ mesg: error });
  }
};

const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.likes.includes(req.body.userId)){
            await post.updateOne({$pull: {likes: req.body.userId}});
            res
              .status(200)
              .json({ length: post.likes.length - 1, isLiked: false });
        }
        else
        {
            await post.updateOne({$push: {likes: req.body.userId}});
            res.status(200).json({ length: post.likes.length + 1, isLiked: true});

        }
    } catch (error) {
        res.status(500).json(error);
    }
};

const getUserPost = async (req, res) => {
  try {
    const posts = await Post.find({userId: req.params.userId})
    res.status(200).json({posts});
  } catch (error) {
    res.status(500).json(error);
  }
};

const getTimeline = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    let posts = await Promise.all(
      user.followings.map((following) => {
        return Post.find({ userId: following });
      })
    );

    let allPosts = [];

    posts.forEach((post) => {
      post.forEach((p) => {
        allPosts.push(p);
      })
    })

    posts = allPosts;

    res.status(200).json({posts});

  } catch (error) {
    res.status(500).json(error);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({});

    const users = await Promise.all(posts.map((post) => {
      return User.findById(post.userId);
    }))

    for( let i = 0; i < posts.length; i++)
    {
      posts[i].userId = users[i].username;
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status.json(error);
  }
}

const commentPost = async (req, res) => {};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
  getTimeline,
  getUserPost,
  getAllPosts,
};
