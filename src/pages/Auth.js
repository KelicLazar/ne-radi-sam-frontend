import React, { useContext, useState } from "react";
import Button from "../shared/components/FormElements/Button";
import Input from "../shared/components/FormElements/Input";
import ErrorModal from "../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../shared/components/utils/validators";
import { useHttpClient } from "../shared/hooks/http-hook";
import { useForm } from "../shared/hooks/form-hook";

import Card from "../shared/components/UIElements/Card";

import "./Auth.css";
import { AuthContext } from "../shared/context/auth-context";
import ImageUpload from "../shared/components/FormElements/ImageUpload";
import { useNavigate } from "react-router-dom";

const Auth = (props) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
          phone: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/log-in",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { "Content-Type": "application/json" }
        );
        authCtx.login(responseData.userData, responseData.token);
        navigate(-1);
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("phone", formState.inputs.phone.value);
        formData.append("image", formState.inputs.image.value);
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/sign-up",
          "POST",
          formData
        );
        authCtx.login(responseData.userData, responseData.token);
        navigate(-1);
      } catch (error) {}
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card
        className={`authentication ${
          isLoginMode ? "auth-login" : "auth-signup"
        }`}
      >
        {isLoading && <LoadingSpinner asOverlay />}
        <div
          onClick={() => {
            if (isLoginMode) {
              switchModeHandler();
            }
          }}
          className={`sign-up  ${!isLoginMode && "active"}`}
        >
          <h3>Registruj se</h3>
        </div>
        <div
          onClick={() => {
            if (!isLoginMode) {
              switchModeHandler();
            }
          }}
          className={`log-in  ${isLoginMode && "active"}`}
        >
          <h3>Prijavi se</h3>
        </div>

        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              onInput={inputHandler}
              id="name"
              type="text"
              element="input"
              validators={[VALIDATOR_REQUIRE()]}
              label="Vaše ime"
              errorText="Molimo unesite vaše ime."
            />
          )}

          <Input
            onInput={inputHandler}
            id="email"
            type="email"
            element="input"
            label="E-mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Molimo unesite ispravnu e-mail adresu."
          />

          <Input
            onInput={inputHandler}
            id="password"
            type="password"
            element="input"
            label="Lozinka"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Lozinka mora imati minimum 6 znakova."
          />
          {!isLoginMode && (
            <Input
              onInput={inputHandler}
              id="phone"
              type="tel"
              element="input"
              label="Telefon"
              validators={[VALIDATOR_REQUIRE]}
              errorText="Molimo unesite vaš broj telefona."
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              errorText="Molimo izaberite sliku."
              id="image"
              center
              onInput={inputHandler}
              action="Izaberi sliku"
            />
          )}

          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "Prijavi se" : "Registruj se"}
          </Button>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
