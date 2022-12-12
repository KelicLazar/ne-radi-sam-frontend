import React, { useContext, useState } from "react";
import Button from "../FormElements/Button";
import { Rating } from "react-simple-star-rating";
import Card from "../UIElements/Card";
import Modal from "../UIElements/Modal";
import Input from "../FormElements/Input";
import { useForm } from "../../hooks/form-hook";
import "./NotificationItem.css";
import { VALIDATOR_REQUIRE } from "../utils/validators";
import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../../context/auth-context";
import ErrorModal from "../UIElements/ErrorModal";
import LoadingSpinner from "../UIElements/LoadingSpinner";

const NotificationItem = (props) => {
  const [showRateModal, setShowRateModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const authCtx = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [formState, inputHandler] = useForm(
    { comment: { value: "", isValid: false } },
    false
  );

  const deleteNotificationHandler = () => {
    props.onDelete(props.id);
  };

  const acceptOfferHandler = async () => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/others/post-order",
        "POST",
        JSON.stringify({
          type: "order",
          forJob: props.forJob,
          fromUser: props.byUser.id,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        }
      );

      responseData.ok && deleteNotificationHandler();
    } catch (error) {}
  };

  const submitRateHandler = async (event) => {
    event.preventDefault();

    const body = JSON.stringify({
      rate: rating / 20,
      comment: formState.inputs.comment.value,
      userToRate: props.byUser.id,
    });

    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/others/give-rating",
        "POST",
        body,
        {
          Authorization: "Bearer " + authCtx.token,
          "Content-Type": "application/json",
        }
      );

      responseData.ok && setShowRateModal(false) && deleteNotificationHandler();
    } catch (error) {}
  };

  const rateNotificationHandler = async () => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/others/post-notification",
        "POST",
        JSON.stringify({
          type: "rate",
          forJob: props.forJob,
          forUser: props.byUser.id,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        }
      );

      responseData.ok && deleteNotificationHandler();
    } catch (error) {}
  };

  let actions;
  let title;
  let description;

  if (props.type === "info") {
    title = `Korisnik ${props.byUser.name} vas je ocenio`;
    description = `Klikni na detalje da bi video ocenu i komentar.`;
    actions = (
      <>
        <Button inverse onClick={deleteNotificationHandler}>
          Obrisi
        </Button>
        <Button>Detalji</Button>
      </>
    );
  }
  if (props.type === "offer") {
    title = `${props.byUser.name} želi da vas zaposli`;
    description = `Ako prihvatis ponudu za posao ${props.forJob}, korisnik ce moci da te oceni kada odradis posao.`;
    description = (
      <>
        <p>Ponuda za posao {props.forJob}</p>
        <p>
          Ako prihvatiš ponudu, {props.byUser.name} će moći da te oceni kada
          odradiš posao.
        </p>
      </>
    );

    actions = (
      <>
        <Button inverse onClick={deleteNotificationHandler}>
          Odbij
        </Button>
        <Button onClick={acceptOfferHandler}>Prihvati</Button>
      </>
    );
  }
  if (props.type === "rate") {
    title = `Korisnik ${props.byUser.name} je odradio posao ${props.forJob}`;
    description = `${props.byUser.name} je označio posao kao obavljen, sada možeš da ga oceniš.`;

    actions = (
      <>
        <Button onClick={deleteNotificationHandler}>Odbij</Button>
        <Button
          onClick={() => {
            setShowRateModal(true);
          }}
        >
          Oceni
        </Button>
      </>
    );
  }
  if (props.type === "order") {
    title = `Dogovoren posao sa ${props.byUser.name} `;
    description = (
      <>
        <p>Dogovoren posao: {props.forJob}.</p>
        <p>
          Kada označiš posao kao završen, {props.byUser.name} će moći da te
          oceni.
        </p>
      </>
    );

    actions = (
      <>
        <Button inverse onClick={deleteNotificationHandler}>
          Otkazi posao
        </Button>
        <Button onClick={rateNotificationHandler}>Obavljen posao</Button>
      </>
    );
  }
  if (props.type === "acceptedOffer") {
    title = `Korisnik ${props.byUser.name} je prihvation tvoju ponudu za posao`;
    description = `Kada posao: ${props.forJob}, bude zavrsen moći ćeš da ga oceniš.`;

    actions = (
      <Button inverse onClick={deleteNotificationHandler}>
        Obrisi
      </Button>
    );
  }

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      {props.type === "rate" && (
        <Modal
          show={showRateModal}
          onCancel={() => {
            setShowRateModal(false);
          }}
          onSubmit={submitRateHandler}
          header="Ocenite korisnika"
          footer={
            <React.Fragment>
              <Button
                type="button"
                onClick={() => {
                  setShowRateModal(false);
                }}
                inverse
              >
                Otkazi
              </Button>
              <Button
                disabled={!formState.isValid || rating === 0}
                type="submit"
              >
                Oceni
              </Button>
            </React.Fragment>
          }
        >
          <div className="rate-container">
            <Rating
              allowHalfIcon
              ratingValue={rating}
              onClick={(rate) => {
                setRating(rate);
              }}
              style={{
                display: "flex",
                flexDirection: "row",
              }}
              transition
              tooltipArray={[
                "Veoma los",
                "Los",
                "Dobar",
                "Vrlo dobar",
                "Odličan",
              ]}
              showTooltip
              tooltipStyle={{
                backgroundColor: "transparent",
                color: "brown",
                fontWeight: "500",
                fontSize: "1.2rem",
                width: "100%",
                margin: "0",
                textAlign: "center",
              }}
              fillColorArray={[
                "#f17a45",
                "#f19745",
                "#f1a545",
                "#f1b345",
                "#f1d045",
              ]}
            />
            <Input
              onInput={inputHandler}
              id="comment"
              label="Opis"
              noResize
              rows="4"
              validators={[VALIDATOR_REQUIRE]}
              errorText="Molimo unesite opis."
            />
          </div>
        </Modal>
      )}
      <Card className="notification-item">
        <div className="notification-header">
          <h4>
            <img
              alt="user"
              className="userImg"
              src={`http://localhost:5000/${props.byUser.image}`}
            />
            {title}
          </h4>
        </div>
        <div className="notification-content">{description}</div>
        <div className="notification-footer">
          <p className="notification-date">{props.dateCreated}</p>
          <div className="notification-actions">{actions}</div>
        </div>
      </Card>
    </React.Fragment>
  );
};

export default NotificationItem;
