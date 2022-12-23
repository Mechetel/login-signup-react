import React from "react";

const Navbar = (props) => {
  const user = localStorage.getItem("user");
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div style={{ display: "flex", flex: 1 }} className="container">
        <h3>MyProject</h3>

        <button className="btn btn-secondary" onClick={props.handleLog}>
          Log {user ? "Out" : "In"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
