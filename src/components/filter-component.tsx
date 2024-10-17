import React, { useState, useMemo } from "react";
import { MRT_TableInstance } from "material-react-table";
import {
  Box,
  IconButton,
  Select,
  MenuItem,
  Typography,
  Slider,
} from "@mui/material";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import { PopupModal } from "./side-drawer-modal";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import { Dayjs } from "dayjs";

interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
  table: MRT_TableInstance<any>;
}

export const FilterComponent: React.FC<FilterProps> = ({
  isOpen,
  onClose,
  table,
}) => {
  const [filters, setFilters] = useState({
    category: [] as string[],
    subcategory: [] as string[],
    priceRange: [0, 0] as [number, number],
    salePriceRange: [0, 0] as [number, number],
    createdAtDateRange: [null, null] as [Dayjs | null, Dayjs | null],
    updatedAtDateRange: [null, null] as [Dayjs | null, Dayjs | null],
  });

  const getUniqueValues = (columnId: string): string[] => {
    const uniqueValues = new Set<string>();
    table.getRowModel().rows.forEach((row) => {
      const value = row.getValue(columnId);
      if (value) {
        uniqueValues.add(String(value));
      }
    });
    return Array.from(uniqueValues);
  };

  const getMinMaxValues = (columnId: string): [number, number] => {
    let min = Infinity;
    let max = -Infinity;

    table.getRowModel().rows.forEach((row) => {
      const value = row.getValue(columnId);
      if (typeof value === "number") {
        min = Math.min(min, value);
        max = Math.max(max, value);
      }
    });

    return [min, max];
  };

  // const formatDate = (date: Dayjs | null) =>
  //   date ? date.format("MM/DD/YYYY") : "";

  const categoryOptions = useMemo(() => getUniqueValues("category"), [table]);
  const subcategoryOptions = useMemo(
    () => getUniqueValues("subcategory"),
    [table]
  );
  const priceRange = useMemo(() => getMinMaxValues("price"), [table]);
  const salePriceRange = useMemo(() => getMinMaxValues("sale_price"), [table]);

  const handleClearFilters = () => {
    table.getAllColumns().forEach((column) => column.setFilterValue(undefined));
    setFilters({
      category: [],
      subcategory: [],
      priceRange,
      salePriceRange,
      createdAtDateRange: [null, null],
      updatedAtDateRange: [null, null],
    });
  };

  const handleMultiSelectChange = (
    column: any,
    event: React.ChangeEvent<{ value: unknown }>,
    filterKey: keyof typeof filters
  ) => {
    const value = event.target.value as string[];
    setFilters((prevFilters) => ({ ...prevFilters, [filterKey]: value }));
    column.setFilterValue(value);
  };

  const handleRangeChange = (
    column: any,
    newValue: number | number[],
    filterKey: keyof typeof filters
  ) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: newValue as [number, number],
    }));
    column.setFilterValue(newValue);
  };

  const handleDateRangeChange = (
    column: any,
    newValue: [Dayjs | null, Dayjs | null],
    filterKey: keyof typeof filters
  ) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: newValue,
    }));

    if (newValue[0] && newValue[1]) {
      column.setFilterValue({
        start: newValue[0].toISOString(),
        end: newValue[1].toISOString(),
      });
    } else {
      column.setFilterValue(undefined);
    }
  };

  const handleResetFilter = (columnId: string) => {
    setFilters((prevFilters) => {
      switch (columnId) {
        case "createdAt":
          return { ...prevFilters, createdAtDateRange: [null, null] };
        case "updatedAt":
          return { ...prevFilters, updatedAtDateRange: [null, null] };
        case "price":
          return { ...prevFilters, priceRange: priceRange };
        case "sale_price":
          return { ...prevFilters, salePriceRange: salePriceRange };
        default:
          return prevFilters;
      }
    });
    table.getColumn(columnId).setFilterValue(undefined);
  };

  return (
    <PopupModal
      isOpen={isOpen}
      onClose={onClose}
      title="Filters"
      actionButtons={[
        {
          label: "Clear Filters",
          onClick: handleClearFilters,
          variant: "outlined",
          sx: { color: "black" },
        },
      ]}
    >
      {table.getLeafHeaders().map((header) => {
        const columnId = header.column.columnDef.accessorKey;
        if (columnId === "id") return null;

        return (
          <Box
            key={header.id}
            sx={{
              padding: "6px",
              backgroundColor: "#e3e3e3",
              borderRadius: "4px",
              marginBottom: "-5px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  color: "black",
                  fontWeight: 600,
                  fontSize: 14,
                  marginBottom: "5px",
                }}
              >
                {header.column.columnDef.header}
              </Typography>
              <IconButton onClick={() => handleResetFilter(columnId as string)}>
                <ReplayOutlinedIcon sx={{ color: "#708090", fontSize: 24 }} />
              </IconButton>
            </Box>

            <Box>
              {columnId === "category" ? (
                <Select
                  multiple
                  displayEmpty
                  value={filters.category}
                  onChange={(e: any) =>
                    handleMultiSelectChange(header.column, e, "category")
                  }
                  sx={{
                    width: "87%",
                    height: "50px",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontWeight: "500",
                  }}
                >
                  {categoryOptions.map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              ) : columnId === "subcategory" ? (
                <Select
                  multiple
                  displayEmpty
                  value={filters.subcategory}
                  onChange={(e: any) =>
                    handleMultiSelectChange(header.column, e, "subcategory")
                  }
                  sx={{
                    width: "87%",
                    height: "50px",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontWeight: "500",
                  }}
                >
                  {subcategoryOptions.map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              ) : columnId === "price" ? (
                <Slider
                  value={filters.priceRange}
                  min={priceRange[0]}
                  max={priceRange[1]}
                  onChange={(e, newValue) =>
                    handleRangeChange(header.column, newValue, "priceRange")
                  }
                  valueLabelDisplay="auto"
                  sx={{ width: "83%", marginLeft: "9px" }}
                />
              ) : columnId === "sale_price" ? (
                <Slider
                  value={filters.salePriceRange}
                  min={salePriceRange[0]}
                  max={salePriceRange[1]}
                  onChange={(e, newValue) =>
                    handleRangeChange(header.column, newValue, "salePriceRange")
                  }
                  valueLabelDisplay="auto"
                  sx={{ width: "83%", marginLeft: "9px" }}
                />
              ) : columnId === "createdAt" ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateRangePicker
                    value={filters.createdAtDateRange}
                    onChange={(newValue) =>
                      handleDateRangeChange(
                        header.column,
                        newValue,
                        "createdAtDateRange"
                      )
                    }
                    // renderInput={(startProps: any) => (
                    //   <input
                    //     {...startProps}
                    //     value={
                    //       filters.createdAtDateRange[0]
                    //         ? `${formatDate(
                    //             filters.createdAtDateRange[0]
                    //           )} To ${formatDate(
                    //             filters.createdAtDateRange[1]
                    //           )}`
                    //         : ""
                    //     }
                    //   />
                    // )}
                  />
                </LocalizationProvider>
              ) : columnId === "updatedAt" ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateRangePicker
                    value={filters.updatedAtDateRange}
                    onChange={(newValue) =>
                      handleDateRangeChange(
                        header.column,
                        newValue,
                        "updatedAtDateRange"
                      )
                    }
                    // renderInput={(startProps: any) => (
                    //   <input
                    //     {...startProps}
                    //     value={
                    //       filters.updatedAtDateRange[0]
                    //         ? `${formatDate(
                    //             filters.updatedAtDateRange[0]
                    //           )} To ${formatDate(
                    //             filters.updatedAtDateRange[1]
                    //           )}`
                    //         : ""
                    //     }
                    //   />
                    // )}
                  />
                </LocalizationProvider>
              ) : (
                <input
                  type="text"
                  value={(header.column.getFilterValue() as string) || ""}
                  onChange={(e) => header.column.setFilterValue(e.target.value)}
                  placeholder={`Filter by ${header.column.columnDef.header}`}
                  style={{
                    width: "87%",
                    height: "50px",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontWeight: "500",
                  }}
                />
              )}
            </Box>
          </Box>
        );
      })}
    </PopupModal>
  );
};
