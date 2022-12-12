import { useContext, useState } from "react";
import { useLoaderData } from "react-router-dom";
import NotificationItem from "../shared/components/Notifications/NotificationItem";
import Card from "../shared/components/UIElements/Card";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../shared/context/auth-context";
import { useHttpClient } from "../shared/hooks/http-hook";
import moment from "moment/moment";
import "moment/min/locales";
import ErrorModal from "../shared/components/UIElements/ErrorModal";

const MyWork = () => {
  const loaderData = useLoaderData();
  const [loadedNotifs, setLoadedNotifs] = useState(loaderData);
  const authCtx = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  moment.locale("sr");

  const deleteNotificationHandler = async (notifId) => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/others/delete-notification/${notifId}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + authCtx.token }
      );
      setLoadedNotifs(
        responseData.notifications.filter((notif) => notif.type === "order")
      );
    } catch (error) {}
  };

  if (!loadedNotifs.length) {
    return (
      <Card className="center">
        <h5>Nemaš ugovorenih poslova</h5>
      </Card>
    );
  }

  return (
    <div>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />

      {loadedNotifs &&
        loadedNotifs.map((item, index) => {
          return (
            <NotificationItem
              key={index}
              id={item.id}
              byUser={item.byUser}
              dateCreated={moment(item.date).format("DD. MMMM Y.")}
              forJob={item.forJob}
              type={item.type}
              onDelete={deleteNotificationHandler}
            />
          );
        })}
    </div>
  );
};

export default MyWork;

export const loader = async ({ params }) => {
  const userId = params.uid;
  const responseData = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/others/get-notifications/${userId}`
  );
  const response = await responseData.json();

  const orders = response.notifications.filter((item) => item.type === "order");
  return orders;
};
