import React from "react";
import Input from "../shared/components/FormElements/Input";
import Card from "../shared/components/UIElements/Card";
import CreatableSelect from "react-select/creatable";
import Button from "../shared/components/FormElements/Button";
import { useForm } from "../shared/hooks/form-hook";
import { VALIDATOR_REQUIRE } from "../shared/components/utils/validators";
import { useHttpClient } from "../shared/hooks/http-hook";

import "./NewJob.css";
import { useContext } from "react";
import { AuthContext } from "../shared/context/auth-context";
import { useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import ErrorModal from "../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";

//CUSTOM STYLES FORM CREATABLE SELECT COMPONENT
const customTheme = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: "brown",
    primary25: "#ccc",
    primary50: "rgba(165, 42, 42, 0.733)",
    primary75: "brown",
  },
});
const customStyles = {
  singleValue: (provided, state) => ({
    ...provided,
    fontWeight: "500",
    color: state.hasValue ? "brown" : "#ccc",
  }),
  container: (provided, state) => ({
    ...provided,
    color: "brown",
    borderColor: "green",
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    color: "brown",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    fontWeight: "500",
    color: state.hasValue ? "brown" : "#ccc",
  }),
  menuList: (provided, state) => ({
    ...provided,
    border: "2px solid brown",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? "brown" : "#ccc",
  }),
  clearIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? "brown" : "#ccc",
  }),
  indicatorSeparator: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "brown" : "#ccc",
  }),
  input: (provided, state) => ({
    ...provided,
    color: "brown",
    fontWeight: "500",
  }),
};

//MY COMPONENT
const NewJob = (props) => {
  let loadedData = useLoaderData();
  const loadedCategories = loadedData.categories;
  const loadedCities = loadedData.cities;
  const [formState, inputHandler] = useForm({}, false);
  const jobId = useParams().jid;
  const job = jobId ? loadedData.job : null;
  const [category, setCategory] = useState(loadedData?.job?.category || null);
  const [city, setCity] = useState(loadedData?.job?.city || null);
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const authCtx = useContext(AuthContext);

  const edit = props.edit;

  const submitHandler = async (event) => {
    event.preventDefault();
    const { cena, title, description, phone } = formState.inputs;

    const reqBody = JSON.stringify({
      title: title.value,
      category: category,
      city: city,
      description: description.value,
      phone: phone.value,
      price: cena.value,
    });

    let url = props.edit
      ? `${process.env.REACT_APP_BACKEND_URL}/jobs/update-job/${jobId}`
      : process.env.REACT_APP_BACKEND_URL + "/jobs/new-job";
    let method = props.edit ? "PATCH" : "POST";
    try {
      await sendRequest(url, method, reqBody, {
        Authorization: "Bearer " + authCtx.token,
        "Content-Type": "application/json",
      });

      navigate("/", { replace: true });
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="new-job">
        {isLoading && <LoadingSpinner asOverlay />}
        <div className="new-job-heading">
          <h3>{props.edit ? "Izmeni posao" : "Novi posao"}</h3>
        </div>
        <form onSubmit={submitHandler} className="new-job-form">
          <Input
            onInput={inputHandler}
            id="title"
            type="text"
            element="input"
            validators={[VALIDATOR_REQUIRE()]}
            label="Naslov"
            errorText="Molimo unesite naslov."
            initialValue={edit && job.title}
            initialValid={edit}
          />

          <div className="category">
            <CreatableSelect
              onChange={(value, action) => {
                if (value) {
                  setCategory(value.value);
                } else {
                  setCategory(null);
                }
              }}
              isClearable
              placeholder="izaberi kategoriju"
              options={loadedCategories}
              MenuHeight="100%"
              theme={customTheme}
              className="category-select"
              styles={customStyles}
              menuColor="green"
              defaultValue={() => {
                if (props.edit) {
                  return {
                    value: loadedData.job.category,
                    label: loadedData.job.category,
                  };
                }
              }}
            ></CreatableSelect>
          </div>
          <div className="category">
            <CreatableSelect
              onChange={(value, action) => {
                if (value) {
                  setCity(value.value);
                } else {
                  setCity(null);
                }
              }}
              isClearable
              placeholder={
                <>
                  <i className="uil uil-map-marker-alt"></i>izaberi grad
                </>
              }
              options={loadedCities}
              MenuHeight="100%"
              theme={customTheme}
              className="category-select"
              styles={customStyles}
              menuColor="green"
              defaultValue={() => {
                if (props.edit) {
                  return {
                    value: loadedData.job.city,
                    label: loadedData.job.city,
                  };
                }
              }}
            ></CreatableSelect>
          </div>
          <Input
            onInput={inputHandler}
            id="description"
            validators={[VALIDATOR_REQUIRE()]}
            label="Opis"
            errorText="Molimo unesite opis."
            initialValue={edit && job.description}
            initialValid={edit}
          />

          <Input
            onInput={inputHandler}
            id="phone"
            type="tel"
            element="input"
            validators={[VALIDATOR_REQUIRE()]}
            label="Kontakt"
            errorText="Molimo unesite kontakt broj."
            initialValue={edit && job.phone}
            initialValid={edit}
          />
          <Input
            onInput={inputHandler}
            id="cena"
            type="number"
            element="input"
            validators={[VALIDATOR_REQUIRE()]}
            label="Cena rada(u Eurima)"
            errorText="Molimo unesite cenu."
            initialValue={edit && job.price}
            initialValid={edit}
          />
          <div className="new-job-footer">
            <Button
              disabled={!formState.isValid || !category || !city}
              type="submit"
            >
              {props.edit ? "Izmeni Oglas" : "Postavi Oglas"}
            </Button>
          </div>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default NewJob;

export const loader = async ({ params }) => {
  const jobId = params.jid;
  let jobData;
  if (!!jobId) {
    try {
      jobData = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/jobs/edit-job/${jobId}`
      ).then((response) => response.json());
    } catch (error) {
      throw error;
    }
  }

  let responseData;

  try {
    responseData = await fetch(
      process.env.REACT_APP_BACKEND_URL + "/jobs/get-jobs"
    ).then((response) => response.json());
  } catch (error) {
    throw error;
  }
  let category = [];
  let city = [];
  responseData.jobs.forEach((job) => {
    category.push({ value: job.category, label: job.category });
    city.push({ value: job.city, label: job.city });
  });
  const categoryVals = category.map((item) => item.value);
  const cityVals = city.map((item) => item.value);

  if (!!jobId) {
    return {
      job: jobData.job,
      categories: category.filter(
        ({ value }, index) => !categoryVals.includes(value, index + 1)
      ),
      cities: city.filter(
        ({ value }, index) => !cityVals.includes(value, index + 1)
      ),
    };
  } else {
    return {
      categories: category.filter(
        ({ value }, index) => !categoryVals.includes(value, index + 1)
      ),
      cities: city.filter(
        ({ value }, index) => !cityVals.includes(value, index + 1)
      ),
    };
  }
};
