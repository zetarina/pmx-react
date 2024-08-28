import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, { CustomError } from "../../api/axiosInstance";
import { City } from "../../models/City";
import { ApiResponse, FetchParams } from "..";
import { Country } from "../../models/Country";

export interface CityState {
  cities: City[];
  total: number;
  query: string;
  loading: boolean;
  error: CustomError | null;
}

const initialState: CityState = {
  cities: [],
  total: 0,
  query: "",
  loading: false,
  error: null,
};

export const fetchCities = createAsyncThunk<
  ApiResponse<{ cities: City[]; total: number }>,
  FetchParams,
  { rejectValue: CustomError }
>("city/fetchCities", async ({ page, limit, query }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(
      `/cities?page=${page}&limit=${limit}&query=${query}`
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

export const fetchCityById = createAsyncThunk<
  ApiResponse<City>,
  string,
  { rejectValue: CustomError }
>("city/fetchCityById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/cities/${id}`);
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

export const createCity = createAsyncThunk<
  ApiResponse<City>,
  City,
  { rejectValue: CustomError }
>("city/createCity", async (city, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/cities", city);
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

export const updateCity = createAsyncThunk<
  ApiResponse<City>,
  City,
  { rejectValue: CustomError }
>("city/updateCity", async (city, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/cities/${city._id}`, city);
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

export const deleteCity = createAsyncThunk<
  ApiResponse<string>,
  string,
  { rejectValue: CustomError }
>("city/deleteCity", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/cities/${id}`);
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

const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    cityCreated: (state, action: PayloadAction<City>) => {
      const existingCity = state.cities.find(
        (city) => city._id === action.payload._id
      );
      if (!existingCity) {
        state.cities.push(action.payload);
      }
    },
    cityUpdated: (state, action: PayloadAction<City>) => {
      const index = state.cities.findIndex(
        (city) => city._id === action.payload._id
      );
      if (index >= 0) {
        state.cities[index] = action.payload;
      }
    },
    cityDeleted: (state, action: PayloadAction<string>) => {
      state.cities = state.cities.filter((city) => city._id !== action.payload);
    },
    updateCitiesByCountry: (state, action: PayloadAction<Country>) => {
      Object.values(state.cities).forEach((city) => {
        if (city.countryId === action.payload._id) {
          city.country = action.payload;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCities.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchCities.fulfilled,
      (state, action: PayloadAction<ApiResponse<{ cities: City[]; total: number }>>) => {
        if (action.payload.data) {
          state.cities = action.payload.data.cities;
          state.total = action.payload.data.total;
        }
        state.loading = false;
      }
    );
    builder.addCase(fetchCities.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(fetchCityById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchCityById.fulfilled,
      (state, action: PayloadAction<ApiResponse<City>>) => {
        if (action.payload.data) {
          const index = state.cities.findIndex(
            (city) => city._id === action.payload.data._id
          );
          if (index >= 0) {
            state.cities[index] = action.payload.data;
          } else {
            state.cities.push(action.payload.data);
          }
        }
        state.loading = false;
      }
    );
    builder.addCase(fetchCityById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(createCity.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      createCity.fulfilled,
      (state, action: PayloadAction<ApiResponse<City>>) => {
        if (action.payload.data) {
          const existingCity = state.cities.find(
            (city) => city._id === action.payload.data._id
          );
          if (!existingCity) {
            state.cities.push(action.payload.data);
          }
        }
        state.loading = false;
      }
    );
    builder.addCase(createCity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(updateCity.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateCity.fulfilled,
      (state, action: PayloadAction<ApiResponse<City>>) => {
        if (action.payload.data) {
          const index = state.cities.findIndex(
            (city) => city._id === action.payload.data._id
          );
          if (index >= 0) {
            state.cities[index] = action.payload.data;
          }
        }
        state.loading = false;
      }
    );
    builder.addCase(updateCity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(deleteCity.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteCity.fulfilled,
      (state, action: PayloadAction<ApiResponse<string>>) => {
        if (action.payload.data) {
          state.cities = state.cities.filter(
            (city) => city._id !== action.payload.data
          );
        }
        state.loading = false;
      }
    );
    builder.addCase(deleteCity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
  },
});

export const { setQuery, cityCreated, cityUpdated, cityDeleted, updateCitiesByCountry } = citySlice.actions;
export default citySlice.reducer;
