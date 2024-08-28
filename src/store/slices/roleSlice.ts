import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance, { CustomError } from "../../api/axiosInstance";
import { Role } from "../../models/Role";
import { ApiResponse, FetchParams } from "..";

export interface RoleState {
  roles: Role[];
  total: number;
  query: string;
  loading: boolean;
  error: CustomError | null;
}

const initialState: RoleState = {
  roles: [],
  total: 0,
  query: "",
  loading: false,
  error: null,
};

export const fetchRoles = createAsyncThunk<
  ApiResponse<{ roles: Role[]; total: number }>,
  FetchParams,
  { rejectValue: CustomError }
>("role/fetchRoles", async ({ page, limit, query }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(
      `/roles?page=${page}&limit=${limit}&query=${query}`
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

export const fetchRoleById = createAsyncThunk<
  ApiResponse<Role>,
  string,
  { rejectValue: CustomError }
>("role/fetchRoleById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/roles/${id}`);
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

export const createRole = createAsyncThunk<
  ApiResponse<Role>,
  Role,
  { rejectValue: CustomError }
>("role/createRole", async (role, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/roles", role);
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

export const updateRole = createAsyncThunk<
  ApiResponse<Role>,
  Role,
  { rejectValue: CustomError }
>("role/updateRole", async (role, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/roles/${role._id}`, role);
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

export const deleteRole = createAsyncThunk<
  ApiResponse<string>,
  string,
  { rejectValue: CustomError }
>("role/deleteRole", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/roles/${id}`);
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

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    roleCreated: (state, action: PayloadAction<Role>) => {
      const existingRole = state.roles.find(
        (role) => role._id === action.payload._id
      );
      if (!existingRole) {
        state.roles.push(action.payload);
      }
    },
    roleUpdated: (state, action: PayloadAction<Role>) => {
      const index = state.roles.findIndex(
        (role) => role._id === action.payload._id
      );
      if (index >= 0) {
        state.roles[index] = action.payload;
      }
    },
    roleDeleted: (state, action: PayloadAction<string>) => {
      state.roles = state.roles.filter((role) => role._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRoles.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchRoles.fulfilled,
      (state, action: PayloadAction<ApiResponse<{ roles: Role[]; total: number }>>) => {
        if (action.payload.data) {
          state.roles = action.payload.data.roles;
          state.total = action.payload.data.total;
        }
        state.loading = false;
      }
    );
    builder.addCase(fetchRoles.rejected, (state, action: PayloadAction<CustomError | undefined>) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(fetchRoleById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchRoleById.fulfilled,
      (state, action: PayloadAction<ApiResponse<Role>>) => {
        if (action.payload.data) {
          const index = state.roles.findIndex(
            (role) => role._id === action.payload.data._id
          );
          if (index >= 0) {
            state.roles[index] = action.payload.data;
          } else {
            state.roles.push(action.payload.data);
          }
        }
        state.loading = false;
      }
    );
    builder.addCase(fetchRoleById.rejected, (state, action: PayloadAction<CustomError | undefined>) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(createRole.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      createRole.fulfilled,
      (state, action: PayloadAction<ApiResponse<Role>>) => {
        if (action.payload.data) {
          const existingRole = state.roles.find(
            (role) => role._id === action.payload.data._id
          );
          if (!existingRole) {
            state.roles.push(action.payload.data);
          }
        }
        state.loading = false;
      }
    );
    builder.addCase(createRole.rejected, (state, action: PayloadAction<CustomError | undefined>) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(updateRole.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateRole.fulfilled,
      (state, action: PayloadAction<ApiResponse<Role>>) => {
        if (action.payload.data) {
          const index = state.roles.findIndex(
            (role) => role._id === action.payload.data._id
          );
          if (index >= 0) {
            state.roles[index] = action.payload.data;
          }
        }
        state.loading = false;
      }
    );
    builder.addCase(updateRole.rejected, (state, action: PayloadAction<CustomError | undefined>) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(deleteRole.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteRole.fulfilled,
      (state, action: PayloadAction<ApiResponse<string>>) => {
        if (action.payload.data) {
          state.roles = state.roles.filter(
            (role) => role._id !== action.payload.data
          );
        }
        state.loading = false;
      }
    );
    builder.addCase(deleteRole.rejected, (state, action: PayloadAction<CustomError | undefined>) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
  },
});

export const { setQuery, roleCreated, roleUpdated, roleDeleted } =
  roleSlice.actions;
export default roleSlice.reducer;
