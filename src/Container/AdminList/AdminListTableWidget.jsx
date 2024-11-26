import React, { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { NavLink } from 'react-router-dom'
import { render } from "@testing-library/react";

const AdminListTableWidget = ({
  itemList,
  onClickPadam,
}) => {
  const columns = [
    {
      field: "bil",
      headerName: "Bil",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "name",
      headerName: "Nama Admin",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "id",
      headerName: "ID Admin",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "acc",
      headerName: "Admin E-Wallet",
      flex: 3,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "aktiviti",
      headerName: "Aktiviti",
      flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        return (
          <div>
            <IconButton
              onClick={(e) => onClickPadam(params.row.id)}
            >
              <DeleteIcon color={"error"} />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const getRowId = (row) => row.id;

  return (
    <Box>
      <DataGrid
        rows={itemList}
        columns={columns}
        getRowId={getRowId}
        hideFooter={true}
        sx={{
          ...{
            fontSize: "16px",
          },
          "& .super-app-theme--header": {
            backgroundColor: "#636DCF",
            color: "#fff",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-row:nth-of-type(odd)": {
            backgroundColor: "#F0F0F0",
          },
          "& .MuiDataGrid-row:nth-of-type(even)": {
            backgroundColor: "#FFFFFF",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid rgba(224, 224, 224, 1)",
          },
          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: "#D3D3D3", // Change this to your desired color for selected rows
            "&:hover": {
              backgroundColor: "#D3D3D3", // Ensure the hover effect does not change the color
            },
          },
        }}
      />
    </Box>
  );
};

export default AdminListTableWidget;
