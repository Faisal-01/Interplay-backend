const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {

    const {email, password} = req.body;
    if(!email || !password){
      res.status(400).send("Please Enter Email and password");

    }
    const user = await User.findOne({ email: req.body.email });
    if(!user){

      res.status(404).send("User doesn't exists");
      return;
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
      res.status(400).send("Password is incorrect");
      return;
    };

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({mesg: error});
  }
};

const register = async (req, res) => {
  try {

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashpassword;

    const user = await User.create(req.body);
    res.status(200).json("User Registered Succesfully");
  } catch (error) {
    res.status(500).json({ mesg: error });
  }
};

module.exports = {login, register};