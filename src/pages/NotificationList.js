import NotificationItem from "../shared/components/Notifications/NotificationItem";
import { useState } from "react";
import { useContext } from "react";
import { useLoaderData } from "react-router-dom";
import { AuthContext } from "../shared/context/auth-context";
import { useHttpClient } from "../shared/hooks/http-hook";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import Card from "../shared/components/UIElements/Card";
import moment from "moment/moment";
import "moment/min/locales";
import ErrorModal from "../shared/components/UIElements/ErrorModal";

const NotificationList = (props) => {
  const authCtx = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const loaderData = useLoaderData();
  const [loadedNotifs, setLoadedNotifs] = useState(loaderData);
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
        responseData.notifications.filter((notif) => notif.type !== "order")
      );
    } catch (error) {}
  };

  return (
    <div>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!loadedNotifs.length && (
        <Card className="center">
          <h5>Nemaš novih obaveštenja</h5>
        </Card>
      )}
      {loadedNotifs &&
        loadedNotifs.map((item, index) => {
          return (
            <NotificationItem
              key={item.id}
              id={item.id}
              byUser={item.byUser}
              dateCreated={moment(item.date).format("DD. MMMM Y.")}
              type={item.type}
              forJob={item.forJob}
              onDelete={deleteNotificationHandler}
            />
          );
        })}
    </div>
  );
};

export default NotificationList;

export const loader = async ({ params }) => {
  const userId = params.uid;
  const responseData = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/others/get-notifications/${userId}`
  );
  const response = await responseData.json();
  const notifications = response.notifications.filter(
    (notif) => notif.type !== "order"
  );
  return notifications;
};
