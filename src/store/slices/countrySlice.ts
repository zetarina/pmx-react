import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, { CustomError } from "../../api/axiosInstance";
import { Country } from "../../models/Country";
import { ApiResponse, FetchParams } from "..";

export interface CountryState {
  countries: Country[];
  total: number;
  query: string;
  loading: boolean;
  error: CustomError | null;
}

const initialState: CountryState = {
  countries: [],
  total: 0,
  query: "",
  loading: false,
  error: null,
};

export const fetchCountries = createAsyncThunk<
  ApiResponse<{ countries: Country[]; total: number }>,
  FetchParams,
  { rejectValue: CustomError }
>("country/fetchCountries", async ({ page, limit, query }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(
      `/countries?page=${page}&limit=${limit}&query=${query}`
    );
    return { data: response.data, status: response.status };
  } catch (error: any) {
    const customError: CustomError = {
      message: error.message,
      name: error.name,
      status: error.status,
      code: error.code,
    };
    return rejectWithValue(customError);
  }
});

export const fetchCountryById = createAsyncThunk<
  ApiResponse<Country>,
  string,
  { rejectValue: CustomError }
>("country/fetchCountryById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/countries/${id}`);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    const customError: CustomError = {
      message: error.message,
      name: error.name,
      status: error.status,
      code: error.code,
    };
    return rejectWithValue(customError);
  }
});

export const createCountry = createAsyncThunk<
  ApiResponse<Country>,
  Country,
  { rejectValue: CustomError }
>("country/createCountry", async (country, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/countries", country);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    const customError: CustomError = {
      message: error.message,
      name: error.name,
      status: error.status,
      code: error.code,
    };
    return rejectWithValue(customError);
  }
});

export const updateCountry = createAsyncThunk<
  ApiResponse<Country>,
  Country,
  { rejectValue: CustomError }
>("country/updateCountry", async (country, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(
      `/countries/${country._id}`,
      country
    );
    return { data: response.data, status: response.status };
  } catch (error: any) {
    const customError: CustomError = {
      message: error.message,
      name: error.name,
      status: error.status,
      code: error.code,
    };
    return rejectWithValue(customError);
  }
});

export const deleteCountry = createAsyncThunk<
  ApiResponse<string>,
  string,
  { rejectValue: CustomError }
>("country/deleteCountry", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/countries/${id}`);
    return { data: id, status: 200 };
  } catch (error: any) {
    const customError: CustomError = {
      message: error.message,
      name: error.name,
      status: error.status,
      code: error.code,
    };
    return rejectWithValue(customError);
  }
});

const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    countryCreated: (state, action: PayloadAction<Country>) => {
      const existingCountry = state.countries.find(
        (country) => country._id === action.payload._id
      );
      if (!existingCountry) {
        state.countries.push(action.payload);
      }
    },
    countryUpdated: (state, action: PayloadAction<Country>) => {
      const index = state.countries.findIndex(
        (country) => country._id === action.payload._id
      );
      if (index >= 0) {
        state.countries[index] = action.payload;
      }
    },
    countryDeleted: (state, action: PayloadAction<string>) => {
      state.countries = state.countries.filter(
        (country) => country._id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCountries.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCountries.fulfilled, (state, action: PayloadAction<ApiResponse<{ countries: Country[]; total: number }>>) => {
      if (action.payload.data) {
        state.countries = action.payload.data.countries;
        state.total = action.payload.data.total;
      }
      state.loading = false;
    });
    builder.addCase(fetchCountries.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(fetchCountryById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchCountryById.fulfilled,
      (state, action: PayloadAction<ApiResponse<Country>>) => {
        if (action.payload.data) {
          const index = state.countries.findIndex(
            (country) => country._id === action.payload.data._id
          );
          if (index >= 0) {
            state.countries[index] = action.payload.data;
          } else {
            state.countries.push(action.payload.data);
          }
        }
        state.loading = false;
      }
    );
    builder.addCase(fetchCountryById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(createCountry.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      createCountry.fulfilled,
      (state, action: PayloadAction<ApiResponse<Country>>) => {
        if (action.payload.data) {
          const existingCountry = state.countries.find(
            (country) => country._id === action.payload.data._id
          );
          if (!existingCountry) {
            state.countries.push(action.payload.data);
          }
        }
        state.loading = false;
      }
    );
    builder.addCase(createCountry.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(updateCountry.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateCountry.fulfilled,
      (state, action: PayloadAction<ApiResponse<Country>>) => {
        if (action.payload.data) {
          const index = state.countries.findIndex(
            (country) => country._id === action.payload.data._id
          );
          if (index >= 0) {
            state.countries[index] = action.payload.data;
          }
        }
        state.loading = false;
      }
    );
    builder.addCase(updateCountry.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(deleteCountry.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteCountry.fulfilled,
      (state, action: PayloadAction<ApiResponse<string>>) => {
        if (action.payload.data) {
          state.countries = state.countries.filter(
            (country) => country._id !== action.payload.data
          );
        }
        state.loading = false;
      }
    );
    builder.addCase(deleteCountry.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
  },
});

export const { setQuery, countryCreated, countryUpdated, countryDeleted } =
  countrySlice.actions;
export default countrySlice.reducer;
