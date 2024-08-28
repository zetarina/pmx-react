import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { Parcel } from "../../models/Parcel";
import { ApiResponse } from "..";

export interface CartState {
  parcels: Parcel[];
  selectedWarehouse: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  parcels: [],
  selectedWarehouse: null,
  loading: false,
  error: null,
};

export const submitCart = createAsyncThunk<
  ApiResponse<string>,
  { parcels: string[]; warehouseId: string }
>("cart/submitCart", async ({ parcels, warehouseId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/reception/long-haul-parcels", {
      parcels,
      warehouseId,
    });
    return { data: response.data, status: response.status };
  } catch (error: any) {
    return rejectWithValue({
      data: error.response?.data || "An unknown error occurred.",
      status: error.response?.status || 500,
    });
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addParcelToCart(state, action: PayloadAction<Parcel>) {
      const parcelExists = state.parcels.some(
        (parcel) => parcel._id === action.payload._id
      );
      if (!parcelExists) {
        state.parcels.push(action.payload);
      }
    },
    removeParcelFromCart(state, action: PayloadAction<string>) {
      state.parcels = state.parcels.filter(
        (parcel) => parcel._id !== action.payload
      );
    },
    selectWarehouse(state, action: PayloadAction<string>) {
      state.selectedWarehouse = action.payload;
    },
    clearCart(state) {
      state.parcels = [];
      state.selectedWarehouse = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(submitCart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(submitCart.fulfilled, (state) => {
      state.loading = false;
      state.parcels = [];
      state.selectedWarehouse = null;
    });
    builder.addCase(
      submitCart.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload?.data || "Failed to submit parcels.";
      }
    );
  },
});

export const {
  addParcelToCart,
  removeParcelFromCart,
  selectWarehouse,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
