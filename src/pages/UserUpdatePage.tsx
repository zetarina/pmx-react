import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import UserForm from "../components/Forms/UserForm";
import { User } from "../models/User";
import { RootState, AppDispatch } from "../store";
import { fetchUserById } from "../store/slices/userSlice";
import Page from "../components/Page";
import Loading from "../components/Loading";
import ErrorComponent from "../components/ErrorComponent";

const UserUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | undefined>(undefined);
  const { users, loading, error } = useSelector(
    (state: RootState) => state.users
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const foundUser = users.find((u) => u._id === id);
      if (foundUser) {
        setUser(foundUser);
      } else {
        const response = await dispatch(fetchUserById(id!));
        if (fetchUserById.fulfilled.match(response)) {
          setUser(response.payload.data);
        }
      }
    };

    fetchUser();
  }, [id, users, dispatch]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (!user) {
    const notFoundError = {
      message: "User not found",
      name: "NotFoundError",
      status: 404,
      code: "USER_NOT_FOUND",
    };
    return <ErrorComponent error={notFoundError} />;
  }

  return (
    <Page title="Update User">
      <UserForm
        currentUser={user}
        onSuccess={() => navigate("/dashboard/user")}
      />
    </Page>
  );
};

export default UserUpdatePage;
