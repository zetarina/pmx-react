import { configureStore, Reducer } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer, { AuthState } from "./slices/authSlice";
import cityReducer, { CityState } from "./slices/citySlice";
import countryReducer, { CountryState } from "./slices/countrySlice";
import exchangeRateReducer, { ExchangeRateState } from "./slices/exchangeRateSlice";
import parcelReducer, { ParcelState } from "./slices/parcelSlice";
import roleReducer, { RoleState } from "./slices/roleSlice";
import warehouseReducer, { WarehouseState } from "./slices/warehouseSlice";
import cartReducer, { CartState } from "./slices/cartSlice";
import userReducer, { UserState } from "./slices/userSlice";

// Transform to reset fetchingCurrentUser and loading to false after rehydration
const authTransform = createTransform<AuthState, Partial<AuthState>>(
  (inboundState: AuthState) => {
    // Transform state being persisted
    const { fetchingCurrentUser, loading, ...rest } = inboundState;
    return rest;
  },
  (outboundState: Partial<AuthState>) => {
    // Transform state being rehydrated
    return { ...outboundState, fetchingCurrentUser: false, loading: false } as AuthState;
  },
  { whitelist: ['auth'] }
);

const rootReducer = combineReducers({
  auth: authReducer,
  cities: cityReducer,
  countries: countryReducer,
  exchangeRate: exchangeRateReducer,
  parcels: parcelReducer,
  roles: roleReducer,
  warehouses: warehouseReducer,
  cart: cartReducer,
  users: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
  transforms: [authTransform],
};

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export interface FetchParams {
  page: number;
  limit: number;
  query: string;
}
export interface ApiResponse<T> {
  data: T;
  status: number;
}
