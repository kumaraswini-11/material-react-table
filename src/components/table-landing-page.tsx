"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { sampleDataType } from "@/types/sample-data";
import { format } from "date-fns";

const TableLandingPage = () => {
  const [sampleData, setSampleData] = useState<sampleDataType[]>([]);

  // Load Sample Data
  useEffect(() => {
    const fetchStaticSampleData = async () => {
      const response = await fetch("/sample-data.json");
      const data = await response.json();
      setSampleData(data);
    };

    fetchStaticSampleData();
  }, []);

  const columns = useMemo<MRT_ColumnDef<sampleDataType>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 50,
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 230,
      },
      {
        accessorKey: "category",
        header: "Category",
        size: 150,
      },
      {
        accessorKey: "subcategory",
        header: "Subcategory",
        size: 150,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        size: 100,
        // Format the date to DD-MMM-YY
        Cell: ({ cell }) => {
          const date = new Date(cell.getValue<string>());
          return format(date, "dd-MMM-yy");
        },
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        size: 100,
        // Format the date to DD-MMM-YY
        Cell: ({ cell }) => {
          const date = new Date(cell.getValue<string>());
          return format(date, "dd-MMM-yy");
        },
      },
      {
        accessorKey: "price",
        header: "Price",
        size: 100,
      },
      {
        accessorKey: "sale_price",
        header: "Sale Price",
        size: 100,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: sampleData,
    enableTopToolbar: false,
    enableBottomToolbar: false,
  });

  return <MaterialReactTable table={table} />;
};

export default TableLandingPage;
