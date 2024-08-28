import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, { CustomError } from "../../api/axiosInstance";
import { Warehouse } from "../../models/Warehouse";
import { ApiResponse, FetchParams } from "..";
import { City } from "../../models/City";
import { Country } from "../../models/Country";

export interface WarehouseState {
  warehouses: Warehouse[];
  total: number;
  query: string;
  loading: boolean;
  error: CustomError | null;
}

const initialState: WarehouseState = {
  warehouses: [],
  total: 0,
  query: "",
  loading: false,
  error: null,
};

export const fetchWarehouses = createAsyncThunk<
  ApiResponse<{ warehouses: Warehouse[]; total: number }>,
  FetchParams,
  { rejectValue: CustomError }
>("warehouse/fetchWarehouses", async ({ page, limit, query }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/warehouses?page=${page}&limit=${limit}&query=${query}`);
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

export const fetchWarehouseById = createAsyncThunk<
  ApiResponse<Warehouse>,
  string,
  { rejectValue: CustomError }
>("warehouse/fetchWarehouseById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/warehouses/${id}`);
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

export const createWarehouse = createAsyncThunk<
  ApiResponse<Warehouse>,
  Warehouse,
  { rejectValue: CustomError }
>("warehouse/createWarehouse", async (warehouse, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/warehouses", warehouse);
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

export const updateWarehouse = createAsyncThunk<
  ApiResponse<Warehouse>,
  Warehouse,
  { rejectValue: CustomError }
>("warehouse/updateWarehouse", async (warehouse, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/warehouses/${warehouse._id}`, warehouse);
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

export const deleteWarehouse = createAsyncThunk<
  ApiResponse<string>,
  string,
  { rejectValue: CustomError }
>("warehouse/deleteWarehouse", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/warehouses/${id}`);
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

const warehouseSlice = createSlice({
  name: "warehouse",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    warehouseCreated: (state, action: PayloadAction<Warehouse>) => {
      const existingWarehouse = state.warehouses.find(
        (warehouse) => warehouse._id === action.payload._id
      );
      if (!existingWarehouse) {
        state.warehouses.push(action.payload);
      }
    },
    warehouseUpdated: (state, action: PayloadAction<Warehouse>) => {
      const index = state.warehouses.findIndex(
        (warehouse) => warehouse._id === action.payload._id
      );
      if (index >= 0) {
        state.warehouses[index] = action.payload;
      }
    },
    warehouseDeleted: (state, action: PayloadAction<string>) => {
      state.warehouses = state.warehouses.filter(
        (warehouse) => warehouse._id !== action.payload
      );
    },
    updateWarehousesByCity: (state, action: PayloadAction<City>) => {
      state.warehouses.forEach((warehouse) => {
        if (warehouse.location.cityId === action.payload._id) {
          warehouse.location.city = action.payload;
        }
      });
    },
    updateWarehousesByCountry: (state, action: PayloadAction<Country>) => {
      state.warehouses.forEach((warehouse) => {
        if (warehouse.location.countryId === action.payload._id) {
          warehouse.location.country = action.payload;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWarehouses.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchWarehouses.fulfilled, (state, action: PayloadAction<ApiResponse<{ warehouses: Warehouse[]; total: number }>>) => {
      if (action.payload.data) {
        state.warehouses = action.payload.data.warehouses;
        state.total = action.payload.data.total;
      }
      state.loading = false;
    });
    builder.addCase(fetchWarehouses.rejected, (state, action: PayloadAction<CustomError | undefined>) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(fetchWarehouseById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchWarehouseById.fulfilled,
      (state, action: PayloadAction<ApiResponse<Warehouse>>) => {
        if (action.payload.data) {
          const index = state.warehouses.findIndex(
            (warehouse) => warehouse._id === action.payload.data._id
          );
          if (index >= 0) {
            state.warehouses[index] = action.payload.data;
          } else {
            state.warehouses.push(action.payload.data);
          }
        }
        state.loading = false;
      }
    );
    builder.addCase(fetchWarehouseById.rejected, (state, action: PayloadAction<CustomError | undefined>) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(createWarehouse.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      createWarehouse.fulfilled,
      (state, action: PayloadAction<ApiResponse<Warehouse>>) => {
        if (action.payload.data) {
          const existingWarehouse = state.warehouses.find(
            (warehouse) => warehouse._id === action.payload.data._id
          );
          if (!existingWarehouse) {
            state.warehouses.push(action.payload.data);
          }
        }
        state.loading = false;
      }
    );
    builder.addCase(createWarehouse.rejected, (state, action: PayloadAction<CustomError | undefined>) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(updateWarehouse.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateWarehouse.fulfilled,
      (state, action: PayloadAction<ApiResponse<Warehouse>>) => {
        if (action.payload.data) {
          const index = state.warehouses.findIndex(
            (warehouse) => warehouse._id === action.payload.data._id
          );
          if (index >= 0) {
            state.warehouses[index] = action.payload.data;
          }
        }
        state.loading = false;
      }
    );
    builder.addCase(updateWarehouse.rejected, (state, action: PayloadAction<CustomError | undefined>) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
    builder.addCase(deleteWarehouse.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteWarehouse.fulfilled,
      (state, action: PayloadAction<ApiResponse<string>>) => {
        if (action.payload.data) {
          state.warehouses = state.warehouses.filter(
            (warehouse) => warehouse._id !== action.payload.data
          );
        }
        state.loading = false;
      }
    );
    builder.addCase(deleteWarehouse.rejected, (state, action: PayloadAction<CustomError | undefined>) => {
      state.loading = false;
      state.error = action.payload as CustomError;
    });
  },
});

export const {
  setQuery,
  warehouseCreated,
  warehouseUpdated,
  warehouseDeleted,
  updateWarehousesByCity,
  updateWarehousesByCountry,
} = warehouseSlice.actions;
export default warehouseSlice.reducer;
