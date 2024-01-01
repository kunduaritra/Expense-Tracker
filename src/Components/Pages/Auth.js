import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/download-bg.png";
import AuthContext from "../Store/AuthContext";
import { Link } from "react-router-dom";

const Auth = () => {
  let inputEmailRef = useRef();
  let inputPasswordRef = useRef();
  let inputConfirmPasswordRef = useRef();
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const signupHandler = async (e) => {
    e.preventDefault();
    if (!isLogin) {
      const enteredEmail = inputEmailRef.current.value;
      const enterdPassword = inputPasswordRef.current.value;
      const enterdConfirmPassword = inputConfirmPasswordRef.current.value;

      if (enterdPassword === enterdConfirmPassword) {
        try {
          const res = await fetch(
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC9al0xhrxI9sgelfOWw3Gp4ftiLh5a47I",
            {
              method: "POST",
              body: JSON.stringify({
                email: enteredEmail,
                password: enterdPassword,
                returnSecureToken: true,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (res.ok) {
            console.log("Successfully Signed Up!");
            inputEmailRef.current.value = "";
            inputPasswordRef.current.value = "";
            inputConfirmPasswordRef.current.value = "";
            setPasswordMismatch(false);
          } else {
            const data = await res.json();
            if (data && data.error && data.error.message) {
              throw new Error(data.error.message);
            }
          }
        } catch (err) {
          alert(err.message);
        }
      } else {
        setPasswordMismatch(true);
      }
    } else {
      const enteredEmail = inputEmailRef.current.value;
      const enterdPassword = inputPasswordRef.current.value;

      try {
        const res = await fetch(
          "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC9al0xhrxI9sgelfOWw3Gp4ftiLh5a47I",
          {
            method: "POST",
            body: JSON.stringify({
              email: enteredEmail,
              password: enterdPassword,
              returnSecureToken: true,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.ok) {
          console.log("Successfully Logged In!");
          inputEmailRef.current.value = "";
          inputPasswordRef.current.value = "";
          const data = await res.json();
          authContext.login(data.idToken, data.email);
          navigate("/welcome");
        } else {
          const data = await res.json();
          if (data && data.error && data.error.message) {
            throw new Error(data.error.message);
          }
        }
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handlePasswordChange = () => {
    setPasswordMismatch(false);
  };

  const loginHandler = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      <div
        className="bg-cover bg-center"
        style={{
          backgroundImage: `url(${bg})`,
        }}
      >
        <div className="mt-20 mx-auto max-w-lg p-8 border-2 border-gray-300 rounded-lg">
          <form className="space-y-4" onSubmit={signupHandler}>
            <h2 className="text-3xl font-bold">
              {isLogin ? "Login" : "Sign Up"}
            </h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 required:"
              ref={inputEmailRef}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 required:"
              ref={inputPasswordRef}
              required
              onChange={handlePasswordChange}
            />
            {!isLogin && (
              <input
                type="text"
                placeholder="Confirm Password"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 required:"
                ref={inputConfirmPasswordRef}
                required
                onChange={handlePasswordChange}
              />
            )}
            {passwordMismatch && (
              <p className="text-red-600 font-san">Passwords don't match.</p>
            )}
            <button
              type="submit"
              className="bg-blue-900 rounded-full w-full px-4 py-2 text-white hover:bg-blue-700 hover:font-bold"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
            {isLogin ? (
              <div className="justify-center flex">
                <Link to="/forgetpassword" className="text-blue-700">
                  Forgot Password?
                </Link>
              </div>
            ) : (
              ""
            )}
          </form>
        </div>
        <div className="mt-4 text-center text-gray-700 border-2 border-gray-300 p-4 max-w-lg mx-auto bg-green-100">
          <button
            onClick={loginHandler}
            className="hover:font-bold hover:text-blck-400"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Have an account? Login"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Auth;
