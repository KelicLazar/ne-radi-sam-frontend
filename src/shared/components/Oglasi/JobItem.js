import React, { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import Button from "../FormElements/Button";
import Modal from "../UIElements/Modal";
import { Rating } from "react-simple-star-rating";
import ErrorModal from "../UIElements/ErrorModal";

import "./JobItem.css";
import { useHttpClient } from "../../hooks/http-hook";

const JobItem = (props) => {
  const [showDeletemModal, setShowDeleteModal] = useState(false);
  const [showZaposliModal, setShowZaposliModal] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(true);
  const { error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  let totalRating = 0;

  if (props.ratings.length > 0) {
    for (let i = 0; i < props.ratings.length; i++) {
      totalRating = totalRating + props.ratings[i].rate;
    }
  }
  let ratingColor;

  let userRating =
    props.ratings.length > 0 ? totalRating / props.ratings.length : 0;

  switch (Math.ceil(userRating)) {
    case 1:
      ratingColor = "#f17a45";
      break;
    case 2:
      ratingColor = "#f19745";
      break;
    case 3:
      ratingColor = "#f1a545";
      break;
    case 4:
      ratingColor = "#f1b345";
      break;
    case 5:
      ratingColor = "#f1d045";
      break;

    default:
      ratingColor = "black";
      break;
  }

  const showDeleteWarningHandler = () => {
    setShowDeleteModal(true);
  };

  const cancelDeleteWarningHandler = () => {
    setShowDeleteModal(false);
  };
  const confirmDeleteHandler = async () => {
    setShowDeleteModal(false);

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/jobs/delete-job/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + authCtx.token,
        }
      );
      responseData.ok && navigate("/poslovi", { replace: true });
    } catch (error) {}
  };

  const zaposliHandler = async () => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/others/post-notification",
        "POST",
        JSON.stringify({
          forJob: props.title,
          type: "offer",
          forUser: props.creatorId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        }
      );
    } catch (error) {}
    setShowZaposliModal(false);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showDeletemModal}
        onCancel={cancelDeleteWarningHandler}
        header="Are you sure?"
        footerClass="delete-footer"
        footer={
          <React.Fragment>
            <Button onClick={cancelDeleteWarningHandler} inverse>
              Cancel
            </Button>
            <Button onClick={confirmDeleteHandler} danger>
              Delete
            </Button>
          </React.Fragment>
        }
      >
        <p>Are you sure you want to delete this place.</p>
      </Modal>
      <Modal
        show={showZaposliModal}
        onCancel={() => {
          setShowZaposliModal(false);
        }}
        header={"Zaposli korisnika?"}
        headerClass="zaposli-header"
        footer={
          <React.Fragment>
            <Button
              onClick={() => {
                setShowZaposliModal(false);
              }}
              inverse
            >
              Odustani
            </Button>
            <Button onClick={zaposliHandler}>Zaposli</Button>
          </React.Fragment>
        }
      >
        <h4>
          Zaposli korisnika {props.name} za posao {props.title}
        </h4>
        <h6>
          Cena je {props.price}
          <i style={{ color: "black" }} class="uil uil-euro"></i>
        </h6>
      </Modal>
      <div className="job-item">
        <h3 className="title">{props.title}</h3>
        <h6 className="date">
          <i className="uil uil-clock"></i> {props.date}
        </h6>
        <div className="flex-box">
          <div className="left-box">
            <div className="job-content">
              <p className="job-description">
                {showMoreInfo
                  ? props.description.substring(0, 300)
                  : props.description}
                {props.description.length > 350 && (
                  <span
                    onClick={() => {
                      setShowMoreInfo((prev) => !prev);
                    }}
                  >
                    {showMoreInfo ? "...Read more" : " Read less"}
                  </span>
                )}
              </p>
              <div className="left-info">
                <h5 className="category">{props.category}</h5>
                <h5>
                  <i className="uil uil-location-point"></i>

                  {props.city}
                </h5>

                <h5>
                  <i className="uil uil-phone-alt"></i>
                  {props.phone}
                </h5>
                <h5 className="price">
                  {props.price} <i className="uil uil-euro"></i>
                </h5>
              </div>

              {authCtx.token && props.creatorId === authCtx.user.id && (
                <div className="left-footer">
                  <div className="footer-actions">
                    <Button size="" onClick={showDeleteWarningHandler} danger>
                      <i className="uil uil-trash-alt"></i>
                      Obriši
                    </Button>
                    <Button size="" onClick={props.onEdit} inverse>
                      <i className="uil uil-edit-alt"></i>
                      Izmeni
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* <div className="right-box"> */}
          <div className="user-content">
            <div
              className="user-heading"
              onClick={() => {
                navigate(`/user/${props.creatorId}`, {
                  replace: true,
                });
              }}
            >
              <div className="user-img">
                <img
                  src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
                  alt="user"
                />
              </div>
              <div className="user-info">
                <h5>{props.name}</h5>

                <div className="rating">
                  <Rating
                    readonly
                    allowHalfIcon
                    size={20}
                    initialValue={userRating}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                    tooltipStyle={{
                      backgroundColor: "transparent",
                      color: "brown",
                      fontWeight: "500",
                      fontSize: "1.2rem",
                      width: "100%",
                      margin: "0",
                      textAlign: "center",
                    }}
                    transition
                    emptyColor={"rgb(92, 91, 91)"}
                    fillColor={ratingColor}
                  ></Rating>
                </div>
              </div>
            </div>

            <h6>
              <i className="uil uil-envelope-alt"></i> {props.email}
            </h6>
            <h6>
              <i className="uil uil-phone-alt"></i> {props.phone}
            </h6>
            <Button
              onClick={() => {
                setShowZaposliModal(true);
              }}
              disabled={!authCtx.token || authCtx.user.id === props.creatorId}
              className="action-button"
              size="small"
            >
              Zaposli
            </Button>
          </div>
          {/* </div> */}
        </div>
      </div>
    </React.Fragment>
  );
};

export default JobItem;
