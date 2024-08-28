import { io, Socket } from "socket.io-client";
import { store } from "../store";
import {
  cityCreated,
  cityUpdated,
  cityDeleted,
  updateCitiesByCountry,
} from "../store/slices/citySlice";
import {
  countryCreated,
  countryUpdated,
  countryDeleted,
} from "../store/slices/countrySlice";
import {
  exchangeRateCreated,
  exchangeRateUpdated,
  exchangeRateDeleted,
} from "../store/slices/exchangeRateSlice";
import {
  parcelCreated,
  parcelUpdated,
  parcelDeleted,
  updateParcelsByCity,
  updateParcelsByCountry,
  updateParcelsByUser,
  updateParcelsByRole,
  updateParcelsByWarehouse,
  bulkParcelStatusChanged,
  bulkParcelUpdated,
  parcelStatusChanged,
} from "../store/slices/parcelSlice";
import {
  roleCreated,
  roleUpdated,
  roleDeleted,
} from "../store/slices/roleSlice";
import {
  warehouseCreated,
  warehouseUpdated,
  warehouseDeleted,
  updateWarehousesByCity,
  updateWarehousesByCountry,
} from "../store/slices/warehouseSlice";
import {
  userCreated,
  userUpdated,
  userDeleted,
  updateUsersByCity,
  updateUsersByCountry,
  updateUsersByRole,
} from "../store/slices/userSlice";
import { fetchCurrentUser, logout } from "../store/slices/authSlice";
import {
  CityEvent,
  CountryEvent,
  ExchangeRateEvent,
  ParcelEvent,
  RoleEvent,
  WarehouseEvent,
  UserEvent,
} from "../enums/Events";
const socketUrl = process.env.REACT_APP_BACKEND_SOCKET_URL || "";
class SocketService {
  private static instance: SocketService;
  socket: Socket | null = null;

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect() {
    if (this.socket) {
      return;
    }

    const state = store.getState();
    const token = state.auth.token;

    this.socket = io(socketUrl, {
      auth: {
        token,
      },
    });
    this.socket.on("connect", () => {
      console.log("Connected to socket server");
    });
    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected from socket server", reason);
      if (reason === "io server disconnect") {
        this.socket!.connect();
      }
    });

    this.socket.on("error", (error: any) => {
      console.error("Socket error:", error);
    });
    this.registerEventListeners();
  }

  registerEventListeners() {
    if (!this.socket) return;
    this.socket.on(CityEvent.Created, (data: any) => {
      store.dispatch(cityCreated(data));
    });
    this.socket.on(CityEvent.Updated, (data: any) => {
      store.dispatch(cityUpdated(data));
      store.dispatch(updateUsersByCity(data));
      store.dispatch(updateParcelsByCity(data));
      store.dispatch(updateWarehousesByCity(data));
    });
    this.socket.on(CityEvent.Deleted, (data: any) => {
      store.dispatch(cityDeleted(data));
    });

    this.socket.on(CountryEvent.Created, (data: any) => {
      store.dispatch(countryCreated(data));
    });
    this.socket.on(CountryEvent.Updated, (data: any) => {
      store.dispatch(countryUpdated(data));
      store.dispatch(updateUsersByCountry(data));
      store.dispatch(updateParcelsByCountry(data));
      store.dispatch(updateWarehousesByCountry(data));
      store.dispatch(updateCitiesByCountry(data));
    });
    this.socket.on(CountryEvent.Deleted, (data: any) => {
      store.dispatch(countryDeleted(data));
    });

    this.socket.on(ExchangeRateEvent.Created, (data: any) => {
      store.dispatch(exchangeRateCreated(data));
    });
    this.socket.on(ExchangeRateEvent.Updated, (data: any) => {
      store.dispatch(exchangeRateUpdated(data));
    });
    this.socket.on(ExchangeRateEvent.Deleted, (data: any) => {
      store.dispatch(exchangeRateDeleted(data));
    });

    this.socket.on(ParcelEvent.Created, (data: any) => {
      store.dispatch(parcelCreated(data));
    });
    this.socket.on(ParcelEvent.Updated, (data: any) => {
      store.dispatch(parcelUpdated(data));
    });
    this.socket.on(ParcelEvent.Deleted, (data: any) => {
      store.dispatch(parcelDeleted(data));
    });
    this.socket.on(ParcelEvent.StatusChanged, (data: any) => {
      console.log("parcel Changed", data);
      store.dispatch(parcelStatusChanged(data));
    });
    this.socket.on(ParcelEvent.BulkStatusChanged, (data: any) => {
      store.dispatch(bulkParcelStatusChanged(data));
    });
    this.socket.on(ParcelEvent.BulkUpdated, (data: any) => {
      store.dispatch(bulkParcelUpdated(data));
    });

    this.socket.on(RoleEvent.Created, (data: any) => {
      store.dispatch(roleCreated(data));
    });
    this.socket.on(RoleEvent.Updated, (data: any) => {
      store.dispatch(roleUpdated(data));
      store.dispatch(updateParcelsByRole(data));
      store.dispatch(updateUsersByRole(data));
    });
    this.socket.on(RoleEvent.Deleted, (data: any) => {
      store.dispatch(roleDeleted(data));
    });

    this.socket.on(WarehouseEvent.Created, (data: any) => {
      store.dispatch(warehouseCreated(data));
    });
    this.socket.on(WarehouseEvent.Updated, (data: any) => {
      store.dispatch(warehouseUpdated(data));
      store.dispatch(updateParcelsByWarehouse(data));
    });
    this.socket.on(WarehouseEvent.Deleted, (data: any) => {
      store.dispatch(warehouseDeleted(data));
    });

    this.socket.on(UserEvent.Created, (data: any) => {
      store.dispatch(userCreated(data));
    });
    this.socket.on(UserEvent.Updated, (data: any) => {
      store.dispatch(userUpdated(data));
      store.dispatch(updateParcelsByUser(data));

      const state = store.getState();
      const currentUser = state.auth.user;
      if (currentUser && currentUser._id === data._id) {
        store.dispatch(fetchCurrentUser());
      }
    });

    this.socket.on(UserEvent.Deleted, (data: any) => {
      const state = store.getState();
      const currentUser = state.auth.user;

      if (currentUser && currentUser._id === data._id) {
        store.dispatch(logout());
      } else {
        store.dispatch(userDeleted(data));
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  onMessage(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }
}

const socketService = SocketService.getInstance();
export default socketService;
