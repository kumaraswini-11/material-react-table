import { useState } from "react";
import { Box, Switch, Typography } from "@mui/material";
import { PopupModal } from "./side-drawer-modal";

export type ColumnVisibilityType = {
  id: boolean;
  name: boolean;
  category: boolean;
  subcategory: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  price: boolean;
  sale_price: boolean;
};

interface SwitchSectionProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface ShowOrHideColumnsProps {
  isOpen: boolean;
  onClose: () => void;
  columnVisibility: ColumnVisibilityType; // Use boolean visibility map
  setColumnVisibility: (visibility: ColumnVisibilityType) => void;
}

const SwitchSection: React.FC<SwitchSectionProps> = ({
  label,
  checked,
  onChange,
}) => (
  <Box
    component="section"
    sx={{
      paddingInline: 1,
      paddingTop: 1,
      paddingBottom: 1,
      border: "1px solid lightgray",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: -1,
    }}
  >
    <Typography>{label}</Typography>
    <Switch
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      inputProps={{ "aria-label": label }}
    />
  </Box>
);

export const ShowOrHideColumns: React.FC<ShowOrHideColumnsProps> = ({
  isOpen,
  onClose,
  columnVisibility,
  setColumnVisibility,
}) => {
  const [tempSections, setTempSections] = useState([
    { label: "ID", field: "id", checked: columnVisibility.id },
    { label: "Name", field: "name", checked: columnVisibility.name },
    {
      label: "Category",
      field: "category",
      checked: columnVisibility.category,
    },
    {
      label: "Subcategory",
      field: "subcategory",
      checked: columnVisibility.subcategory,
    },
    {
      label: "Created At",
      field: "createdAt",
      checked: columnVisibility.createdAt,
    },
    {
      label: "Updated At",
      field: "updatedAt",
      checked: columnVisibility.updatedAt,
    },
    { label: "Price", field: "price", checked: columnVisibility.price },
    {
      label: "Sale Price",
      field: "sale_price",
      checked: columnVisibility.sale_price,
    },
  ]);

  const toggleSwitch = (index: number, checked: boolean) => {
    setTempSections((prev) =>
      prev.map((section, i) =>
        i === index ? { ...section, checked } : section
      )
    );
  };

  const showAllColumns = () => {
    const updatedSections = tempSections.map((section) => ({
      ...section,
      checked: true,
    }));
    setTempSections(updatedSections);
  };

  const apply = () => {
    const updatedVisibility = tempSections.reduce((acc, section) => {
      const field = section.field as keyof ColumnVisibilityType;
      acc[field] = section.checked;
      return acc;
    }, {} as ColumnVisibilityType);

    setColumnVisibility(updatedVisibility);
    onClose();
  };

  return (
    <PopupModal
      isOpen={isOpen}
      onClose={onClose}
      title="Show/Hide Columns"
      actionButtons={[
        {
          label: "Show all columns",
          onClick: showAllColumns,
          variant: "outlined",
          sx: { color: "black" },
        },
        {
          label: "Apply",
          onClick: apply,
          variant: "contained",
        },
      ]}
    >
      {tempSections.map((section, index) => (
        <SwitchSection
          key={index}
          label={section.label}
          checked={section.checked}
          onChange={(checked) => toggleSwitch(index, checked)}
        />
      ))}
    </PopupModal>
  );
};
