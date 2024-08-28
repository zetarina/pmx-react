import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../models/User";
import { City } from "../../models/City";
import { Country } from "../../models/Country";
import { Role } from "../../models/Role";
import unauthenticatedAxiosInstance from "../../api/unauthenticatedAxiosInstance";
import axiosInstance, { CustomError } from "../../api/axiosInstance";
import { ApiResponse } from "..";
import Auth from "../../class/Auth";

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: CustomError | null;
  fetchingCurrentUser: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
  fetchingCurrentUser: false,
};

export const login = createAsyncThunk<
  ApiResponse<{ accessToken: string; refreshToken: string }>,
  {
    email: string;
    password: string;
    deviceId: string;
    browser: string;
    deviceName: string;
  },
  { rejectValue: CustomError }
>(
  "auth/login",
  async (
    { email, password, deviceId, browser, deviceName },
    { rejectWithValue }
  ) => {
    try {
      const response = await unauthenticatedAxiosInstance.post("/auth/login", {
        email,
        password,
        deviceId,
        browser,
        deviceName,
      });
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

export const fetchCsrfToken = createAsyncThunk<
  ApiResponse<{ csrfToken: string }>,
  void,
  { rejectValue: CustomError }
>("auth/fetchCsrfToken", async (_, { rejectWithValue }) => {
  try {
    const response = await unauthenticatedAxiosInstance.get("/auth/csrf-token");
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

export const fetchCurrentUser = createAsyncThunk<
  ApiResponse<{ user: User }>,
  void,
  { rejectValue: CustomError }
>("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/auth/me");
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

export const updateProfile = createAsyncThunk<
  ApiResponse<{ user: User }>,
  Partial<User>,
  { rejectValue: CustomError }
>("auth/updateProfile", async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put("/auth/me", userData);
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

export const logout = createAsyncThunk<
  void,
  void,
  { rejectValue: CustomError }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await unauthenticatedAxiosInstance.post("/auth/logout");
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.loading = false;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    setRefreshToken(state, action: PayloadAction<string | null>) {
      state.refreshToken = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<CustomError | null>) {
      state.error = action.payload;
    },
    setFetchingCurrentUser(state, action: PayloadAction<boolean>) {
      state.fetchingCurrentUser = action.payload;
    },
    updateRole(state, action: PayloadAction<Role>) {
      if (state.user && state.user.roleId === action.payload._id) {
        state.user.role = action.payload;
      }
    },
    updateCity(state, action: PayloadAction<City>) {
      if (state.user && state.user.cityId === action.payload._id) {
        state.user.city = action.payload;
      }
    },
    updateCountry(state, action: PayloadAction<Country>) {
      if (state.user && state.user.countryId === action.payload._id) {
        state.user.country = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload.data.accessToken;
      state.refreshToken = action.payload.data.refreshToken;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(fetchCsrfToken.fulfilled, (state, action) => {
      const csrfToken = action.payload.data.csrfToken;
      document.cookie = `csrfToken=${csrfToken}; path=/;`;
    });
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.fetchingCurrentUser = true;
      state.loading = true;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.user = action.payload.data.user;
      state.fetchingCurrentUser = false;
      state.error = null;
      state.loading = false;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.fetchingCurrentUser = false;
      state.error = action.payload as CustomError;
      state.loading = false;
    });
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.loading = false;
      state.fetchingCurrentUser = false;
      state.error = null;
    });

    builder.addCase(logout.rejected, (state, action) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.loading = false;
      state.fetchingCurrentUser = false;
      state.error = action.payload as CustomError;
    });
  },
});

export const {
  setUser,
  setToken,
  setRefreshToken,
  setLoading,
  setError,
  setFetchingCurrentUser,
  updateRole,
  updateCity,
  updateCountry,
} = authSlice.actions;
export default authSlice.reducer;
