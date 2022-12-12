import React from "react";
import "./ErrorLoader.css";
import Card from "./Card";

const ErrorLoader = (props) => {
  return (
    <Card className="center error-loader">
      <header className="error-header">
        <h2>An error occured</h2>
      </header>
      <div className="error-body">
        <h6>Something went wrong, try again later.</h6>
        <p>{props.error}</p>
      </div>
    </Card>
  );
};

export default ErrorLoader;
