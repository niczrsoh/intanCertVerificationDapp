import React, { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { NavLink } from 'react-router-dom'

const AdminPesertaTableWidget = ({
  itemList,
}) => {

  const columns = [
    {
      field: "ic",
      headerName: "No. MyKad",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "nama",
      headerName: "Nama",
      flex: 3,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "aktviti",
      headerName: "Aktiviti",
      flex: 2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        return (
          <div>
            <NavLink to={`/admin/peserta-semak/${params.row.ic}`} className='aktiviti'>
                <IconButton>
                  <VisibilityIcon color="primary" />
                </IconButton>
              </NavLink>
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

export default AdminPesertaTableWidget;
