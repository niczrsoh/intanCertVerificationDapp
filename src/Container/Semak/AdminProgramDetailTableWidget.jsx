import React, { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { NavLink } from 'react-router-dom'
import { render } from "@testing-library/react";
import "./semak.css";

const AdminProgramDetailTableWidget = ({
  itemList,
  programID,
  semakUser,
  setCurrentUser,
  setIsOpen
}) => {

  const columns = [
    {
      field: "id",
      headerName: "Bil",
      flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        // Get the row index, and add 1 to start from 1
        const rowIndex = params.row.id;
        return <p>{rowIndex}</p>;
      },
    },
    {
      field: "mykad",
      headerName: "No. MyKad",
      flex: 2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        return <p>{params.row.mykad}</p>; // Display the first item in the array, adjust as needed
      },
    },
    {
      field: "pesertaNama",
      headerName: "Nama Peserta",
      flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        // Get the 'mykad' for the current row
        const mykad = params.row.mykad;

        // Find the corresponding name from the pesertaNamaMapping object
        const pesertaNama = params.row.pesertaNama

        // Display the name, or fallback to "No Data" if not found
        return <p>{params.row.pesertaNama || "No Data"}</p>;
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        const pesertaStatusMapping = params.row.pesertaStatus;  // Access mapping from the row's data
        const mykad = params.row.mykad;
        const pesertaStatus = params.row.pesertaStatus;  // Find the corresponding status from the pesertaStatusMapping object
        // Display the name, or fallback to "No Data" if not found
        return <p>{params.row.pesertaStatus || "No Data"}</p>;
      },
    },
    {
      field: "sijil",
      headerName: "Sijil",
      flex: 3,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        const mykad = params.row.mykad;
        const pesertaStatus = params.row.pesertaStatus;  // Find the corresponding status from the pesertaStatusMapping object
        return (
          <div>
            {`${pesertaStatus}` === "Dicipta" ||
              `${pesertaStatus}` === "Dikemaskini" ? (
              <button className="semakbutton" disabled={true}>
                Cipta
              </button>
            ) : (
              <NavLink
                to={`/admin/cipta-sijil/${programID}/${mykad}`}
                className="semakbutton"
              >
                Cipta
              </NavLink>
            )}

            {`${pesertaStatus}` === "Dipadam" || `${pesertaStatus}` === "-" ? (
              <>
                <button className="semakbutton" disabled={true}>
                  Kemaskini
                </button>
                <button className="semakbutton" disabled={true}>
                  Semak
                </button>
                <button className="semakbutton" disabled={true}>
                  Padam
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to={`/admin/edit-sijil/${programID}/${mykad}`}
                  className="semakbutton"
                >
                  Kemaskini
                </NavLink>
                <button
                  className="semakbutton"
                  onClick={() => {
                    semakUser(mykad);
                  }}
                >
                  Semak
                </button>
                <button
                  className="semakbutton"
                  onClick={() => {
                    setCurrentUser(mykad);
                    setIsOpen(true);
                  }}
                >
                  Padam
                </button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  const getRowId = (row) => row.id;

  return (
    <Box>
      {(itemList.length === 0) ? "Tiada data" :
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
        />}
    </Box>
  );
};

export default AdminProgramDetailTableWidget;
