import React, { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { NavLink } from 'react-router-dom'

const AdminLogTableWidget = ({
  itemList,
}) => {

  const convertDateFormat = (date) => {
    // Split the input into date and time
    const [datePart, timePart] = date.split(' ');

    // Further split the date part into year, month, and day
    const dateParts = datePart.split('-');
    
    if (dateParts.length === 3 && timePart) {
      // Return the formatted string as dd-mm-yyyy HH:MM:SS
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]} ${timePart}`;
    }

    return date; // Return the original date if the format is incorrect
  };

  const columns = [
    {
      field: "date",
      headerName: "Tarikh & Masa",
      flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        // Get the row index, and add 1 to start from 1
        const date = convertDateFormat(params.row.date);
        return <p>{date}</p>;
      },
    },
    {
      field: "adminName",
      headerName: "Nama Admin",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "adminID",
      headerName: "ID Admin",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "type",
      headerName: "Jenis",
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "transactionID",
      headerName: "TransactionID",
      flex: 3,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        return (
          <div>
            <a href={`https://bchainexplorer.azurewebsites.net/#/blockchain/transactionList/transactionDetail/${params.row.transactionId}`} target="_blank">{params.row.transactionId}</a>
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
        localeText={{
          noRowsLabel: "Tidak ada rekod dijumpai", // Custom "no rows" message
        }}
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

export default AdminLogTableWidget;
