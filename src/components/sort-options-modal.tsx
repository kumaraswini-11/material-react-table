import { Box, IconButton, Typography } from "@mui/material";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import { PopupModal } from "./side-drawer-modal";

interface SortSectionProps {
  label: string;
  isSort: boolean;
  onClick: () => void;
}

interface SortOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sortSections: { label: string; isSort: boolean }[];
  setSortSections: (sections: any) => void;
  tableInstance: any;
}

const SortOption: React.FC<SortSectionProps> = ({ label, isSort, onClick }) => (
  <Box
    component="section"
    sx={{
      paddingBlock: 0.7,
      paddingInline: 1,
      border: "1px solid lightgray",
      borderRadius: "5px",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: 0.5,
      marginBottom: -1,
    }}
  >
    <Typography>{label}</Typography>
    <IconButton onClick={onClick}>
      <SwapVertOutlinedIcon
        sx={{ color: isSort ? "#007bff" : "#6c757d", fontSize: 24 }}
      />
    </IconButton>
  </Box>
);

export const SortOptionsModal: React.FC<SortOptionsModalProps> = ({
  isOpen,
  onClose,
  sortSections,
  setSortSections,
  tableInstance,
}) => {
  const handleSortToggle = (label: string) => {
    setSortSections((prev: any) =>
      prev.map((section: any) =>
        section.label === label
          ? { ...section, isSort: !section.isSort }
          : section
      )
    );

    // Update sorting in the Material React Table
    const column = tableInstance.getColumn(label);
    if (column) {
      column.toggleSorting();
    }
  };

  const clearSort = () => {
    setSortSections((prev: any) =>
      prev.map((section: any) => ({ ...section, isSort: false }))
    );
    // tableInstance.resetSorting(true);
  };

  return (
    <PopupModal
      isOpen={isOpen}
      onClose={onClose}
      title="Sorting Options"
      actionButtons={[
        {
          label: "Clear Sort",
          onClick: clearSort,
          variant: "outlined",
        },
      ]}
    >
      {sortSections.map((section: any) => (
        <SortOption
          key={section.label}
          label={section.label}
          isSort={section.isSort}
          onClick={() => handleSortToggle(section.label)}
        />
      ))}
    </PopupModal>
  );
};
