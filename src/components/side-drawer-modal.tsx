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
  width = "450px",
}) => {
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: width,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 1,
          background: "white",
          paddingBlock: "10px",
          paddingInline: "21px",
        }}
      >
        {title && (
          <Typography
            variant="subtitle1"
            sx={{ color: "#364356e6", fontWeight: 550, fontSize: 15 }}
          >
            {title}
          </Typography>
        )}
        <IconButton onClick={onClose}>
          <CloseIcon style={{ color: "black" }} />
        </IconButton>
      </Box>

      <Box
        sx={{
          maxHeight: "91vh",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: "5px",
            paddingBlock: "10px",
            paddingInline: "21px",
          }}
        >
          {children}
        </Box>

        {actionButtons.length > 0 && (
          <Box
            sx={{
              marginTop: 1.3,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              paddingBlock: "10px",
              paddingInline: "21px",
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
