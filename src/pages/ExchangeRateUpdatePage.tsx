import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import ExchangeRateForm from "../components/Forms/ExchangeRateForm";
import { ExchangeRate } from "../models/ExchangeRate";
import { RootState, AppDispatch } from "../store";
import { fetchExchangeRateById } from "../store/slices/exchangeRateSlice";
import Page from "../components/Page";
import Loading from "../components/Loading";
import ErrorComponent from "../components/ErrorComponent";

const ExchangeRateUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | undefined>(
    undefined
  );
  const { exchangeRates, loading, error } = useSelector(
    (state: RootState) => state.exchangeRate
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExchangeRate = async () => {
      const foundExchangeRate = exchangeRates.find((e) => e._id === id);
      if (foundExchangeRate) {
        setExchangeRate(foundExchangeRate);
      } else {
        const response = await dispatch(fetchExchangeRateById(id!));
        if (fetchExchangeRateById.fulfilled.match(response)) {
          setExchangeRate(response.payload.data);
        }
      }
    };

    fetchExchangeRate();
  }, [id, exchangeRates, dispatch]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (!exchangeRate) {
    const notFoundError = {
      message: "Exchange Rate not found",
      name: "NotFoundError",
      status: 404,
      code: "EXCHANGE_RATE_NOT_FOUND",
    };
    return <ErrorComponent error={notFoundError} />;
  }

  return (
    <Page title="Update Exchange Rate">
      <ExchangeRateForm
        currentExchangeRate={exchangeRate}
        onSuccess={() => navigate("/dashboard/exchange-rate")}
      />
    </Page>
  );
};

export default ExchangeRateUpdatePage;
