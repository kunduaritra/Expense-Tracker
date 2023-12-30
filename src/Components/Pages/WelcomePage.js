import React from "react";
import { Link } from "react-router-dom";

const WelcomePage = () => {
  return (
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
  );
};

export default WelcomePage;
