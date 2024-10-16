import React, { useState, useCallback } from "react";
import {
  Box,
  IconButton,
  Select,
  MenuItem,
  Typography,
  FormControl,
  TextField,
  Slider,
} from "@mui/material";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import { grey } from "@mui/material/colors";
import { PopupModal } from "./side-drawer-modal";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro";

export interface Filter {
  label: string;
  placeholder?: string;
  value: string | number[] | [Date | null, Date | null];
  type: "input" | "select" | "date-range" | "slider-range";
  options?: string[];
}

interface FiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filter[];
  setFilters: (newFilters: Filter[]) => void;
}

export const Filters: React.FC<FiltersProps> = React.memo(
  ({ isOpen, onClose }) => {
    const inputHeight = "50px";
    const [filters, setFilters] = useState<Filter[]>([
      { label: "Name", placeholder: "Enter name", value: "", type: "input" },
      {
        label: "Category",
        placeholder: "Select a value",
        value: "",
        type: "select",
        options: ["Option 1", "Option 2", "Option 3"],
      },
      {
        label: "Subcategory",
        placeholder: "Select a value",
        value: "",
        type: "select",
        options: ["Option 1", "Option 2", "Option 3"],
      },
      {
        label: "Created At",
        placeholder: "Select date range",
        value: [null, null],
        type: "date-range",
      },
      {
        label: "Updated At",
        placeholder: "Select date range",
        value: [null, null],
        type: "date-range",
      },
      {
        label: "Price",
        placeholder: "Enter price",
        value: [0, 100],
        type: "slider-range",
      },
      {
        label: "Sale Price",
        placeholder: "Enter price",
        value: [0, 100],
        type: "slider-range",
      },
    ]);

    const handleClearFilters = useCallback(() => {
      setFilters((prevFilters) =>
        prevFilters.map((filter) => ({
          ...filter,
          value:
            filter.type === "date-range"
              ? [null, null]
              : filter.type === "slider-range"
              ? [0, 100]
              : "",
        }))
      );
    }, []);

    const handleInputChange = useCallback(
      (
        index: number,
        value: string | number[] | [Date | null, Date | null]
      ) => {
        setFilters((prevFilters) => {
          const newFilters = [...prevFilters];
          newFilters[index].value = value;
          return newFilters;
        });
      },
      []
    );

    const handleSliderChange = useCallback(
      (index: number, newValue: number[]) => {
        handleInputChange(index, newValue);
      },
      [handleInputChange]
    );

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
          },
        ]}
      >
        <Box sx={{ mt: -2 }}>
          {filters.map((filter, index) => (
            <Box
              key={filter.label}
              sx={{
                backgroundColor: grey[100],
                borderRadius: "5px",
                padding: 1,
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: -1,
                }}
              >
                <Typography
                  sx={{ color: grey[900], fontWeight: 500, fontSize: 16 }}
                >
                  {filter.label}
                </Typography>
                <IconButton
                  onClick={() =>
                    handleInputChange(
                      index,
                      filter.type === "date-range"
                        ? [null, null]
                        : filter.type === "slider-range"
                        ? [0, 100]
                        : ""
                    )
                  }
                >
                  <ReplayOutlinedIcon sx={{ color: grey[600], fontSize: 24 }} />
                </IconButton>
              </Box>

              {/* Input Field */}
              {filter.type === "input" ? (
                <FormControl fullWidth>
                  <TextField
                    aria-label={`Input for ${filter.label}`}
                    variant="outlined"
                    placeholder={filter.placeholder}
                    value={filter.value as string}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    fullWidth
                    sx={{ width: "85%", height: inputHeight }}
                    InputProps={{ sx: { height: inputHeight } }}
                  />
                </FormControl>
              ) : filter.type === "select" ? (
                // Select Field
                <FormControl fullWidth>
                  <Select
                    displayEmpty
                    value={filter.value as string}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    inputProps={{
                      "aria-label": `Select a value for ${filter.label}`,
                    }}
                    sx={{
                      height: inputHeight,
                      width: "85%",
                      display: "flex",
                      alignItems: "center",
                    }}
                    renderValue={(selected) =>
                      selected || filter.placeholder || "Select a value"
                    }
                  >
                    {filter.options?.map((option, idx) => (
                      <MenuItem key={idx} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : filter.type === "date-range" ? (
                // Date Range Picker Field
                <Box sx={{ width: "85%" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateRangePicker
                      value={filter.value as any}
                      onChange={(newValue: any) =>
                        handleInputChange(index, newValue)
                      }
                      sx={{
                        ".MuiOutlinedInput-input": {
                          height: 15,
                          fontSize: "12px",
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Box>
              ) : filter.type === "slider-range" ? (
                // Slider Range Field
                <Box sx={{ width: "85%", ml: 1.2 }}>
                  <Slider
                    value={filter.value as number[]}
                    onChange={(_, newValue) =>
                      handleSliderChange(index, newValue as number[])
                    }
                    valueLabelDisplay="auto"
                    min={0}
                    max={100}
                  />
                </Box>
              ) : null}
            </Box>
          ))}
        </Box>
      </PopupModal>
    );
  }
);
