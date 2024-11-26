import React, { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { NavLink } from 'react-router-dom'
import { render } from "@testing-library/react";
import "./pesertasemak.css";

const AdminPesertaDetailTableWidget = ({
  itemList,
  ic,
  semakUser,
  setCurrentProgram,
  setIsOpen,
}) => {

  const columns = [
    {
      field: "id",
      headerName: "Tarikh",
      flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        // Get the row index, and add 1 to start from 1
        const mula = params.row.mula;
        const tamat = params.row.tamat;
        return <p>{mula} - {tamat}</p>;
      },
    },
    {
      field: "nama",
      headerName: "Program Nama",
      flex: 2,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        return <p>{params.row.nama}</p>; // Display the first item in the array, adjust as needed
      },
    },
    {
      field: "kehadiran",
      headerName: "Kehadiran",
      flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        return <p>80%</p>;
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        const mykad = ic;
        // Display the name, or fallback to "No Data" if not found
        return <p>{params.row.pesertaStatus[mykad] || "No Data"}</p>;
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
            {`${params.row.pesertaStatus[ic]}` === "dicipta" ||
              `${params.row.pesertaStatus[ic]}` === "dikemasKini" ? (
              <button className="semakbutton" disabled={true}>
                Cipta
              </button>
            ) : (
              <NavLink
                to={`/admin/cipta-sijil/${params.row.id}/${ic}`}
                className="aktivititype"
              >
                Cipta
              </NavLink>
            )}

            {`${params.row.pesertaStatus[ic]}` === "dipadam" ||
              `${params.row.pesertaStatus[ic]}` === "-" ? (
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
                {/* kemaskini button */}
                <NavLink
                  to={`/admin/edit-sijil/${params.row.id}/${ic}`}
                  className="aktivititype"
                >
                  Kemaskini
                </NavLink>
                {/* semak button */}
                <button
                  className="semakbutton"
                  onClick={() => {
                    semakUser(params.row.id);
                  }}
                >
                  Semak
                </button>
                {/* padam button */}
                <button
                  className="padambutton"
                  onClick={() => {
                    setCurrentProgram(params.row.id);
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

export default AdminPesertaDetailTableWidget;
