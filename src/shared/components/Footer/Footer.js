import React, { useState } from "react";
import ReactDOM from "react-dom";
import Button from "../FormElements/Button";
import Modal from "../UIElements/Modal";
import Input from "../FormElements/Input";
import { VALIDATOR_REQUIRE } from "../utils/validators";
import { useHttpClient } from "../../hooks/http-hook";
import { useForm } from "../../hooks/form-hook";
import "./Footer.css";
import ErrorModal from "../UIElements/ErrorModal";

const Footer = (props) => {
  const [formState, inputHandler] = useForm({}, false);
  const { error, sendRequest, clearError } = useHttpClient();

  const [showModal, setShowModal] = useState(false);

  const showModalHandler = () => {
    setShowModal(true);
  };
  const cancelModalMsg = () => {
    setShowModal(false);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/others/contact-us",
        "POST",
        JSON.stringify({
          sender: formState.inputs.email.value,
          message: formState.inputs.message.value,
        }),
        { "Content-Type": "application/json" }
      );
      responseData.ok && setShowModal(false);
    } catch (error) {}
  };
  const element = (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      <Modal
        show={showModal}
        className="footer-modal"
        header="Kontaktiraj nas"
        onCancel={cancelModalMsg}
        onSubmit={submitHandler}
        footer={
          <React.Fragment>
            <Button onClick={cancelModalMsg} type="button" inverse>
              Odustani
            </Button>
            <Button disabled={!formState.isValid} type="submit" danger>
              Posalji
            </Button>
          </React.Fragment>
        }
      >
        <Input
          onInput={inputHandler}
          id="email"
          type="email"
          element="input"
          validators={[VALIDATOR_REQUIRE()]}
          label="E-mail"
          errorText="Molimo unesite vas email."
        />
        <Input
          onInput={inputHandler}
          id="message"
          type="text"
          rows="5"
          noResize
          validators={[VALIDATOR_REQUIRE()]}
          label="Sadrzaj"
          errorText="Molimo unesite opis."
        />
      </Modal>

      <footer className="footer">
        <p>Imas predlog ili primedbu?</p>
        <Button onClick={showModalHandler} className="footer-button">
          KONTAKTIRAJ NAS
        </Button>
        <p className="copyright">
          <i className="uil uil-copyright"></i> NE RADI SAM 2022
        </p>
      </footer>
    </React.Fragment>
  );

  return ReactDOM.createPortal(element, document.getElementById("footer"));
};

export default Footer;
