import Card from "../shared/components/UIElements/Card";
import Input from "../shared/components/FormElements/Input";
import Button from "../shared/components/FormElements/Button";
import {
  VALIDATOR_CONFIRM_PASSWORD,
  VALIDATOR_MINLENGTH,
} from "../shared/components/utils/validators";
import { useForm } from "../shared/hooks/form-hook";
import { useHttpClient } from "../shared/hooks/http-hook";
import { useContext } from "react";
import { AuthContext } from "../shared/context/auth-context";
import ErrorModal from "../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";

const ChangePassword = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const authCtx = useContext(AuthContext);
  const [formState, inputHandler] = useForm(
    {
      currentPassword: { value: "", isValid: false },
      newPassword: { value: "", isValid: false },
      newPasswordConfirm: { value: "", isValid: false },
    },
    false
  );

  const changePasswordHandler = async () => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/users/change-password",
        "PATCH",
        JSON.stringify({
          currentPassword: formState.inputs.currentPassword.value,
          newPassword: formState.inputs.newPassword.value,
          confirmPassword: formState.inputs.newPasswordConfirm.value,
        }),
        {
          Authorization: "Bearer " + authCtx.token,
          "Content-Type": "application/json",
        }
      );
    } catch (error) {}
  };

  return (
    <Card className="authentication">
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      <div>
        <h4>Promena lozinke</h4>
      </div>
      <form onSubmit={changePasswordHandler}>
        <Input
          onInput={inputHandler}
          id="currentPassword"
          type="password"
          element="input"
          validators={[VALIDATOR_MINLENGTH(6)]}
          initialValue={formState.inputs.currentPassword.value}
          label="Trenutno lozinka"
          errorText="Molimo unesite trenutnu lozinku."
        />

        <Input
          onInput={inputHandler}
          id="newPassword"
          type="password"
          element="input"
          label="Nova lozinka"
          validators={[VALIDATOR_MINLENGTH(6)]}
          initialValue={formState.inputs.newPassword.value}
          errorText="Molimo unesite minimum 6 znakova."
        />
        <Input
          onInput={inputHandler}
          id="newPasswordConfirm"
          type="password"
          element="input"
          label="Potvrdi novu lozinku"
          validators={[
            VALIDATOR_MINLENGTH(6),
            VALIDATOR_CONFIRM_PASSWORD(formState.inputs.newPassword.value),
          ]}
          initialValue={formState.inputs.newPasswordConfirm.value}
          errorText="Lozinka se ne poklapa sa novom lozinkom."
        />

        <Button
          type="submit"
          disabled={
            !formState.isValid ||
            formState.inputs.newPasswordConfirm.value !==
              formState.inputs.newPassword.value
          }
        >
          PROMENI LOZINKU
        </Button>
      </form>
    </Card>
  );
};

export default ChangePassword;
