import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  const inputEmailRef = useRef();
  const [sentLinkMessage, setSentLinkMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const forgetPasswordHandler = async (e) => {
    e.preventDefault();
    const enteredEmail = inputEmailRef.current.value;
    if (enteredEmail) {
      try {
        setLoading(true);

        const res = await fetch(
          "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyC9al0xhrxI9sgelfOWw3Gp4ftiLh5a47I",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              requestType: "PASSWORD_RESET",
              email: enteredEmail,
            }),
          }
        );

        if (res.ok) {
          setSentLinkMessage(true);
        } else {
          const data = await res.json();
          if (data && data.error && data.error.message) {
            throw new Error(data.error.message);
          }
        }
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Enter an Email.");
    }
  };

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="border flex flex-col max-w-lg p-10 shadow-md">
        <span className="italic text-blue-950 bg-pink-200 p-2 rounded-full mb-2">
          Enter Your Registered Email to get a Password Reset Link.
        </span>
        <form
          onSubmit={forgetPasswordHandler}
          className="flex flex-col items-center"
        >
          <label className="mb-2 text-lg font-semibold">Email:</label>
          <input
            type="email"
            className="border border-gray-200 px-4 py-3 mb-4 focus:outline-none focus:border-blue-500"
            ref={inputEmailRef}
          />
          <button
            type="submit"
            className="bg-blue-800 text-white px-4 py-2 rounded-full hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Link"}
          </button>
          <Link to="/" className="mt-2 italic">
            Login | Sign Up
          </Link>
        </form>
        {sentLinkMessage && (
          <span className="mx-auto my-4 text-green-600 font-semibold">
            Password Reset Link Has Been Sent.
          </span>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
