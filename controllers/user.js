const brcypt = require("bcrypt");
const User = require("../models/user");

const updateUser = async (req, res) => {
  try {
    if (req.body.userId === req.params.id) {
      if (req.body.password) {
        const salt = await brcypt.genSalt(10);
        const hashpassword = await brcypt.hash(req.body.password, salt);
        req.body.password = hashpassword;
      }
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        req.body
      );

      !user && res.status(400).send("User doesn't exist");

      res.status(200).send("your account has been updated successfully");
    } else {
      res.status(400).send("you can update only your account");
    }
  } catch (error) {
    res.status(500).json({ mesg: error });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.body.userId === req.params.id) {
      const user = await User.findByIdAndDelete(req.body.userId);

      !user && res.status(400).send("User doesn't exist");

      res.status(200).send("your account has been deleted successfully");
    } else {
      res.status(400).send("you can delete only your account");
    }
  } catch (error) {
    res.status(500).json({ mesg: error });
  }
};

const getUser = async (req, res) => {
  try {
    const user =
      (await User.findById(req.query.id)) ||
      (await User.findOne({ username: req.query.username }));
    const { createdAt, password, updatedAt, ...others } = user._doc;
    res.status(200).json({ others });
  } catch (error) {
    res.status(500).json({ mesg: error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ mesg: error });
  }
};

const followUser = async (req, res) => {

  try {
    if (req.body.userId !== req.params.id) {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });

        res.status(200).send(currentUser);
      } else {
        res.status(403).send("You already follow this user");
      }
    } else {
      res.status(400).send("you can not follow yourself");
    }
  } catch (error) {
    res.status(500).json({ mesg: error });
  }
};

const unfollowUser = async (req, res) => {
  try {
    if (req.body.userId !== req.params.id) {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });

        res.status(200).send(currentUser);
      } else {
        res.status(403).send("You don't follow this user");
      }
    } else {
      res.status(400).send("you can not unfollow yourself");
    }
  } catch (error) {
    res.status(500).json({ mesg: error });
  }
};

const getFollowings = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const followingsId = user.followings;
    const followingsUser = await Promise.all(
      followingsId.map((id) => {
        return User.findById(id);
      })
    )

    res.status(200).json(followingsUser);
  } catch (error) {
    res.status(500).json(error);
  }
}

const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const followersId = user.followers;
    const followersUser = await Promise.all(
      followersId.map((id) => {
        return User.findById(id);
      })
    );

    res.status(200).json(followersUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

const searchUser = async (req, res) => {
  const {name} = req.body;
  const users = await User.find({ name: { $regex: name, $options: "i" } });
  res.status(200).json(users);
}

module.exports = {
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
  followUser,
  unfollowUser,
  getFollowings,
  getFollowers,
  searchUser,
};
