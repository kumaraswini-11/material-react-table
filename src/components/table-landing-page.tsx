"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_TableContainer,
  MRT_TableHeadCellFilterContainer,
  useMaterialReactTable,
} from "material-react-table";
import { format } from "date-fns";
import {
  Box,
  IconButton,
  Tooltip,
  Pagination,
  Stack,
  Paper,
  useMediaQuery,
} from "@mui/material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import { sampleDataType } from "@/types/sample-data";
import { ColumnGroupingModal } from "./column-grouping-selector";
import { ShowOrHideColumns } from "./column-visibility-toggle";
import { SortOptionsModal } from "./sort-options-modal";
import { Filter, Filters } from "./filters";

interface ModalState {
  grouping: boolean;
  showOrHideColumn: boolean;
  sorting: boolean;
  filtering: boolean;
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
    filtering: false,
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
  const [filters, setFilters] = useState<Filter[]>([]);
  const isMobile = useMediaQuery("(max-width: 1000px)");

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

  // const filteredData = useMemo(() => {
  //   return sampleData.filter((row) => {
  //     return filters.every((filter) => {
  //       if (filter.type === "input") {
  //         return row[filter.label.toLowerCase()]
  //           ?.toString()
  //           .toLowerCase()
  //           .includes(filter.value.toString().toLowerCase());
  //       } else if (filter.type === "select") {
  //         return (
  //           filter.value === "" ||
  //           row[filter.label.toLowerCase()] === filter.value
  //         );
  //       } else if (filter.type === "slider-range") {
  //         return (
  //           row[filter.label.toLowerCase()] >= filter.value[0] &&
  //           row[filter.label.toLowerCase()] <= filter.value[1]
  //         );
  //       } else if (filter.type === "date-range") {
  //         const [startDate, endDate] = filter.value;
  //         const rowDate = new Date(row[filter.label.toLowerCase()]);
  //         return (
  //           (!startDate || rowDate >= new Date(startDate)) &&
  //           (!endDate || rowDate <= new Date(endDate))
  //         );
  //       }
  //       return true;
  //     });
  //   });
  // }, [sampleData, filters]);

  const handleFiltersChange = (newFilters: Filter[]) => {
    setFilters(newFilters);
  };

  const columns = useMemo<MRT_ColumnDef<sampleDataType>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        filterVariant: "text",
        filterFn: "equals",
        size: 50,
      },
      {
        accessorKey: "name",
        header: "Name",
        filterVariant: "text",
        filterFn: "fuzzy",
        size: 230,
      },
      {
        accessorKey: "category",
        header: "Category",
        filterVariant: "select",
        filterFn: "equals",
        size: 150,
      },
      {
        accessorKey: "subcategory",
        header: "Subcategory",
        filterVariant: "select",
        size: 150,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        filterVariant: "date-range",
        columnFilterModeOptions: ["between", "greaterThan", "lessThan"],
        filterFn: "between",
        size: 100,
        // Format the date to DD-MMM-YY
        Cell: ({ cell }) =>
          format(new Date(cell.getValue<Date>()), "dd-MMM-yy"),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        filterVariant: "date-range",
        columnFilterModeOptions: ["between", "greaterThan", "lessThan"],
        filterFn: "between",
        size: 100,
        // Format the date to DD-MMM-YY
        Cell: ({ cell }) =>
          format(new Date(cell.getValue<Date>()), "dd-MMM-yy"),
      },
      {
        accessorKey: "price",
        header: "Price",
        filterVariant: "range-slider",
        columnFilterModeOptions: ["between", "greaterThan", "lessThan"],
        filterFn: "between",
        size: 100,
      },
      {
        accessorKey: "sale_price",
        header: "Sale Price",
        filterVariant: "range-slider",
        columnFilterModeOptions: ["between", "greaterThan", "lessThan"],
        filterFn: "between",
        size: 100,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: sampleData,
    columnFilterDisplayMode: "custom",
    globalFilterFn: "fuzzy",

    initialState: {
      pagination: pagination,
      showGlobalFilter: true,
      grouping: groupByColumn,
      showColumnFilters: true,
    },

    filterFns: {
      customFilterFn: (row, id, filterValue) => {
        return row.getValue(id) === filterValue;
      },
    },
    localization: {
      filterCustomFilterFn: "Custom Filter Fn",
    } as any,

    muiFilterTextFieldProps: ({ column }) => ({
      label: `Filter by ${column.columnDef.header}`,
    }),

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

    enableFacetedValues: true,
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
      {/* <Stack direction={isMobile ? "column-reverse" : "row"} gap="8px">
        <MRT_TableContainer table={table} />
        <Paper>
          <Stack p="8px" gap="8px">
            {table.getLeafHeaders().map((header) => (
              <MRT_TableHeadCellFilterContainer
                key={header.id}
                header={header}
                table={table}
                in
              />
            ))}
          </Stack>
        </Paper>
      </Stack> */}
      <MaterialReactTable
        table={table}
        // data={filteredData}
      />

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
      {modalState.filtering && (
        <Filters
          isOpen={modalState.filtering}
          onClose={() => closeModal("filtering")}
          filters={filters}
          setFilters={handleFiltersChange}
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
