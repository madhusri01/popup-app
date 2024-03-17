import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <nav className="navbar navbar-expand-sm bg-primary justify-content-center">
        <ul className="navbar-nav">
          <li className="nav-item">
            {/* <a className="nav-link" href="#">
              Dashboard
            </a> */}
            <Link
              className="navbar-item"
              // activeClassName="is-active"
              to="/dashboard"
            >
              Dashboard
            </Link>
          </li>
          {/* <li className="nav-item">
            <Link className="navbar-item" to="/sidebar">
              Templates
            </Link>
          </li>
           */}
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
