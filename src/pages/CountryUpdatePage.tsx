import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import CountryForm from "../components/Forms/CountryForm";
import { Country } from "../models/Country";
import { RootState, AppDispatch } from "../store";
import { fetchCountryById } from "../store/slices/countrySlice";
import Page from "../components/Page";
import Loading from "../components/Loading";
import ErrorComponent from "../components/ErrorComponent";

const CountryUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [country, setCountry] = useState<Country | undefined>(undefined);
  const { countries, loading, error } = useSelector(
    (state: RootState) => state.countries
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountry = async () => {
      const foundCountry = countries.find((c) => c._id === id);
      if (foundCountry) {
        setCountry(foundCountry);
      } else {
        const response = await dispatch(fetchCountryById(id!));
        if (fetchCountryById.fulfilled.match(response)) {
          setCountry(response.payload.data);
        }
      }
    };

    fetchCountry();
  }, [id, countries, dispatch]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (!country) {
    const notFoundError = {
      message: "Country not found",
      name: "NotFoundError",
      status: 404,
      code: "COUNTRY_NOT_FOUND",
    };
    return <ErrorComponent error={notFoundError} />;
  }

  return (
    <Page title="Update Country">
      <CountryForm
        currentCountry={country}
        onSuccess={() => navigate("/dashboard/country")}
      />
    </Page>
  );
};

export default CountryUpdatePage;
