import React, { useState } from "react";
import "./login.scss";
import avatar from "../../assets/avatar.jpg";
import { SignIn } from "../../middlewares/auth";
import { setLocalStorage } from "../../functions/asyncStorageFunctions";
import { useDispatch } from "react-redux";
import { setUserInfo, setAnnouncement } from "../../redux/Slices/Global";
const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("huihui@gmail.com");
  const [password, setPassword] = useState("1234567");
  const dispatch = useDispatch();
  const handleLogin = () => {
    setIsLoading(true);
    SignIn(email, password).then((res) => {
      if (res.status === 200) {
        setLocalStorage("token", res.data.token);
        dispatch(setUserInfo(res.data));
        dispatch(
          setAnnouncement({
            message: "Login Success",
            type: "success",
            id: Math.random(),
          })
        );
        setIsLoading(false);
      } else {
        dispatch(
          setAnnouncement({
            message: "Login Failed",
            type: "error",
          })
        );
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="body">
      <div className="login-wrapper">
        <form action="" className="form">
          <img src={avatar} alt="" />
          <h2>Login</h2>
          <div className="input-group">
            <input
              type="text"
              name="loginUser"
              id="loginUser"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
            <label>User Name</label>
          </div>
          <div className="input-group">
            <input
              type="password"
              name="loginPassword"
              id="loginPassword"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
            <label>Password</label>
          </div>
          <div
            className="submit-btn"
            onClick={() => {
              handleLogin();
            }}
          >
            {isLoading ? <div class="loading-spinner" /> : "Login"}
          </div>
          {/* <a href="#forgot-pw" className="forgot-pw">
          Forgot Password?
        </a> */}
        </form>

        {/* <div id="forgot-pw">
        <form action="" className="form">
          <a href="#" className="close">
            &times;
          </a>
          <h2>Reset Password</h2>
          <div className="input-group">
            <input type="email" name="email" id="email" required />
            <label for="email">Email</label>
          </div>
          <input type="submit" value="Submit" className="submit-btn" />
        </form>
      </div> */}
      </div>
    </div>
  );
};

export default Login;