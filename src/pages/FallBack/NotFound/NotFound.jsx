import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center bg-light">
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <h2 className="mb-4">Page Not Found</h2>
      <p className="mb-4">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
