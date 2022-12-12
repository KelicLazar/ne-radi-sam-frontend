import { useNavigate, useParams } from "react-router-dom";
import Card from "../UIElements/Card";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import JobItem from "./JobItem";
import "./JobList.css";
import moment from "moment/moment";
import "moment/min/locales";

const JobList = (props) => {
  const navigate = useNavigate();
  moment.locale("sr");
  const params = useParams();

  if (!props.jobs.length) {
    return (
      <Card style={{ width: "70%", margin: "auto", textAlign: "center" }}>
        {!params.uid ? (
          <h3>Nema poslova koji odgovaraju odabranim filterima.</h3>
        ) : (
          <h3>Nema objavljenih poslova</h3>
        )}
      </Card>
    );
  }

  return (
    <div className="job-list">
      {props.isLoading && <LoadingSpinner asOverlay />}

      {props.jobs.map((job, index) => {
        return (
          <JobItem
            id={job.id}
            key={job.id}
            title={job.title}
            category={job.category}
            city={job.city}
            description={job.description}
            price={job.price}
            phone={job.phone}
            date={moment(job.dateCreated).format("DD. MMMM Y.")}
            creatorId={job.creator._id}
            name={job.creator.name}
            email={job.creator.email}
            image={job.creator.image}
            ratings={job.creator.rating}
            onEdit={() => {
              navigate(`/edit-job/${job._id}`);
            }}
          />
        );
      })}
    </div>
  );
};

export default JobList;
