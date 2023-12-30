import React from "react";
import { Link } from "react-router-dom";

const WelcomePage = () => {
  const token = localStorage.getItem("token");
  const verifyEmailHandler = async () => {
    try {
      const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyC9al0xhrxI9sgelfOWw3Gp4ftiLh5a47I",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestType: "VERIFY_EMAIL",
            idToken: token,
          }),
        }
      );
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <div className="flex">
        <div className="font-bold text-3xl mx-14 mt-10 italic">
          Welcome to Expense Tracker!
        </div>
        <span className="ml-auto mt-10 italic bg-pink-200 rounded-full p-2">
          Your profile is incomplete.
          <Link to="/completeprofile" className="text-blue-700">
            Complete Now.
          </Link>
        </span>
      </div>
      <div>
        <button
          onClick={verifyEmailHandler}
          className="ml-10 my-10 italic bg-red-600 rounded-full p-2 text-white font-bold"
        >
          Verify Your Email.
        </button>
      </div>
    </>
  );
};

export default WelcomePage;
