import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import Filter from "../shared/components/Filter/Filter";
import JobList from "../shared/components/Oglasi/JobList";

const sortJobs = (jobs, sortBy) => {
  return jobs.sort((jobA, jobB) => {
    switch (sortBy) {
      case "Najstariji":
        return jobA.id > jobB.id ? 1 : -1;

      case "Najnoviji":
        return jobA.id < jobB.id ? 1 : -1;

      case "Najbolje ocenjeni":
        let totalARating = 0;
        let totalBRating = 0;
        if (jobA.creator.rating.length) {
          jobA.creator.rating.forEach((rate) => (totalARating += +rate.rate));
        }
        if (jobB.creator.rating.length) {
          jobB.creator.rating.forEach((rate) => (totalBRating += +rate.rate));
        }
        let aRating = jobA.creator.rating.length
          ? totalARating / jobA.creator.rating.length
          : 0;
        let bRating = jobB.creator.rating.length
          ? totalBRating / jobB.creator.rating.length
          : 0;
        return aRating < bRating ? 1 : -1;
      case "Najjeftiniji":
        return +jobA.price > +jobB.price ? 1 : -1;
      case "Najskuplji":
        return +jobA.price < +jobB.price ? 1 : -1;
      default:
        return jobA.id < jobB.id ? 1 : -1;
    }
  });
};

const Jobs = (props) => {
  const loadedData = useLoaderData();
  const [loadedJobs, setLoadedJobs] = useState(loadedData.jobs);

  const applyFilterHandler = (
    sortBy = "Najnoviji",
    categories = [],
    cities = []
  ) => {
    setLoadedJobs(() => {
      return sortJobs(
        loadedData.jobs
          .filter((job) => {
            return categories.length
              ? categories.includes(job.category.toUpperCase())
              : true;
          })
          .filter((job) => {
            return cities.length
              ? cities.includes(job.city.toUpperCase())
              : true;
          }),
        sortBy
      );
    });
  };

  return (
    <React.Fragment>
      <Filter
        categories={loadedData.categories}
        cities={loadedData.cities}
        onApply={applyFilterHandler}
      />
      <JobList jobs={loadedJobs} />
    </React.Fragment>
  );
};

export default Jobs;

export const loader = async () => {
  try {
    const responseData = await fetch(
      process.env.REACT_APP_BACKEND_URL + "/jobs/get-jobs"
    );
    const response = await responseData.json();
    let category = [];
    let city = [];
    response.jobs.forEach((job) => {
      category.push({
        value: job.category.toUpperCase(),
        label: job.category.toUpperCase(),
      });
      city.push({
        value: job.city.toUpperCase(),
        label: job.city.toUpperCase(),
      });
    });
    const categoryVals = category.map((item) => item.value);
    const cityVals = city.map((item) => item.value);
    return {
      jobs: response.jobs.sort((a, b) => (a.id < b.id ? 1 : -1)),
      categories: category.filter(
        ({ value }, index) => !categoryVals.includes(value, index + 1)
      ),
      cities: city.filter(
        ({ value }, index) => !cityVals.includes(value, index + 1)
      ),
    };
  } catch (error) {
    throw error;
  }
};
