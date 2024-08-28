import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import WarehouseForm from "../components/Forms/WarehouseForm";
import { Warehouse } from "../models/Warehouse";
import { RootState, AppDispatch } from "../store";
import { fetchWarehouseById } from "../store/slices/warehouseSlice";
import Page from "../components/Page";
import Loading from "../components/Loading";
import ErrorComponent from "../components/ErrorComponent";

const WarehouseUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [warehouse, setWarehouse] = useState<Warehouse | undefined>(undefined);
  const { warehouses, loading, error } = useSelector(
    (state: RootState) => state.warehouses
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWarehouse = async () => {
      const foundWarehouse = warehouses.find((w) => w._id === id);
      if (foundWarehouse) {
        setWarehouse(foundWarehouse);
      } else {
        const response = await dispatch(fetchWarehouseById(id!));
        if (fetchWarehouseById.fulfilled.match(response)) {
          setWarehouse(response.payload.data);
        }
      }
    };

    fetchWarehouse();
  }, [id, warehouses, dispatch]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (!warehouse) {
    const notFoundError = {
      message: "Warehouse not found",
      name: "NotFoundError",
      status: 404,
      code: "WAREHOUSE_NOT_FOUND",
    };
    return <ErrorComponent error={notFoundError} />;
  }

  return (
    <Page title="Update Warehouse">
      <WarehouseForm
        currentWarehouse={warehouse}
        onSuccess={() => navigate("/dashboard/warehouse")}
      />
    </Page>
  );
};

export default WarehouseUpdatePage;
