import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useSelector } from "react-redux";

const CompleteProfile = () => {
  const [updationComplete, setUpdationComplete] = useState(false);
  const [blankInputError, setBlankInputError] = useState(false);
  const [fullName, setFullName] = useState("");
  const [profilePhotoURL, setProfilePhotoURL] = useState("");
  const [isIncompleteProfile, setIsIncompleteProfile] = useState(true);
  const inputFullNameRef = useRef();
  const inputProfilePhotoURL = useRef();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const theme = useSelector((state) => state.theme);

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    const enteredFullName = inputFullNameRef.current.value;
    const enteredProfilePhotoURL = inputProfilePhotoURL.current.value;

    if (enteredFullName && enteredProfilePhotoURL) {
      try {
        const res = await fetch(
          "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyC9al0xhrxI9sgelfOWw3Gp4ftiLh5a47I",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idToken: token,
              displayName: enteredFullName,
              photoUrl: enteredProfilePhotoURL,
            }),
          }
        );
        if (res.ok) {
          setUpdationComplete(true);
          setIsIncompleteProfile(false);
          const data = await res.json();
          console.log(data);
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
      setBlankInputError(true);
    }
  };

  const cancelHandler = () => {
    navigate("/welcome");
  };

  const inputOnchangeHandler = () => {
    setBlankInputError(false);
    setUpdationComplete(false);
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
        console.log(data);
        if (data && data.users && data.users[0]) {
          setFullName(data.users[0].displayName);
          setProfilePhotoURL(data.users[0].photoUrl);
          if (data.users[0].displayName && data.users[0].photoUrl) {
            setIsIncompleteProfile(false);
          }
        }
      }
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchDataFromServer();
  }, []);

  return (
    <>
      <div className={`${theme.isDarkTheme ? "dark-theme" : "light-theme"}`}>
        <div className="flex border-2 p-2">
          <div className="text-xl italic my-auto">
            Winner never quit, Quitters never win.
          </div>
          {isIncompleteProfile && (
            <div className="ml-auto italic bg-pink-200 rounded-full p-2 max-w-3/4 text-sm">
              <p className="whitespace-normal">
                Your Profile is 64% completed. A Complete Profile has higher
                chances
                <Link to="/completeprofile" className="text-blue-700 block">
                  Complete Now.
                </Link>
              </p>
            </div>
          )}
        </div>

        <div className="pl-8 py-20">
          <form className="max-w-3xl mx-auto" onSubmit={formSubmitHandler}>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Contact Details</h1>
              <button
                onClick={cancelHandler}
                className="text-blue-500 hover:underline hover:text-red-600"
              >
                Cancel
              </button>
            </div>
            <div className="mb-4 flex items-center">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faGithub} className="mr-2" />
                <label className="mr-4">Full Name:</label>
                <input
                  type="text"
                  ref={inputFullNameRef}
                  className="border border-black rounded-full"
                  defaultValue={fullName}
                  onChange={inputOnchangeHandler}
                />
              </div>
              <div className="flex items-center ml-8">
                <FontAwesomeIcon icon={faGlobe} className="mr-4" />
                <label className="mr-4">Profile Photo URL:</label>
                <input
                  type="text"
                  ref={inputProfilePhotoURL}
                  className="border border-black rounded-full"
                  defaultValue={profilePhotoURL}
                  onChange={inputOnchangeHandler}
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-pink-800 text-white rounded-full px-4 hover:bg-pink-950"
            >
              Update
            </button>
          </form>
          <div className="p-4 ml-14 text-green-800 font-bold">
            {updationComplete ? "Profile Updated Successfully." : ""}
            {blankInputError ? "Enter Full Name or Profile Photo URL" : ""}
          </div>
        </div>
      </div>
    </>
  );
};

export default CompleteProfile;
