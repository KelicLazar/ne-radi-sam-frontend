import React, { useContext } from "react";
import { NavDropdown } from "react-bootstrap";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import Avatar from "../UIElements/Avatar";
import "./NavLinks.css";

const NavLinks = (props) => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  if (props.side) {
    return (
      <ul className="nav-links">
        {authCtx.isLoggedIn && (
          <React.Fragment>
            <li onClick={props.onClick}>
              <NavLink to="/new-job">+ Dodaj posao</NavLink>
            </li>

            <li onClick={props.onClick}>
              <NavLink to={`/user/${authCtx.user.id}`}>Moj Profil</NavLink>
            </li>
            <li onClick={props.onClick}>
              <NavLink to={`/my-jobs/${authCtx.user.id}`}>Moji poslovi</NavLink>
            </li>

            <li onClick={props.onClick}>
              <NavLink to={`/edit-profile/${authCtx.user.id}`}>
                Izmeni profil
              </NavLink>
            </li>
            <li onClick={props.onClick}>
              <NavLink to="/change-password">Promena lozinke</NavLink>
            </li>

            <li onClick={props.onClick}>
              <NavLink to={`/notifications/${authCtx.user.id}`}>
                Obaveštenja
              </NavLink>
            </li>

            <li
              onClick={() => {
                props.onClick();
                authCtx.logout();
              }}
            >
              <Link to="/">Odjavi se</Link>
            </li>
          </React.Fragment>
        )}
        {!authCtx.isLoggedIn && (
          <li onClick={props.onClick}>
            <NavLink to="/auth">Prijavi se</NavLink>
          </li>
        )}
      </ul>
    );
  }

  return (
    <ul className="nav-links">
      {authCtx.isLoggedIn && (
        <li onClick={props.onClick}>
          <NavLink to="new-job" end>
            + Dodaj posao
          </NavLink>
        </li>
      )}

      {authCtx.isLoggedIn && (
        <li>
          <NavDropdown
            className="navDropDown"
            title={
              <>
                <Avatar
                  image={`${process.env.REACT_APP_ASSET_URL}/${authCtx.user.image}`}
                  alt=" user pic"
                  width="40px"
                  height="40px"
                />
              </>
            }
            align="end"
          >
            <NavDropdown.Item
              as="span"
              onClick={() => {
                navigate(`/user/${authCtx.user.id}`, { replace: true });
              }}
            >
              Moj profil
            </NavDropdown.Item>
            <NavDropdown.Item
              as="span"
              onClick={() => {
                navigate(`/my-jobs/${authCtx.user.id}`);
              }}
            >
              Moji poslovi
            </NavDropdown.Item>
            <NavDropdown.Item
              as="span"
              onClick={() => {
                navigate(`/edit-profile/${authCtx.user.id}`, {
                  replace: true,
                });
              }}
            >
              Izmeni profil
            </NavDropdown.Item>
            <NavDropdown.Item
              as="span"
              onClick={() => {
                navigate(`/change-password`);
              }}
            >
              Promena lozinke
            </NavDropdown.Item>

            <NavDropdown.Item
              as="span"
              onClick={() => {
                navigate(`/notifications/${authCtx.user.id}`);
              }}
            >
              Obaveštenja
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item
              as="span"
              onClick={() => {
                authCtx.logout();
                navigate("/");
              }}
            >
              Odjavi se
            </NavDropdown.Item>
          </NavDropdown>
        </li>
      )}
      {!authCtx.isLoggedIn && (
        <li>
          <NavLink to="/auth">Prijavi se</NavLink>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
