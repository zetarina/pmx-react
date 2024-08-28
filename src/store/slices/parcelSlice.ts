import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, { CustomError } from "../../api/axiosInstance";
import { Parcel } from "../../models/Parcel";
import { FetchParams, ApiResponse } from "..";
import { City } from "../../models/City";
import { Country } from "../../models/Country";
import { User } from "../../models/User";
import { Role } from "../../models/Role";
import { Warehouse } from "../../models/Warehouse";

export interface ParcelState {
  parcels: Parcel[];
  total: number;
  query: string;
  loading: boolean;
  error: CustomError | null;
}

const initialState: ParcelState = {
  parcels: [],
  total: 0,
  query: "",
  loading: false,
  error: null,
};

interface CreateParcelPayload {
  parcel: Parcel;
  initialWarehouseId: string;
}
interface CreateParcelResponse {
  parcel: Parcel;
  waybill: string;
}
interface UpdateParcelResponse {
  parcel: Parcel;
  waybill: string;
}
export const fetchParcels = createAsyncThunk<
  ApiResponse<{ parcels: Parcel[]; total: number }>,
  FetchParams,
  { rejectValue: CustomError }
>(
  "parcel/fetchParcels",
  async ({ page, limit, query }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/parcels?page=${page}&limit=${limit}&query=${query}`
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

export const fetchParcelById = createAsyncThunk<
  ApiResponse<Parcel>,
  string,
  { rejectValue: CustomError }
>("parcel/fetchParcelById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/parcels/${id}`);
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
export const fetchParcelByParcelId = createAsyncThunk<
  ApiResponse<Parcel>,
  string,
  { rejectValue: CustomError }
>("parcel/fetchParcelByParcelId", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/parcels/parcelId/${id}`);
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

export const createParcel = createAsyncThunk<
  ApiResponse<CreateParcelResponse>,
  CreateParcelPayload,
  { rejectValue: CustomError }
>(
  "parcel/createParcel",
  async ({ parcel, initialWarehouseId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/parcels", {
        ...parcel,
        initialWarehouseId,
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

export const updateParcel = createAsyncThunk<
  ApiResponse<UpdateParcelResponse>,
  Parcel,
  { rejectValue: CustomError }
>("parcel/updateParcel", async (parcel, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/parcels/${parcel._id}`, parcel);
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

export const deleteParcel = createAsyncThunk<
  ApiResponse<string>,
  string,
  { rejectValue: CustomError }
>("parcel/deleteParcel", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/parcels/${id}`);
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

const parcelSlice = createSlice({
  name: "parcel",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    parcelCreated: (state, action: PayloadAction<Parcel>) => {
      const existingParcel = state.parcels.find(
        (parcel) => parcel._id === action.payload._id
      );
      if (!existingParcel) {
        state.parcels.push(action.payload);
      }
    },
    parcelUpdated: (state, action: PayloadAction<Parcel>) => {
      const index = state.parcels.findIndex(
        (parcel) => parcel._id === action.payload._id
      );
      if (index >= 0) {
        state.parcels[index] = action.payload;
      }
    },
    parcelDeleted: (state, action: PayloadAction<string>) => {
      state.parcels = state.parcels.filter(
        (parcel) => parcel._id !== action.payload
      );
    },
    parcelStatusChanged: (state, action: PayloadAction<Parcel>) => {
      const index = state.parcels.findIndex(
        (parcel) => parcel._id === action.payload._id
      );
      if (index >= 0) {
        if (action.payload.status) {
          state.parcels[index].status = action.payload.status;
        }
        if (action.payload.paymentStatus) {
          state.parcels[index].paymentStatus = action.payload.paymentStatus;
        }
        if (action.payload.trackingHistory) {
          state.parcels[index].trackingHistory = action.payload.trackingHistory;
        }
      }
    },
    bulkParcelStatusChanged: (
      state,
      action: PayloadAction<{ parcels: Parcel[] }>
    ) => {
      action.payload.parcels.forEach((updatedParcel) => {
        const index = state.parcels.findIndex(
          (parcel) => parcel._id === updatedParcel._id
        );
        if (index >= 0) {
          if (updatedParcel.status) {
            state.parcels[index].status = updatedParcel.status;
          }
          if (updatedParcel.paymentStatus) {
            state.parcels[index].paymentStatus = updatedParcel.paymentStatus;
          }
          if (updatedParcel.trackingHistory) {
            state.parcels[index].trackingHistory =
              updatedParcel.trackingHistory;
          }
        }
      });
    },
    bulkParcelUpdated: (
      state,
      action: PayloadAction<{ parcels: Parcel[] }>
    ) => {
      action.payload.parcels.forEach((updatedParcel) => {
        const index = state.parcels.findIndex(
          (parcel) => parcel._id === updatedParcel._id
        );
        if (index >= 0) {
          state.parcels[index] = updatedParcel;
        }
      });
    },

    updateParcelsByCity: (state, action: PayloadAction<City>) => {
      state.parcels.forEach((parcel) => {
        if (parcel.receiver.cityId === action.payload._id) {
          parcel.receiver.city = action.payload;
        }
        if (
          parcel.sender.shipper &&
          parcel.sender.shipper?.cityId === action.payload._id
        ) {
          parcel.sender.shipper.city = action.payload;
        }
        if (
          parcel.sender.guest &&
          parcel.sender.guest?.cityId === action.payload._id
        ) {
          parcel.sender.guest.city = action.payload;
        }
        if (
          parcel.currentDriver &&
          parcel.currentDriver?.cityId === action.payload._id
        ) {
          parcel.currentDriver.city = action.payload;
        }
      });
    },
    updateParcelsByCountry: (state, action: PayloadAction<Country>) => {
      state.parcels.forEach((parcel) => {
        if (parcel.receiver.countryId === action.payload._id) {
          parcel.receiver.country = action.payload;
        }
        if (
          parcel.sender.shipper &&
          parcel.sender.shipper?.countryId === action.payload._id
        ) {
          parcel.sender.shipper.country = action.payload;
        }
        if (
          parcel.sender.guest &&
          parcel.sender.guest?.countryId === action.payload._id
        ) {
          parcel.sender.guest.country = action.payload;
        }
        if (
          parcel.currentDriver &&
          parcel.currentDriver?.countryId === action.payload._id
        ) {
          parcel.currentDriver.country = action.payload;
        }
      });
    },
    updateParcelsByUser: (state, action: PayloadAction<User>) => {
      state.parcels.forEach((parcel) => {
        if (parcel.sender.shipper_id === action.payload._id) {
          parcel.sender.shipper = action.payload;
        }
        if (parcel.currentDriverId === action.payload._id) {
          parcel.currentDriver = action.payload;
        }
        if (parcel.createdById === action.payload._id) {
          parcel.createdBy = action.payload;
        }
        parcel.trackingHistory?.forEach((history) => {
          if (history.driverId === action.payload._id) {
            history.driver = action.payload;
          }
        });
      });
    },
    updateParcelsByRole: (state, action: PayloadAction<Role>) => {
      state.parcels.forEach((parcel) => {
        if (
          parcel.sender.shipper &&
          parcel.sender.shipper.roleId === action.payload._id
        ) {
          parcel.sender.shipper.role = action.payload;
        }
        if (
          parcel.currentDriver &&
          parcel.currentDriver.roleId === action.payload._id
        ) {
          parcel.currentDriver.role = action.payload;
        }
        if (
          parcel.createdBy &&
          parcel.createdBy.roleId === action.payload._id
        ) {
          parcel.createdBy.role = action.payload;
        }
        parcel.trackingHistory?.forEach((history) => {
          if (history.driver && history.driver.roleId === action.payload._id) {
            history.driver.role = action.payload;
          }
        });
      });
    },
    updateParcelsByWarehouse: (state, action: PayloadAction<Warehouse>) => {
      state.parcels.forEach((parcel) => {
        parcel.trackingHistory?.forEach((history) => {
          if (history.warehouseId === action.payload._id) {
            history.warehouse = action.payload;
          }
        });
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchParcels.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchParcels.fulfilled,
      (
        state,
        action: PayloadAction<ApiResponse<{ parcels: Parcel[]; total: number }>>
      ) => {
        if (action.payload.data) {
          state.parcels = action.payload.data.parcels;
          state.total = action.payload.data.total;
        }
        state.loading = false;
      }
    );
    builder.addCase(
      fetchParcels.rejected,
      (state, action: PayloadAction<CustomError | undefined>) => {
        state.loading = false;
        state.error = action.payload as CustomError;
      }
    );
    builder.addCase(fetchParcelById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchParcelById.fulfilled,
      (state, action: PayloadAction<ApiResponse<Parcel>>) => {
        if (action.payload.data) {
          const index = state.parcels.findIndex(
            (parcel) => parcel._id === action.payload.data._id
          );
          if (index >= 0) {
            state.parcels[index] = action.payload.data;
          } else {
            state.parcels.push(action.payload.data);
          }
        }
        state.loading = false;
      }
    );
    builder.addCase(
      fetchParcelById.rejected,
      (state, action: PayloadAction<CustomError | undefined>) => {
        state.loading = false;
        state.error = action.payload as CustomError;
      }
    );
    builder.addCase(createParcel.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      createParcel.fulfilled,
      (state, action: PayloadAction<ApiResponse<CreateParcelResponse>>) => {
        if (action.payload.data) {
          const existingParcel = state.parcels.find(
            (parcel) => parcel._id === action.payload.data.parcel._id
          );
          if (!existingParcel) {
            state.parcels.push(action.payload.data.parcel);
          }

          const link = document.createElement("a");
          link.href = `data:application/pdf;base64,${action.payload.data.waybill}`;
          link.download = `waybill-${action.payload.data.parcel.parcelId}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        state.loading = false;
      }
    );
    builder.addCase(
      createParcel.rejected,
      (state, action: PayloadAction<CustomError | undefined>) => {
        state.loading = false;
        state.error = action.payload as CustomError;
      }
    );
    builder.addCase(updateParcel.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateParcel.fulfilled,
      (state, action: PayloadAction<ApiResponse<UpdateParcelResponse>>) => {
        if (action.payload.data) {
          const index = state.parcels.findIndex(
            (parcel) => parcel._id === action.payload.data.parcel._id
          );
          if (index >= 0) {
            state.parcels[index] = action.payload.data.parcel;
          }

          const link = document.createElement("a");
          link.href = `data:application/pdf;base64,${action.payload.data.waybill}`;
          link.download = `waybill-${action.payload.data.parcel.parcelId}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        state.loading = false;
      }
    );
    builder.addCase(
      updateParcel.rejected,
      (state, action: PayloadAction<CustomError | undefined>) => {
        state.loading = false;
        state.error = action.payload as CustomError;
      }
    );
    builder.addCase(deleteParcel.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteParcel.fulfilled,
      (state, action: PayloadAction<ApiResponse<string>>) => {
        if (action.payload.data) {
          state.parcels = state.parcels.filter(
            (parcel) => parcel._id !== action.payload.data
          );
        }
        state.loading = false;
      }
    );
    builder.addCase(
      deleteParcel.rejected,
      (state, action: PayloadAction<CustomError | undefined>) => {
        state.loading = false;
        state.error = action.payload as CustomError;
      }
    );
  },
});

export const {
  setQuery,
  parcelCreated,
  parcelUpdated,
  parcelDeleted,
  parcelStatusChanged,
  bulkParcelStatusChanged,
  bulkParcelUpdated,
  updateParcelsByCity,
  updateParcelsByCountry,
  updateParcelsByUser,
  updateParcelsByRole,
  updateParcelsByWarehouse,
} = parcelSlice.actions;
export default parcelSlice.reducer;
