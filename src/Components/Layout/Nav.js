import React from "react";

const Nav = () => {
  return (
    <div className="container flex items-center p-4">
      <div className="mx-4 font-bold text-2xl">MyWebLink</div>
      <ul className="flex">
        <li className="mx-4">Home</li>
        <li className="mx-4">Products</li>
        <li className="mx-4">About Us</li>
      </ul>
    </div>
  );
};

export default Nav;
