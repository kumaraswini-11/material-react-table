"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  useMaterialReactTable,
} from "material-react-table";
import { format } from "date-fns";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Pagination,
  TextField,
  InputAdornment,
} from "@mui/material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { sampleDataType } from "@/types/sample-data";
import { ColumnGroupingModal } from "./column-grouping-selector";
import { ShowOrHideColumns } from "./column-visibility-toggle";

const RECORDS_PER_PAGE = 10;

const TableLandingPage = () => {
  const [sampleData, setSampleData] = useState<sampleDataType[]>([]);
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
  const [groupByColumn, setGroupByColumn] = useState<string[]>([]);
  const [isGroupClicked, setIsGroupClicked] = useState(false);
  const [isShowAllColumnsClicked, setIsShowAllColumnsClicked] = useState(false);
  // const [globalFilter, setGlobalFilter] = useState("");

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

  // Initialize Material React Table
  const table = useMaterialReactTable({
    columns,
    data: sampleData,
    // state: {
    //   globalFilter,
    // },
    // onGlobalFilterChange: setGlobalFilter,
    // globalFilterFn: "fuzzy",
    initialState: {
      pagination: pagination,
      showGlobalFilter: true,
      showColumnFilters: false,
      grouping: groupByColumn,
    },

    onGroupingChange: (newGrouping) => setGroupByColumn(newGrouping),
    onColumnVisibilityChange: setColumnVisibility,
    state: { columnVisibility, grouping: groupByColumn, pagination },

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
    // positionToolbarAlertBanner: 'bottom', //show selected rows count on bottom toolbar

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
        // textAlign: "center",
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
          {/* Custom toolbar buttons */}
          {/* <TextField
            variant="outlined"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    {globalFilter && (
                      <IconButton
                        onClick={() => setGlobalFilter("")}
                        sx={{ color: "gray", width: 10, fontSize: 10 }}
                      >
                        <CloseOutlinedIcon />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              width: "230px",
              borderRadius: 2,
              boxShadow: "none",
            }}
          /> */}
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

          <Tooltip title="Group">
            <IconButton onClick={() => setIsGroupClicked(true)}>
              <RemoveRedEyeOutlinedIcon
                sx={{ color: "#6c757d", fontSize: 24 }}
              />
            </IconButton>
          </Tooltip>

          <Tooltip title="Sort">
            <IconButton onClick={() => console.log("Sort clicked")}>
              <SwapVertOutlinedIcon sx={{ color: "#6c757d", fontSize: 24 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Filter">
            <IconButton onClick={() => setIsShowAllColumnsClicked(true)}>
              <FilterListOutlinedIcon sx={{ color: "#6c757d", fontSize: 24 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Layer">
            <IconButton onClick={() => console.log("Layer clicked")}>
              <LayersOutlinedIcon sx={{ color: "#6c757d", fontSize: 24 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Main table */}
      <MaterialReactTable table={table} />

      {/* Popups */}
      {isGroupClicked && (
        <ColumnGroupingModal
          isOpen={isGroupClicked}
          onClose={() => setIsGroupClicked(false)}
          setGroupByColumn={setGroupByColumn}
        />
      )}
      {isShowAllColumnsClicked && (
        <ShowOrHideColumns
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
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
          page={table.getState().pagination.pageIndex + 1}
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
