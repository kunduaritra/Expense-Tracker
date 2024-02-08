import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ExpensePage from "./ExpensePage";
import { useDispatch, useSelector } from "react-redux";
import "../../index.css";
import { themeActions } from "../Store/themeRedux";

const WelcomePage = () => {
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [userName, setUserName] = useState("");

  const token = useSelector((state) => state.auth.token);
  const totalExpense = useSelector((state) => state.expense.totalExpense);
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();

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

  const fetchDataFromServer = async () => {
    try {
      const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyC9al0xhrxI9sgelfOWw3Gp4ftiLh5a47I",
        {
          method: "POST",
          body: JSON.stringify({
            idToken: token,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error("Something Went Wrong");
      } else {
        const data = await res.json();
        if (data && data.users && data.users[0]) {
          if (data.users[0].emailVerified === true) {
            setIsEmailVerified(true);
          }
          if (data.users[0].displayName && data.users[0].photoUrl) {
            setIsProfileComplete(true);
            setUserName(data.users[0].displayName);
          }
        }
      }
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchDataFromServer();
  });

  const themeControlHandler = () => {
    dispatch(themeActions.toggleTheme());
  };

  const premiumControlHandler = () => {
    dispatch(themeActions.premiumActivate());
  };

  return (
    <>
      <div
        className={`flex ${theme.isDarkTheme ? "dark-theme" : "light-theme"}`}
      >
        <div className="font-bold text-3xl mx-14 mt-10 italic">
          Welcome to Expense Tracker! {userName}
        </div>
        {totalExpense > 10000 && (
          <span className="ml-auto mt-10 italic bg-yellow-400 text-blue-950 rounded-full p-2 hover:bg-blue-800 hover:text-yellow-200 transition duration-300 ease-in-out">
            <button className="font-bold" onClick={premiumControlHandler}>
              Activate Premium
            </button>
          </span>
        )}
        {theme.isPremiumActivated && (
          <span>
            <button
              className={`ml-3 mt-10 p-2 rounded-full 
                ${
                  theme.isDarkTheme
                    ? "bg-yellow-400 text-blue-950 hover:bg-black hover:text-yellow-200"
                    : "bg-black text-yellow-200 hover:bg-yellow-400 hover:text-blue-950"
                }
                transition duration-300 ease-in-out`}
              onClick={themeControlHandler}
            >
              {theme.isDarkTheme ? "Light" : "Dark"}
            </button>
          </span>
        )}
        <span className="ml-auto mt-10 italic bg-pink-200 rounded-full p-2">
          {!isProfileComplete ? "Your profile is incomplete." : ""}
          <Link to="/completeprofile" className="text-blue-700">
            {isProfileComplete ? "View Profile" : "Complete Now."}
          </Link>
        </span>
      </div>
      {!isEmailVerified && (
        <div>
          <button
            onClick={verifyEmailHandler}
            className="ml-10 my-10 italic bg-red-600 rounded-full p-2 text-white font-bold"
          >
            Verify Your Email.
          </button>
        </div>
      )}
      <div>
        <ExpensePage />
      </div>
    </>
  );
};

export default WelcomePage;
