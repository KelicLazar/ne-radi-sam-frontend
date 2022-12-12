import Input from "../shared/components/FormElements/Input";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
} from "../shared/components/utils/validators";
import { useForm } from "../shared/hooks/form-hook";
import Card from "../shared/components/UIElements/Card";
import ImageUpload from "../shared/components/FormElements/ImageUpload";
import Button from "../shared/components/FormElements/Button";
import { useHttpClient } from "../shared/hooks/http-hook";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../shared/context/auth-context";
import ErrorModal from "../shared/components/UIElements/ErrorModal";

const EditUser = (props) => {
  const userData = useLoaderData();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const [formState, inputHandler] = useForm(
    {
      name: {
        value: userData.name,
        isValid: true,
      },
      email: {
        value: userData.email,
        isValid: true,
      },
      phone: {
        value: userData.phone,
        isValid: true,
      },
      image: {
        value: userData.image,
        isValid: true,
      },
    },
    true
  );

  const submitEditUser = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("email", formState.inputs.email.value);
      formData.append("name", formState.inputs.name.value);
      formData.append("phone", formState.inputs.phone.value);
      formData.append("image", formState.inputs.image.value);

      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/users/edit-user",
        "PATCH",
        formData,
        {
          Authorization: "Bearer " + authCtx.token,
        }
      );
      authCtx.user = responseData.user;
      navigate("/");
    } catch (error) {}
  };
  return (
    <Card className="authentication">
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <div>
        <h4>Izmeni profil</h4>
      </div>
      <form onSubmit={submitEditUser}>
        <ImageUpload
          errorText="Molimo izaberite sliku"
          id="image"
          center
          onInput={inputHandler}
          initialValue={`${process.env.REACT_APP_ASSET_URL}/${formState.inputs.image.value}`}
          initialValid={true}
          action="Promeni sliku"
        />
        <Input
          onInput={inputHandler}
          id="name"
          type="text"
          element="input"
          validators={[VALIDATOR_REQUIRE()]}
          initialValue={formState.inputs.name.value}
          initialValid
          label="Vaše ime"
          errorText="Molimo unesite vaše ime."
        />

        <Input
          onInput={inputHandler}
          disabled
          id="email"
          type="email"
          element="input"
          label="E-mail"
          validators={[VALIDATOR_EMAIL()]}
          initialValue={formState.inputs.email.value}
          initialValid
          errorText="Molimo unesite ispravnu e-mail adresu."
        />

        <Input
          onInput={inputHandler}
          id="phone"
          type="tel"
          element="input"
          label="Telefon"
          validators={[VALIDATOR_REQUIRE()]}
          initialValue={formState.inputs.phone.value}
          initialValid
          errorText="Molimo unesite vaš broj telefona."
        />

        <Button type="submit" disabled={!formState.isValid}>
          IZMENI PROFIL
        </Button>
      </form>
    </Card>
  );
};

export default EditUser;

export const loader = async ({ params }) => {
  const userId = params.uid;

  try {
    const responseData = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/users/edit-user/${userId}`
    );
    const response = await responseData.json();
    return response.user;
  } catch (error) {
    return error;
  }
};
