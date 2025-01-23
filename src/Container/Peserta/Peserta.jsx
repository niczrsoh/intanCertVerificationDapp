import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import './peserta.css'
import filterpic from '../../img/filter.png'
import searchpic from '../../img/search.png'
import { db } from '../../Backend/firebase/firebase-config'
import { collection, getDocs, deleteDoc, doc, } from 'firebase/firestore'
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ItemTableWidget from './AdminPesertaTableWidget';

const Peserta = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const [searchValue, setSearchValue] = useState("");
  const [filteredValue, setFilteredValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [tableKey, setTableKey] = useState(Date.now()); // State for forcing re-render of table
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const ITEMS_PER_PAGE = 10;
        // Fetch total item count to calculate total pages
      const fetchAllData = async () => {
          const ref = collection(db, "User");
          const data = await getDocs(ref);
          const userData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setUsers(userData);
          setTotalPages(Math.ceil(userData.length / ITEMS_PER_PAGE));
        };
  useEffect(() => {
    fetchAllData();
  },[])
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return users.slice(startIndex, endIndex).map((user, index) => ({
      ...user, // Include the program data
      programIndex: startIndex + index, // Calculate the absolute index
    }));
  };

  const filteredData = users.filter(
    (item) =>
      item.ic.includes(searchValue.toLowerCase()) ||
      item.nama.toLowerCase().includes(searchValue.toLowerCase()) 
  );
  
  return (
    <div className='app_box'>
    <div className='programsec'>
        <h1 className='title'>
        SENARAI PESERTA
        </h1>
        <div className='features'>
            <form className='search'>
                <div className='searchbox'>
                    <input value={searchValue} type="text" placeholder="No. Mykad / Nama peserta" className='searchtype' onChange={e => setSearchValue(e.target.value)}/>
                </div>
                <div className='filtericon'>
                  <img src={searchpic} alt='This is a search button.' className="searchpic" />
                </div>
            </form>
        </div>
    </div>
      <div className='program'>
      {searchValue === "" ? (
          <>
            <ItemTableWidget
              key={tableKey}
              itemList={getCurrentPageItems()}
            />
          </>
        ) : (
          <>
            <ItemTableWidget
              key={tableKey}
              itemList={filteredData}
            />
          </>
        )}

      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                style={{
                  margin: "0 5px",
                  padding: "10px",
                  borderRadius: "50%",
                  background: index + 1 === currentPage ? "blue" : "gray",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
    </div>
  )
}

export default Peserta
