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
  const nomykadfilter = () => {
    // console.log(users);
      const sorted = users.sort((a, b) => a.ic.localeCompare(b.ic));
      setSearchValue(sorted)}

  const namefilter = () => {
      const sorted = users.sort((a, b) => a.nama.localeCompare(b.nama));
      setSearchValue(sorted)}

    const handleSelectChange = (event) => {
      const selectedOption = event.target.options[event.target.selectedIndex];
      const displayValue = selectedOption.getAttribute('data-display-value');
      selectedOption.textContent = displayValue;
      
      // By default the display value should be Susunan to indicate this is for the susunan filter function
      // There don't have any "Susunan" in the list instead of "None" to indicate that they are filtering nothing
      if (selectedOption.value === "None"){
        selectedOption.value = "Susunan";
      }
      setSelectedValue(selectedOption.value);
      if (selectedOption.value === "No.MyKad"){nomykadfilter();}
      else if (selectedOption.value === "Nama"){namefilter();}
      else if (selectedOption.value === "Susunan"){setSearchValue(users)}


    };

    const handleSubmit = async () => {
      if (isSearching) {
        return;
      }
      setIsSearching(true);
      try{
        // Check the value whether it is number, if so, filter using nomykad, or else using name
        const lowerCaseFilteredValue = filteredValue.toLowerCase();

        const filtered = users.filter(item =>
          Object.values(item).some(val =>
            val.toString().toLowerCase().includes(lowerCaseFilteredValue)
          )
        );
        setSearchValue(filtered);
      await new Promise((resolve) => setTimeout(resolve, 2000));}
      catch (error) {
        console.error('Search failed:', error);
      } finally {
        // Set the isSearching flag back to false to indicate search is completed
        setIsSearching(false);
      }
    }
  
  return (
    <div className='app_box'>
    <div className='programsec'>
        <h1 className='title'>
        SENARAI PESERTA
        </h1>
        <div className='features'>
            <form className='search'>
                <div className='searchbox'>
                    <input value={filteredValue} type="text" placeholder="No. Mykad / Nama peserta" className='searchtype' onChange={e => setFilteredValue(e.target.value)}/>
                </div>
                <div className='filtericon'>
                    <button className="searchbutton" onClick={handleSubmit} disabled={isSearching}>
                        <img src={searchpic} alt='This is a search button.' className="searchpic" />
                    </button>
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
              itemList={searchValue}
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
