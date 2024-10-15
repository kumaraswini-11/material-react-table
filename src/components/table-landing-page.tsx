"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  useMaterialReactTable,
} from "material-react-table";
import { format } from "date-fns";
import { Box, IconButton, Tooltip, Pagination } from "@mui/material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import { sampleDataType } from "@/types/sample-data";
import { ColumnGroupingModal } from "./column-grouping-selector";
import { ShowOrHideColumns } from "./column-visibility-toggle";
import { SortOptionsModal } from "./sort-options-modal";

interface ModalState {
  grouping: boolean;
  showOrHideColumn: boolean;
  sorting: boolean;
}
type ModalName = keyof ModalState;

const RECORDS_PER_PAGE = 10;
const MODAL_BUTTONS = [
  {
    title: "Show/Hide",
    icon: <RemoveRedEyeOutlinedIcon sx={{ color: "#6c757d", fontSize: 24 }} />,
    modalName: "showOrHideColumn",
  },
  {
    title: "Sort",
    icon: <SwapVertOutlinedIcon sx={{ color: "#6c757d", fontSize: 24 }} />,
    modalName: "sorting",
  },
  {
    title: "Filtering",
    icon: <FilterListOutlinedIcon sx={{ color: "#6c757d", fontSize: 24 }} />,
    modalName: "filtering",
  },
  {
    title: "Create Groups",
    icon: <LayersOutlinedIcon sx={{ color: "#6c757d", fontSize: 24 }} />,
    modalName: "grouping",
  },
];

const TableLandingPage = () => {
  const [sampleData, setSampleData] = useState<sampleDataType[]>([]);
  const [modalState, setModalState] = useState<ModalState>({
    grouping: false,
    showOrHideColumn: false,
    sorting: false,
  });
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: RECORDS_PER_PAGE,
  });
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
  const [sortSections, setSortSections] = useState<any[]>([
    { label: "ID", isSort: false },
    { label: "Name", isSort: false },
    { label: "Category", isSort: false },
    { label: "Subcategory", isSort: false },
    { label: "Created At", isSort: false },
    { label: "Updated At", isSort: false },
    { label: "Price", isSort: false },
    { label: "Sale Price", isSort: false },
  ]);
  const [groupByColumn, setGroupByColumn] = useState<string[]>([]);

  const openModal = (modalName: ModalName) => {
    setModalState((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName: ModalName) => {
    setModalState((prev) => ({ ...prev, [modalName]: false }));
  };

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
        Cell: ({ cell }) =>
          format(new Date(cell.getValue<string>()), "dd-MMM-yy"),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        size: 100,
        // Format the date to DD-MMM-YY
        Cell: ({ cell }) =>
          format(new Date(cell.getValue<string>()), "dd-MMM-yy"),
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
    globalFilterFn: "fuzzy",
    initialState: {
      pagination: pagination,
      showGlobalFilter: true,
      showColumnFilters: false,
      grouping: groupByColumn,
    },

    state: {
      columnVisibility,
      grouping: groupByColumn,
      pagination,
      sorting: sortSections,
    },
    onGroupingChange: (newGrouping) => setGroupByColumn(newGrouping),
    onColumnVisibilityChange: setColumnVisibility,
    isMultiSortEvent: () => true,
    onSortingChange: setSortSections,

    enablePagination: true,
    enableSorting: true,
    enableGrouping: true,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableColumnActions: false,
    enableKeyboardShortcuts: false,
    enableColumnDragging: false,
    groupedColumnMode: "reorder",
    // enableColumnFilters: false,

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

  return (
    <Box sx={{ paddingTop: 5, paddingInline: 10, backgroundColor: "#fff" }}>
      {/* Table Header with custom buttons */}
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
              <IconButton onClick={() => openModal(modalName as ModalName)}>
                {icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      </Box>

      {/* Main table */}
      <MaterialReactTable table={table} />

      {/* Popups */}
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
          sortSections={sortSections}
          setSortSections={setSortSections}
          tableInstance={table}
        />
      )}
      {modalState.grouping && (
        <ColumnGroupingModal
          isOpen={modalState.grouping}
          onClose={() => closeModal("grouping")}
          setGroupByColumn={setGroupByColumn}
        />
      )}

      {/* Custom pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "25px",
        }}
      >
        <Pagination
          count={Math.ceil(sampleData.length / pagination?.pageSize)}
          shape="rounded"
          color="standard"
          page={pagination.pageIndex + 1}
          onChange={(_, page) =>
            setPagination({ ...pagination, pageIndex: page - 1 })
          }
          // onChange={(_, page) => table.setPageIndex(page - 1)}
        />
      </Box>
    </Box>
  );
};

export default TableLandingPage;
