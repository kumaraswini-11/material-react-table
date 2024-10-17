"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_SortingState,
  // MRT_TableHeadCellFilterContainer,
  useMaterialReactTable,
} from "material-react-table";
import { Box, IconButton, Tooltip, Pagination } from "@mui/material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import { sampleDataType } from "@/types/sample-data";
import moment from "moment";
import { FilterComponent } from "./filter-component";
import { ColumnGroupingModal } from "./column-grouping-selector";
import { ShowOrHideColumns } from "./column-visibility-toggle";
import { SortOptionsModal } from "./sort-options-modal";

const MODAL_BUTTONS = [
  {
    title: "Show/Hide",
    icon: <RemoveRedEyeOutlinedIcon />,
    modalName: "showOrHideColumn",
  },
  { title: "Sort", icon: <SwapVertOutlinedIcon />, modalName: "sorting" },
  {
    title: "Filtering",
    icon: <FilterListOutlinedIcon />,
    modalName: "filtering",
  },
  {
    title: "Create Groups",
    icon: <LayersOutlinedIcon />,
    modalName: "grouping",
  },
];

const TableLandingPage = () => {
  const [sampleData, setSampleData] = useState<sampleDataType[]>([]);
  const [modalState, setModalState] = useState({
    grouping: false,
    showOrHideColumn: false,
    sorting: false,
    filtering: false,
  });
  const [groupByColumn, setGroupByColumn] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<any>({
    id: true,
    name: true,
    category: true,
    subcategory: true,
    createdAt: true,
    updatedAt: true,
    price: true,
    sale_price: true,
  });
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  // const [filters, setFilters] = useState<any>([
  //   { id: "id", desc: false },
  //   { id: "name", desc: false },
  //   { id: "category", desc: false },
  //   { id: "subcategory", desc: false },
  //   { id: "createdAt", desc: false },
  //   { id: "updatedAt", desc: false },
  //   { id: "price", desc: false },
  //   { id: "sale_price", desc: false },
  // ]);

  useEffect(() => {
    const fetchStaticSampleData = async () => {
      try {
        const response = await fetch("/sample-data.json");
        const data = await response.json();
        setSampleData(data);
      } catch (error) {
        console.error("Error fetching sample data:", error);
      }
    };
    fetchStaticSampleData();
  }, []);

  const columns = useMemo<MRT_ColumnDef<sampleDataType>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableSorting: true,
        size: 50,
      },
      {
        accessorKey: "name",
        header: "Name",
        enableGlobalFilter: true,
        filterFn: "fuzzy",
        size: 230,
      },
      {
        accessorKey: "category",
        header: "Category",
        enableMultiSelectFilter: true,
        filterFn: "equals",
        size: 150,
      },
      {
        accessorKey: "subcategory",
        header: "Subcategory",
        enableMultiSelectFilter: true,
        size: 150,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        filterVariant: "date-range",
        filterFn: "between",
        size: 100,
        Cell: ({ cell }) => moment(cell.getValue<Date>()).format("DD-MMM-YY"),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        filterVariant: "date-range",
        filterFn: "between",
        size: 100,
        Cell: ({ cell }) => moment(cell.getValue<Date>()).format("DD-MMM-YY"),
      },
      {
        accessorKey: "price",
        header: "Price",
        filterVariant: "range-slider",
        filterFn: "between",
        size: 100,
      },
      {
        accessorKey: "sale_price",
        header: "Sale Price",
        filterVariant: "range-slider",
        filterFn: "between",
        size: 100,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: sampleData,
    globalFilterFn: "fuzzy",
    columnFilterDisplayMode: "custom",
    muiFilterTextFieldProps: ({ column }) => ({
      label: `Filter by ${column.columnDef.header}`,
    }),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      showGlobalFilter: true,
      grouping: groupByColumn,
      showColumnFilters: true,
    },
    state: {
      columnVisibility,
      grouping: groupByColumn,
      sorting,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onGroupingChange: setGroupByColumn,
    onSortingChange: setSorting,

    isMultiSortEvent: () => true,
    enableSorting: true,
    enablePagination: true,
    enableGrouping: true,
    enableGlobalFilter: true,
    enableFacetedValues: true,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableColumnActions: false,
    enableKeyboardShortcuts: false,
    enableColumnDragging: false,
    enableColumnFilters: false,
    groupedColumnMode: "reorder",

    muiTableBodyRowProps: { hover: false },
    muiTablePaperProps: {
      sx: {
        boxShadow: "none",
      },
    },
    muiTableHeadCellProps: {
      sx: {
        borderTop: "1px solid lightgray",
        borderBottom: "1px solid lightgray",
        fontWeight: "bold",
        paddingTop: 0.7,
        paddingBottom: 0.7,
      },
    },
    muiTableBodyCellProps: {
      sx: {
        border: "none",
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 2.5,
      },
    },
    muiTableFooterProps: {
      sx: {
        border: "none",
        boxShadow: "none",
      },
    },
  });

  const openModal = (modalName: keyof typeof modalState) => {
    setModalState((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName: keyof typeof modalState) => {
    setModalState((prev) => ({ ...prev, [modalName]: false }));
  };

  return (
    <Box sx={{ paddingTop: 5, paddingInline: 10, backgroundColor: "#fff" }}>
      {/* Header with custom buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <Box sx={{ display: "flex", gap: "6px" }}>
          <MRT_GlobalFilterTextField
            table={table}
            placeholder="Search"
            sx={{
              width: "250px",
              ".MuiInputBase-root": {
                borderRadius: "4px",
              },
            }}
          />
          {MODAL_BUTTONS.map(({ title, icon, modalName }) => (
            <Tooltip title={title} key={modalName}>
              <IconButton onClick={() => openModal(modalName as any)}>
                {icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      </Box>

      {/* Main Table */}
      <MaterialReactTable table={table} />

      {/* Pagination */}
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "25px" }}
      >
        <Pagination
          count={Math.ceil(
            table.getPrePaginationRowModel().rows.length /
              table.getState().pagination.pageSize
          )}
          shape="rounded"
          page={table.getState().pagination.pageIndex + 1}
          onChange={(_, page) => table.setPageIndex(page - 1)}
        />
      </Box>

      {/* Popup Modals */}
      {modalState.showOrHideColumn && (
        <ShowOrHideColumns
          isOpen={modalState.showOrHideColumn}
          onClose={() => closeModal("showOrHideColumn")}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
        />
      )}
      {modalState.sorting && (
        <SortOptionsModal
          isOpen={modalState.sorting}
          onClose={() => closeModal("sorting")}
          sortingState={sorting}
          setSortingState={setSorting}
          tableInstance={table}
          columns={columns}
        />
      )}
      {modalState.filtering && (
        // <Filters
        //   isOpen={modalState.filtering}
        //   onClose={() => closeModal("filtering")}
        //   filters={filters}
        //   setFilters={setFilters}
        // />

        <FilterComponent
          isOpen={modalState.filtering}
          onClose={() => closeModal("filtering")}
          table={table}
        />
      )}

      {modalState.grouping && (
        <ColumnGroupingModal
          isOpen={modalState.grouping}
          onClose={() => closeModal("grouping")}
          // groupByColumn={groupByColumn}
          setGroupByColumn={setGroupByColumn}
        />
      )}
    </Box>
  );
};

export default TableLandingPage;
