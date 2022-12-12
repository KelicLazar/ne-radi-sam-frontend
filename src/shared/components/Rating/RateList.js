import React from "react";
import RateItem from "./RateItem";
import { Rating } from "react-simple-star-rating";
import Card from "../UIElements/Card";

import "./RateList.css";

const RateList = (props) => {
  let totalRating = 0;

  if (props.ratings.length > 0) {
    for (let i = 0; i < props.ratings.length; i++) {
      totalRating = totalRating + props.ratings[i].rate;
    }
  }
  let ratingColor;

  let fillColorArray = ["#f17a45", "#f19745", "#f1a545", "#f1b345", "#f1d045"];

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
  if (props.ratings.length === 0) {
    return (
      <React.Fragment>
        <h2 className="rate-heading">Ocene</h2>
        <Card style={{ width: "70%", margin: "auto", textAlign: "center" }}>
          <h3>Korisnik nema ni jednu ocenu</h3>
        </Card>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <h2 className="rate-heading">Ocene</h2>
      <Card className="rate-info">
        <div className="average-rating">
          <div className="rating">
            <Rating
              readonly
              allowHalfIcon
              size={30}
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
          <p>{userRating.toFixed(2)}/5</p>
        </div>

        <div className="total-rates">
          <h5>{props.ratings.length} ocena/e</h5>
        </div>
      </Card>

      {props.ratings.length > 0 &&
        props.ratings.map((rate) => {
          const rating = (
            <Rating
              readonly
              allowHalfIcon
              size={25}
              initialValue={rate.rate}
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
              emptyColor={"rgb(92, 91, 91)"}
              fillColor={fillColorArray[rate.rate - 1]}
            ></Rating>
          );

          return (
            <RateItem
              rating={rating}
              user={rate.byUser.name}
              image={rate.byUser.image}
              rateDate={rate.dateCreated}
              rateComment={rate.comment}
            />
          );
        })}
    </React.Fragment>
  );
};

export default RateList;
