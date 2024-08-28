import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { AppDispatch, RootState } from "../store";
import { fetchCurrentUser } from "../store/slices/authSlice";
import Loading from "../components/Loading";
import Auth from "../class/Auth";
import socketService from "../class/socketService";

interface SessionLoaderProps {
  children: React.ReactNode;
}

const SessionLoader: React.FC<SessionLoaderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, loading, fetchingCurrentUser } = useSelector(
    (state: RootState) => state.auth
  );

  const previousToken = useRef<string | null>(null);
  const hasFetchedCurrentUser = useRef(false);

  // Routes that require authentication checks
  const protectedRoutes = ["/dashboard", "/login"];

  useEffect(() => {
    const initializeSession = async () => {
      const requiresAuth = protectedRoutes.some(route =>
        location.pathname.startsWith(route)
      );

      if (requiresAuth) {
        if (
          token &&
          !(loading && fetchingCurrentUser) &&
          (previousToken.current !== token || !hasFetchedCurrentUser.current)
        ) {
          hasFetchedCurrentUser.current = true;
          previousToken.current = token;
          console.log('Fetching CurrentUser');
          const success = await Auth.fetchCurrentUser();
          console.log('CurrentUser Fetched', success);
          if (success) {
            socketService.connect();
          } else {
            console.log('Navigating to login');
            navigate("/login");
          }
        } else if (!token && !loading) {
          navigate("/login");
        }
      }
    };

    initializeSession();

    return () => {
      if (socketService.socket) {
        socketService.disconnect();
      }
    };
  }, [token, loading, fetchingCurrentUser, navigate, location.pathname]);

  if ((loading || fetchingCurrentUser) && token) {
    return <Loading text="Loading Session" />;
  }

  return <>{children}</>;
};

export default SessionLoader;
