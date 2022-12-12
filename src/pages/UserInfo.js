import { useLoaderData } from "react-router-dom";
import JobList from "../shared/components/Oglasi/JobList";
import RateList from "../shared/components/Rating/RateList";

const UserInfo = (props) => {
  const userData = useLoaderData();

  return (
    <>
      <h2 className="rate-heading">Poslovi korisnika {userData.name}</h2>
      <JobList info jobs={userData.jobs} />
      <RateList ratings={userData.rating} />
    </>
  );
};

export default UserInfo;

export const loader = async ({ params }) => {
  const userId = params.uid;

  try {
    const responseData = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/users/user-info/${userId}`
    );
    const response = await responseData.json();
    return response.userData;
  } catch (error) {}
};
