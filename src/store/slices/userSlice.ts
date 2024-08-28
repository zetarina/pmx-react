import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance, { CustomError } from "../../api/axiosInstance";
import { User } from "../../models/User";
import { ApiResponse, FetchParams } from "..";
import { City } from "../../models/City";
import { Country } from "../../models/Country";
import { Role } from "../../models/Role";

export interface UserState {
  users: User[];
  total: number;
  query: string;
  loading: boolean;
  error: CustomError | null;
}

const initialState: UserState = {
  users: [],
  total: 0,
  query: "",
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk<
  ApiResponse<{ users: User[]; total: number }>,
  FetchParams,
  { rejectValue: CustomError }
>("user/fetchUsers", async ({ page, limit, query }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(
      `/users?page=${page}&limit=${limit}&query=${query}`
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

export const fetchUserById = createAsyncThunk<
  ApiResponse<User>,
  string,
  { rejectValue: CustomError }
>("user/fetchUserById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/users/${id}`);
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

export const createUser = createAsyncThunk<
  ApiResponse<User>,
  User,
  { rejectValue: CustomError }
>("user/createUser", async (user, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/users`, user);
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

export const updateUser = createAsyncThunk<
  ApiResponse<User>,
  { id: string; user: Partial<User> },
  { rejectValue: CustomError }
>("user/updateUser", async ({ id, user }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/users/${id}`, user);
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

export const updateUserPassword = createAsyncThunk<
  ApiResponse<void>,
  { id: string; password: string },
  { rejectValue: CustomError }
>("user/updateUserPassword", async ({ id, password }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/users/${id}/update-password`, { password });
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

export const deleteUser = createAsyncThunk<
  ApiResponse<string>,
  string,
  { rejectValue: CustomError }
>("user/deleteUser", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/users/${id}`);
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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    userCreated: (state, action: PayloadAction<User>) => {
      const existingUser = state.users.find(
        (user) => user._id === action.payload._id
      );
      if (!existingUser) {
        state.users.push(action.payload);
      }
    },
    userUpdated: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(
        (user) => user._id === action.payload._id
      );
      if (index >= 0) {
        state.users[index] = action.payload;
      }
    },
    userDeleted: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user._id !== action.payload);
    },
    updateUsersByCity: (state, action: PayloadAction<City>) => {
      state.users.forEach((user) => {
        if (user.cityId === action.payload._id) {
          user.city = action.payload;
        }
      });
    },
    updateUsersByCountry: (state, action: PayloadAction<Country>) => {
      state.users.forEach((user) => {
        if (user.countryId === action.payload._id) {
          user.country = action.payload;
        }
      });
    },
    updateUsersByRole: (state, action: PayloadAction<Role>) => {
      state.users.forEach((user) => {
        if (user.roleId === action.payload._id) {
          user.role = action.payload;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<ApiResponse<{ users: User[]; total: number }>>) => {
      if (action.payload.data) {
        state.users = action.payload.data.users;
        state.total = action.payload.data.total;
      }
      state.loading = false;
    });
    builder.addCase(fetchUsers.rejected, (state, action: PayloadAction<CustomError | undefined>) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(fetchUserById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchUserById.fulfilled,
      (state, action: PayloadAction<ApiResponse<User>>) => {
        if (action.payload.data) {
          const index = state.users.findIndex(
            (user) => user._id === action.payload.data._id
          );
          if (index >= 0) {
            state.users[index] = action.payload.data;
          } else {
            state.users.push(action.payload.data);
          }
        }
        state.loading = false;
      }
    );
    builder.addCase(fetchUserById.rejected, (state, action: PayloadAction<CustomError | undefined>) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(createUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      createUser.fulfilled,
      (state, action: PayloadAction<ApiResponse<User>>) => {
        if (action.payload.data) {
          const existingUser = state.users.find(
            (user) => user._id === action.payload.data._id
          );
          if (!existingUser) {
            state.users.push(action.payload.data);
          }
        }
        state.loading = false;
      }
    );
    builder.addCase(createUser.rejected, (state, action: PayloadAction<CustomError | undefined>) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateUser.fulfilled,
      (state, action: PayloadAction<ApiResponse<User>>) => {
        if (action.payload.data) {
          const index = state.users.findIndex(
            (user) => user._id === action.payload.data._id
          );
          if (index >= 0) {
            state.users[index] = action.payload.data;
          }
        }
        state.loading = false;
      }
    );
    builder.addCase(updateUser.rejected, (state, action: PayloadAction<CustomError | undefined>) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteUser.fulfilled,
      (state, action: PayloadAction<ApiResponse<string>>) => {
        if (action.payload.data) {
          state.users = state.users.filter(
            (user) => user._id !== action.payload.data
          );
        }
        state.loading = false;
      }
    );
    builder.addCase(deleteUser.rejected, (state, action: PayloadAction<CustomError | undefined>) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
  },
});

export const {
  setQuery,
  userCreated,
  userUpdated,
  userDeleted,
  updateUsersByCity,
  updateUsersByCountry,
  updateUsersByRole,
} = userSlice.actions;
export default userSlice.reducer;
