import React from "react";
import { Link } from "react-router-dom";

const Forbidden = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center bg-light">
      <h1 className="display-1 fw-bold text-warning">403</h1>
      <h2 className="mb-4">Forbidden</h2>
      <p className="mb-4">
        Oops! You don’t have permission to access this page.
      </p>
      <Link to="/" className="btn btn-warning btn-lg">
        Go Back Home
      </Link>
    </div>
  );
};

export default Forbidden;
