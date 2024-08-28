import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, { CustomError } from "../../api/axiosInstance";
import { ExchangeRate } from "../../models/ExchangeRate";
import { ApiResponse, FetchParams } from "..";

export interface ExchangeRateState {
  exchangeRates: ExchangeRate[];
  total: number;
  query: string;
  loading: boolean;
  error: CustomError | null;
}

const initialState: ExchangeRateState = {
  exchangeRates: [],
  total: 0,
  query: "",
  loading: false,
  error: null,
};

export const fetchExchangeRates = createAsyncThunk<
  ApiResponse<{ exchangeRates: ExchangeRate[]; total: number }>,
  FetchParams,
  { rejectValue: CustomError }
>("exchangeRate/fetchExchangeRates", async ({ page, limit, query }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(
      `/exchange-rates?page=${page}&limit=${limit}&query=${query}`
    );
    return { data: response.data, status: response.status };
  } catch (error: any) {
    const customError: CustomError = {
      message: error.message,
      name: error.name,
      status: error.response?.status,
      code: error.code,
    };
    return rejectWithValue(customError);
  }
});

export const fetchExchangeRateById = createAsyncThunk<
  ApiResponse<ExchangeRate>,
  string,
  { rejectValue: CustomError }
>("exchangeRate/fetchExchangeRateById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/exchange-rates/${id}`);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    const customError: CustomError = {
      message: error.message,
      name: error.name,
      status: error.response?.status,
      code: error.code,
    };
    return rejectWithValue(customError);
  }
});

export const createExchangeRate = createAsyncThunk<
  ApiResponse<ExchangeRate>,
  ExchangeRate,
  { rejectValue: CustomError }
>(
  "exchangeRate/createExchangeRate",
  async (exchangeRate, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/exchange-rates",
        exchangeRate
      );
      return { data: response.data, status: response.status };
    } catch (error: any) {
      const customError: CustomError = {
        message: error.message,
        name: error.name,
        status: error.response?.status,
        code: error.code,
      };
      return rejectWithValue(customError);
    }
  }
);

export const updateExchangeRate = createAsyncThunk<
  ApiResponse<ExchangeRate>,
  ExchangeRate,
  { rejectValue: CustomError }
>(
  "exchangeRate/updateExchangeRate",
  async (exchangeRate, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/exchange-rates/${exchangeRate._id}`,
        exchangeRate
      );
      return { data: response.data, status: response.status };
    } catch (error: any) {
      const customError: CustomError = {
        message: error.message,
        name: error.name,
        status: error.response?.status,
        code: error.code,
      };
      return rejectWithValue(customError);
    }
  }
);

export const deleteExchangeRate = createAsyncThunk<
  ApiResponse<string>,
  string,
  { rejectValue: CustomError }
>("exchangeRate/deleteExchangeRate", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/exchange-rates/${id}`);
    return { data: id, status: 200 };
  } catch (error: any) {
    const customError: CustomError = {
      message: error.message,
      name: error.name,
      status: error.response?.status,
      code: error.code,
    };
    return rejectWithValue(customError);
  }
});

const exchangeRateSlice = createSlice({
  name: "exchangeRate",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    exchangeRateCreated: (state, action: PayloadAction<ExchangeRate>) => {
      const existingRate = state.exchangeRates.find(
        (exchangeRate) => exchangeRate._id === action.payload._id
      );
      if (!existingRate) {
        state.exchangeRates.push(action.payload);
      }
    },
    exchangeRateUpdated: (state, action: PayloadAction<ExchangeRate>) => {
      const index = state.exchangeRates.findIndex(
        (exchangeRate) => exchangeRate._id === action.payload._id
      );
      if (index >= 0) {
        state.exchangeRates[index] = action.payload;
      }
    },
    exchangeRateDeleted: (state, action: PayloadAction<string>) => {
      state.exchangeRates = state.exchangeRates.filter(
        (exchangeRate) => exchangeRate._id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchExchangeRates.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchExchangeRates.fulfilled, (state, action: PayloadAction<ApiResponse<{ exchangeRates: ExchangeRate[]; total: number }>>) => {
      if (action.payload.data) {
        state.exchangeRates = action.payload.data.exchangeRates;
        state.total = action.payload.data.total;
      }
      state.loading = false;
    });
    builder.addCase(fetchExchangeRates.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(fetchExchangeRateById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchExchangeRateById.fulfilled,
      (state, action: PayloadAction<ApiResponse<ExchangeRate>>) => {
        if (action.payload.data) {
          const index = state.exchangeRates.findIndex(
            (exchangeRate) => exchangeRate._id === action.payload.data._id
          );
          if (index >= 0) {
            state.exchangeRates[index] = action.payload.data;
          } else {
            state.exchangeRates.push(action.payload.data);
          }
        }
        state.loading = false;
      }
    );
    builder.addCase(fetchExchangeRateById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(createExchangeRate.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      createExchangeRate.fulfilled,
      (state, action: PayloadAction<ApiResponse<ExchangeRate>>) => {
        if (action.payload.data) {
          const existingRate = state.exchangeRates.find(
            (exchangeRate) => exchangeRate._id === action.payload.data._id
          );
          if (!existingRate) {
            state.exchangeRates.push(action.payload.data);
          }
        }
        state.loading = false;
      }
    );
    builder.addCase(createExchangeRate.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(updateExchangeRate.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateExchangeRate.fulfilled,
      (state, action: PayloadAction<ApiResponse<ExchangeRate>>) => {
        if (action.payload.data) {
          const index = state.exchangeRates.findIndex(
            (exchangeRate) => exchangeRate._id === action.payload.data._id
          );
          if (index >= 0) {
            state.exchangeRates[index] = action.payload.data;
          }
        }
        state.loading = false;
      }
    );
    builder.addCase(updateExchangeRate.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(deleteExchangeRate.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteExchangeRate.fulfilled,
      (state, action: PayloadAction<ApiResponse<string>>) => {
        if (action.payload.data) {
          state.exchangeRates = state.exchangeRates.filter(
            (exchangeRate) => exchangeRate._id !== action.payload.data
          );
        }
        state.loading = false;
      }
    );
    builder.addCase(deleteExchangeRate.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
  },
});

export const { setQuery, exchangeRateCreated, exchangeRateUpdated, exchangeRateDeleted } =
  exchangeRateSlice.actions;
export default exchangeRateSlice.reducer;
