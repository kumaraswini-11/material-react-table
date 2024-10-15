import { useState } from "react";
import { Box, Switch, Typography } from "@mui/material";
import { PopupModal } from "./side-drawer-modal";

interface SwitchSectionProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
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

export const ShowOrHideColumns: React.FC<any> = ({
  columnVisibility,
  setColumnVisibility,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [tempSections, setTempSections] = useState<
    {
      label: string;
      checked: boolean;
    }[]
  >([
    { label: "ID", checked: columnVisibility.id },
    { label: "Name", checked: columnVisibility.name },
    { label: "Category", checked: columnVisibility.category },
    { label: "Subcategory", checked: columnVisibility.subcategory },
    { label: "Created At", checked: columnVisibility.createdAt },
    { label: "Updated At", checked: columnVisibility.updatedAt },
    { label: "Price", checked: columnVisibility.price },
    { label: "Sale Price", checked: columnVisibility.sale_price },
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
      acc[section.label.toLowerCase().replace(/ /g, "_")] = section.checked;
      return acc;
    }, {} as { [key: string]: boolean });

    setColumnVisibility(updatedVisibility);
    setIsModalOpen(false);
  };

  return (
    <PopupModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Create Groups"
      actionButtons={[
        {
          label: "Show all columns",
          onClick: showAllColumns,
          variant: "outlined",
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
