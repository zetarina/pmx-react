import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import CityForm from "../components/Forms/CityForm";
import { City } from "../models/City";
import { RootState, AppDispatch } from "../store";
import { fetchCityById } from "../store/slices/citySlice";
import Page from "../components/Page";
import Loading from "../components/Loading";
import ErrorComponent from "../components/ErrorComponent";

const CityUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [city, setCity] = useState<City | undefined>(undefined);
  const { cities, loading, error } = useSelector(
    (state: RootState) => state.cities
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCity = async () => {
      const foundCity = cities.find((c) => c._id === id);
      if (foundCity) {
        setCity(foundCity);
      } else {
        const response = await dispatch(fetchCityById(id!));
        if (fetchCityById.fulfilled.match(response)) {
          setCity(response.payload.data);
        }
      }
    };

    fetchCity();
  }, [id, cities, dispatch]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (!city) {
    const notFoundError = {
      message: "City not found",
      name: "NotFoundError",
      status: 404,
      code: "CITY_NOT_FOUND",
    };
    return <ErrorComponent error={notFoundError} />;
  }

  return (
    <Page title="Update City">
      <CityForm
        currentCity={city}
        onSuccess={() => navigate("/dashboard/city")}
      />
    </Page>
  );
};

export default CityUpdatePage;
