import React, { useState } from "react";
import {
  Box,
  IconButton,
  Select,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Input as BaseInput, InputProps } from "@mui/base/Input";
import { styled } from "@mui/system";
import { PopupModal } from "./side-drawer-modal";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import { grey, blue } from "@mui/material/colors";

interface Filter {
  label: string;
  placeholder?: string;
  value: string;
  type: "input" | "select";
  options?: string[];
}

interface FiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

const InputElement = styled("input")(
  ({ theme }) => `
  width: 320px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  box-shadow: 0px 2px 4px ${
    theme.palette.mode === "dark" ? "rgba(0,0,0, 0.5)" : "rgba(0,0,0, 0.05)"
  };

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${
      theme.palette.mode === "dark" ? blue[600] : blue[200]
    };
  }

  &:focus-visible {
    outline: 0;
  }
`
);

const Input = React.forwardRef(function CustomInput(
  props: InputProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return <BaseInput slots={{ input: InputElement }} {...props} ref={ref} />;
});

export const Filters: React.FC<FiltersProps> = ({ isOpen, onClose }) => {
  const [filterSections, setFilterSections] = useState<Filter[]>([
    {
      label: "Name",
      placeholder: "Select name",
      value: "",
      type: "input",
    },
    {
      label: "Category",
      placeholder: "Select value",
      value: "",
      type: "select",
      options: ["Option 1", "Option 2", "Option 3"],
    },
    {
      label: "Subcategory",
      placeholder: "Select value",
      value: "",
      type: "select",
      options: ["Option 1", "Option 2", "Option 3"],
    },
    {
      label: "Created At",
      placeholder: "Select value",
      value: "",
      type: "input",
    },
    {
      label: "Updated At",
      placeholder: "Select value",
      value: "",
      type: "input",
    },
    {
      label: "Price",
      placeholder: "Select value",
      value: "",
      type: "input",
    },
  ]);

  const handleClearFilters = () => {
    setFilterSections(
      filterSections.map((filter) => ({ ...filter, value: "" }))
    );
  };

  const handleInputChange = (index: number, value: string) => {
    const newFilters = [...filterSections];
    newFilters[index].value = value;
    setFilterSections(newFilters);
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
        },
      ]}
    >
      <Box>
        {filterSections.map((filter, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: grey[200],
              mb: 1,
              borderRadius: "5px",
              padding: 1,
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
                sx={{ color: grey[900], fontWeight: 500, fontSize: 16 }}
              >
                {filter.label}
              </Typography>
              <IconButton onClick={() => handleInputChange(index, "")}>
                <ReplayOutlinedIcon sx={{ color: grey[600], fontSize: 28 }} />
              </IconButton>
            </Box>

            {filter.type === "input" ? (
              <Input
                aria-label={`Input for ${filter.label}`}
                placeholder={filter.placeholder}
                value={filter.value}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            ) : (
              <FormControl fullWidth variant="outlined">
                {/* <InputLabel>{filter.label}</InputLabel> */}
                <Select
                  value={filter.value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                >
                  {filter.options?.map((option, idx) => (
                    <MenuItem key={idx} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        ))}
      </Box>
    </PopupModal>
  );
};
