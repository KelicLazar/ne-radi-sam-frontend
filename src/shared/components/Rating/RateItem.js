import Card from "../UIElements/Card";
import "./RateItem.css";
import moment from "moment";
import "moment/min/locales";

const RateItem = (props) => {
  moment.locale("sr");
  return (
    <Card className="rate-item">
      <div className="rate-item-left">
        <div className="rate-description">
          <h5>{props.rateText}</h5>
          <div className="rating">{props.rating}</div>
        </div>

        <p className="rate-comment">{props.rateComment}</p>

        <div className="rate-date">
          <p>{moment(props.rateDate).format("DD. MMMM Y.")}</p>
        </div>
      </div>

      <div className="rate-item-right">
        <div className="user-img">
          <img
            src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
            alt="user"
          />
        </div>
        <div>
          <h5>{props.user}</h5>
        </div>
      </div>
    </Card>
  );
};

export default RateItem;
