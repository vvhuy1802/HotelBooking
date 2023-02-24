const User = require("../models/user");
const Hotel = require("../models/hotel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const PrivateKey = process.env.TOKEN_KEY;
const Register = async (req, res) => {
  try {
    // Get user input
    const { name, phone_number, email, password } = req.body;

    // Validate user input
    if (!(email && password && name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      name,
      phone_number,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign({ user_id: user._id, email }, PrivateKey, {
      expiresIn: "2h",
    });
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
};

const Login = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
};

const CheckLogin = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  res.status(200).send({
    message: "Welcome 🙌 ",
    data: {
      user: user,
    },
  });
};

const Logout = (req, res) => {
  res.status(200).send("Logout");
};

module.exports = {
  Register,
  Login,
  CheckLogin,
  Logout,
};
