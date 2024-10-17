import { Box, IconButton, Typography } from "@mui/material";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import { PopupModal } from "./side-drawer-modal";
import { MRT_ColumnDef } from "material-react-table";

interface SortOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sortingState: { id: string; desc: boolean }[];
  setSortingState: React.Dispatch<
    React.SetStateAction<{ id: string; desc: boolean }[]>
  >;
  tableInstance: any;
  columns: MRT_ColumnDef<any>[];
}

export const SortOptionsModal: React.FC<SortOptionsModalProps> = ({
  isOpen,
  onClose,
  sortingState,
  setSortingState,
  tableInstance,
  columns,
}) => {
  const handleSortToggle = (id: string) => {
    const columnSorting = sortingState.find((s) => s.id === id);

    if (columnSorting) {
      const updatedSorting = sortingState.map((section) =>
        section.id === id ? { ...section, desc: !section.desc } : section
      );
      setSortingState(updatedSorting);
      tableInstance.setSorting(updatedSorting);
    } else {
      const newSorting = [...sortingState, { id, desc: false }];
      setSortingState(newSorting);
      tableInstance.setSorting(newSorting);
    }
  };

  const clearSort = () => {
    const resetSorting = sortingState.map((section) => ({
      ...section,
      desc: false,
    }));

    setSortingState(resetSorting);
    tableInstance.resetSorting(true);
  };

  const getColumnLabel = (id: string) => {
    const column = columns.find((col) => col.accessorKey === id);
    return column?.header ?? id;
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
      {sortingState?.map((section) => (
        <Box
          key={section.id}
          sx={{
            paddingY: 1,
            paddingX: 2,
            border: "1px solid lightgray",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 1,
            mb: -1,
          }}
        >
          <Typography variant="body1">{getColumnLabel(section.id)}</Typography>
          <IconButton onClick={() => handleSortToggle(section.id)}>
            <SwapVertOutlinedIcon
              sx={{
                color: "gray",
                fontSize: 24,
              }}
            />
          </IconButton>
        </Box>
      ))}
    </PopupModal>
  );
};
