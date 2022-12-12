import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
} from "react-router-dom";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import ErrorLoader from "./shared/components/UIElements/ErrorLoader";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import ToTop from "./shared/components/Navigation/ToTop";
import ScrollToTop from "./shared/components/UIElements/ScrollToTop";
import Footer from "./shared/components/Footer/Footer";

import Auth from "./pages/Auth";
import Jobs, { loader as jobsLoader } from "./pages/Jobs";
import NewJob, { loader } from "./pages/NewJob";
import UserInfo, { loader as userJobsLoader } from "./pages/UserInfo";
import MyWork, { loader as myJobsLoader } from "./pages/MyWork";
import EditUser, { loader as userLoader } from "./pages/EditUser";
import ChangePassword from "./pages/ChangePassword";
import NotificationList, {
  loader as notifLoader,
} from "./pages/NotificationList";

const tokenRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <React.Fragment>
          <ScrollToTop />
          <MainNavigation />
          <Outlet />
        </React.Fragment>
      }
    >
      <Route path="/" element={<Outlet />} errorElement={<ErrorLoader />}>
        <Route
          path="/user/:uid"
          element={<UserInfo />}
          loader={userJobsLoader}
        />
        <Route
          path="/notifications/:uid"
          element={<NotificationList />}
          loader={notifLoader}
        />
        <Route
          path="/my-jobs/:uid"
          element={<MyWork />}
          loader={myJobsLoader}
        />
        <Route
          path="/edit-profile/:uid"
          element={<EditUser />}
          loader={userLoader}
        />
        <Route
          path="/new-job"
          element={
            <div>
              <NewJob />
            </div>
          }
          loader={loader}
        />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route
          path="/edit-job/:jid"
          element={<NewJob edit />}
          loader={loader}
        />
        <Route index element={<Jobs />} loader={jobsLoader} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Route>
  )
);

const noTokenRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <React.Fragment>
          <ScrollToTop />
          <MainNavigation />
          <Outlet />
        </React.Fragment>
      }
    >
      <Route path="/" element={<Outlet />} errorElement={<ErrorLoader />}>
        <Route index element={<Jobs />} loader={jobsLoader} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/user/:uid"
          element={<UserInfo />}
          loader={userJobsLoader}
        />
        <Route path="/*" element={<Navigate to="/auth" />} />
      </Route>
    </Route>
  )
);

function App() {
  const { token, user, login, logout } = useAuth();
  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, token, user, login, logout }}
    >
      <RouterProvider router={token ? tokenRouter : noTokenRouter} />
      <ToTop></ToTop>
      <Footer />
    </AuthContext.Provider>
  );
}

export default App;
