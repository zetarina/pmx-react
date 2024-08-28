import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ExchangeRate } from "../../models/ExchangeRate";
import {
  updateExchangeRate,
  createExchangeRate,
} from "../../store/slices/exchangeRateSlice";
import { AppDispatch } from "../../store";

interface ExchangeRateFormProps {
  currentExchangeRate?: ExchangeRate;
  onSuccess: () => void;
}

const ExchangeRateForm: React.FC<ExchangeRateFormProps> = ({
  currentExchangeRate,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [currencyPair, setCurrencyPair] = useState(
    currentExchangeRate ? currentExchangeRate.currencyPair : ""
  );
  const [rate, setRate] = useState(
    currentExchangeRate ? currentExchangeRate.rate : 0
  );
  const [timestamp, setTimestamp] = useState(
    currentExchangeRate
      ? currentExchangeRate.timestamp.toISOString().substring(0, 10)
      : new Date().toISOString().substring(0, 10)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newExchangeRate: ExchangeRate = {
      currencyPair,
      rate,
      timestamp: new Date(timestamp),
    };
    try {
      if (currentExchangeRate && currentExchangeRate._id) {
        const result = await dispatch(
          updateExchangeRate({
            ...newExchangeRate,
            _id: currentExchangeRate._id,
          })
        );
        if (updateExchangeRate.fulfilled.match(result)) {
          toast.success("Exchange rate updated successfully");
          onSuccess();
        } else if (updateExchangeRate.rejected.match(result)) {
          toast.error("Failed to update exchange rate");
        }
      } else {
        const createResult = await dispatch(
          createExchangeRate(newExchangeRate)
        );
        if (createExchangeRate.fulfilled.match(createResult)) {
          toast.success("Exchange rate created successfully");
          onSuccess();
        } else if (createExchangeRate.rejected.match(createResult)) {
          toast.error("Failed to create exchange rate");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  useEffect(() => {
    if (currentExchangeRate) {
      setCurrencyPair(currentExchangeRate.currencyPair);
      setRate(currentExchangeRate.rate);
      setTimestamp(
        currentExchangeRate.timestamp.toISOString().substring(0, 10)
      );
    }
  }, [currentExchangeRate]);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
      <div className="mb-4">
        <label
          htmlFor="currencyPair"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Currency Pair:
        </label>
        <input
          type="text"
          id="currencyPair"
          value={currencyPair}
          onChange={(e) => setCurrencyPair(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="rate"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Rate:
        </label>
        <input
          type="number"
          step="0.0001"
          id="rate"
          value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value))}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="timestamp"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Date:
        </label>
        <input
          type="date"
          id="timestamp"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {currentExchangeRate ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default ExchangeRateForm;
