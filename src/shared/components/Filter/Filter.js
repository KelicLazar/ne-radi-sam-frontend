import { useState, useRef } from "react";
import Button from "../FormElements/Button";
import Select from "react-select";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import "./Filter.css";

const bySort = [
  { value: "Najnoviji", label: "Najnoviji" },
  { value: "Najstariji", label: "Najstariji" },
  { value: "Najpopularniji", label: "Najpopularniji" },
  { value: "Najbolje ocenjeni", label: "Najbolje ocenjeni" },
  { value: "Najjeftiniji", label: "Najjeftiniji" },
  { value: "Najskuplji", label: "Najskuplji" },
];

const Filter = (props) => {
  const [showFilter, setShowFilter] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const sortByRef = useRef();
  const categoryRef = useRef();
  const cityRef = useRef();

  const toggleShow = () => {
    setShowFilter((prevValue) => !prevValue);
  };
  const applyFilterHandler = () => {
    setFiltering(true);
    props.onApply(sortByRef.current.props.value.value, categories, locations);

    setTimeout(() => {
      setShowFilter(false);
      setFiltering(false);
    }, 200);
  };
  const removeFilterHandler = () => {
    setFiltering(true);

    categoryRef.current.setValue([]);
    cityRef.current.setValue([]);
    sortByRef.current.setValue({ value: "Najnoviji", label: "Najnoviji" });
    props.onApply();

    setTimeout(() => {
      setShowFilter(false);
      setFiltering(false);
    }, 200);
  };

  const categoryChangeHandler = (event) => {
    let choosenCategories = [];
    for (const item in event) {
      choosenCategories.push(event[item].value);
    }
    setCategories(choosenCategories);
  };

  const locationChangeHandler = (event) => {
    let choosenLocations = [];
    for (const item in event) {
      choosenLocations.push(event[item].value);
    }
    setLocations(choosenLocations);
  };

  return (
    <div className="filter-cont">
      {filtering && <LoadingSpinner asOverlay />}
      <p className="filter-toggler" onClick={toggleShow}>
        <i className="uil uil-filter"></i>/<i className="uil uil-sort"></i>
      </p>
      <div
        className={`filter ${showFilter ? "filter--opened" : "filter--closed"}`}
      >
        <div className="action-buttons">
          <Button
            onClick={removeFilterHandler}
            className="filter-button"
            inverse
          >
            ❌ Poništi filtere
          </Button>
          <Button onClick={applyFilterHandler} className="filter-button">
            Primeni filtere
          </Button>
        </div>
        <div className="filter-items">
          <div className="filter-item">
            <label>Filtriraj po kategoriji</label>
            <Select
              ref={categoryRef}
              onChange={categoryChangeHandler}
              isMulti
              isClearable
              className="filter-option"
              options={props.categories}
            ></Select>
          </div>

          <div className="filter-item">
            <label>Filtriraj po lokaciji</label>
            <Select
              ref={cityRef}
              onChange={locationChangeHandler}
              isMulti
              isClearable
              className="filter-option"
              options={props.cities}
            ></Select>
          </div>
          <div className="filter-item">
            <label>Sortiraj...</label>
            <Select
              ref={sortByRef}
              className="filter-option"
              options={bySort}
              maxMenuHeight="100%"
              defaultValue={bySort[0]}
            ></Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
