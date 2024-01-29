import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../Store/authRedux";

const Nav = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(authActions.logout());
    navigate("/");
  };
  return (
    <div className="container flex items-center p-4">
      <div className="mx-4 font-bold text-2xl">
        <Link to="/welcome">MyWebLink</Link>
      </div>
      <ul className="flex">
        <li className="mx-4">
          <Link to="welcome">Home</Link>
        </li>
        <li className="mx-4">Products</li>
        <li className="mx-4">About Us</li>
        {isAuth && (
          <li className="mx-4">
            <button onClick={logoutHandler}>Log Out</button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Nav;
