import { useState } from "react";
import { MenuItem, Select } from "@mui/material";
import { PopupModal } from "./side-drawer-modal";

interface ColumnGroupingModalProps {
  isOpen: boolean;
  onClose: () => void;
  setGroupByColumn: (selectedColumn: [string]) => void;
}

export const ColumnGroupingModal: React.FC<ColumnGroupingModalProps> = ({
  isOpen,
  onClose,
  setGroupByColumn,
}) => {
  const [selectedColumn, setSelectedColumn] = useState<string>("");

  const handleSelectChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSelectedColumn(event.target.value);
  };

  const handleClearGrouping = () => {
    setSelectedColumn("");
    // setGroupByColumn("");
  };

  const handleApplyGrouping = () => {
    if (selectedColumn) {
      setGroupByColumn([selectedColumn.toLowerCase()]);
      onClose();
    }
  };

  return (
    <PopupModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Groups"
      actionButtons={[
        {
          label: "Clear grouping",
          onClick: handleClearGrouping,
          variant: "outlined",
          sx: { color: "black" },
        },
        {
          label: "Apply grouping",
          onClick: handleApplyGrouping,
          variant: "contained",
        },
      ]}
    >
      <Select
        inputProps={{ "aria-label": "Select a column to group by" }}
        displayEmpty
        value={selectedColumn}
        renderValue={(selected) => {
          if (!selected || selected === "") {
            return "Select a column";
          }
          return selected;
        }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={(event) => handleSelectChange(event as any)}
        sx={{ height: 45 }}
      >
        {["Category", "Subcategory"].map((item, index) => (
          <MenuItem key={index} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </PopupModal>
  );
};
