import React, { useEffect, useReducer } from "react";
import { validate } from "../utils/validators";
import "./Input.css";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };

    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };

    case "FOCUS":
      return {
        ...state,
        isTouched: false,
      };

    default:
      break;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isValid: props.initialValid || false,
    isTouched: false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [onInput, id, value, isValid]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };
  const touchHandler = (event) => {
    dispatch({
      type: "TOUCH",
    });
  };

  const focusHandler = (event) => {
    dispatch({ type: "FOCUS" });
  };

  const element =
    props.element === "input" ? (
      <input
        disabled={props.disabled}
        title={props.title}
        onChange={changeHandler}
        onBlur={touchHandler}
        onFocus={focusHandler}
        pattern={props.pattern}
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        value={inputState.value}
      />
    ) : (
      <textarea
        disabled={props.disabled}
        className={`${props.noResize && "non-resizable"}`}
        onChange={changeHandler}
        onBlur={touchHandler}
        onFocus={focusHandler}
        id={props.id}
        rows={props.rows || 3}
        value={inputState.value}
      />
    );
  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      {element}
      <label htmlFor={props.id}>{props.label}</label>

      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
