import React from "react";
import { Drawer, IconButton, Button, Typography, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  actionButtons?: {
    label: string;
    onClick: () => void;
    variant?: "text" | "outlined" | "contained";
    sx?: object;
  }[];
  width?: string | number;
}

export const PopupModal: React.FC<PopupModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actionButtons = [],
  width = "400px",
}) => {
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: width,
          paddingTop: 1,
          paddingInline: 3,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
        }}
      >
        {title && (
          <Typography
            variant="subtitle1"
            sx={{ color: "#000", fontWeight: 550, fontSize: 15 }}
          >
            {title}
          </Typography>
        )}
        <IconButton onClick={onClose}>
          <CloseIcon style={{ color: "black" }} />
        </IconButton>
      </Box>

      {/* <Divider sx={{ marginTop: 2 }} /> */}

      <Box
        sx={
          {
            // overflow: "auto",
            // scrollbarWidth: "thin",
            // maxHeight: "100px",
          }
        }
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: 5,
          }}
        >
          {children}
        </Box>

        {actionButtons.length > 0 && (
          <Box
            sx={{
              marginTop: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {actionButtons.map((button, index) => (
              <Button
                key={index}
                onClick={button.onClick}
                variant={button.variant || "contained"}
                sx={{
                  height: 50,
                  ...button.sx,
                }}
              >
                {button.label}
              </Button>
            ))}
          </Box>
        )}
      </Box>
    </Drawer>
  );
};
