import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
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
      </ul>
    </div>
  );
};

export default Nav;
