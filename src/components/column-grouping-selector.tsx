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
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedColumn, setSelectedColumn] = useState<string>("");

  const handleSelectChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSelectedColumn(event.target.value);
  };

  const clearGrouping = () => {
    setSelectedColumn("");
    // setGroupByColumn("");
  };

  const applyGrouping = () => {
    if (selectedColumn) {
      setGroupByColumn([selectedColumn.toLowerCase()]);
      onClose();
    }
  };

  return (
    <PopupModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Create Groups"
      actionButtons={[
        {
          label: "Clear grouping",
          onClick: clearGrouping,
          variant: "outlined",
        },
        {
          label: "Apply grouping",
          onClick: applyGrouping,
          variant: "contained",
        },
      ]}
    >
      <Select
        inputProps={{ "aria-label": "Without label" }}
        displayEmpty
        value={selectedColumn}
        renderValue={(selected) => {
          if (!selected || selected === "") {
            return "Select a column";
          }
          return selected;
        }}
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
