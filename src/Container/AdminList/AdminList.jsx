import React, { useState, useEffect } from 'react'
import filterpic from '../../img/filter.png'
import searchpic from '../../img/search.png'
import '../AdminList/adminList.css'
import { db } from '../../Backend/firebase/firebase-config'
import { collection, getDocs, orderBy, query, doc, deleteDoc } from 'firebase/firestore'
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ItemTableWidget from './AdminListTableWidget';

const AdminList = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const [searchValue, setSearchValue] = useState([]);
  const [filteredValue, setFilteredValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [adminList, setAdminList] = useState([])
  const [reload, setReload] = useState(0);
  const [tableKey, setTableKey] = useState(Date.now()); // State for forcing re-render of table
  const [totalPages, setTotalPages] = useState(0);
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  //document path of the ActionLog collection
  const userCollectionRef = collection(db, "Admin")
  const fetchAllData = async () => {
    const data = await getDocs(userCollectionRef);
    console.log(data);
    // Map through the documents and include doc.id
    const sortedAdminList = data.docs
      .map((doc) => ({ ...doc.data(), id: doc.id }))
      .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))  // Sort by "createdDate" field in descending order
      .map((doc, index) => ({
        ...doc,         // Spread the existing data
        bil: index + 1, // Add the index based on the sorted order
      }));
    // Set the sorted admin list
    setAdminList(sortedAdminList);
    setTotalPages(Math.ceil(sortedAdminList.length / ITEMS_PER_PAGE));
  };
  useEffect(() => {
    fetchAllData();
  }, [reload])

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return adminList.slice(startIndex, endIndex).map((admin, index) => ({
      ...admin, // Include the program data
      programIndex: startIndex + index, // Calculate the absolute index
    }));
  };
  // sort by using tarikh
  const tarikhfilter = () => {
    const sorted = adminList
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((item, index) => ({ ...item, bil: index + 1 }));
    setSearchValue(sorted)
  }

  // sort by using name
  const namefilter = () => {
    console.log(adminList);
    const sorted = adminList
    .sort((a, b) => new String(a.name).localeCompare(new String(b.name)))
    .map((item, index) => ({ ...item, bil: index + 1 }));
    setSearchValue(sorted)
  }

  const handleSubmit = async () => {
    if (isSearching) {
      return;
    }
    setIsSearching(true);
    //    try {
    // Search by using the value that they input
    const filtered = adminList
    .filter(obj =>
      Object.values(obj).some(value =>
        new String(value).toLowerCase().includes(new String(filteredValue.toLowerCase())) || new String(value).toLowerCase() === new String(filteredValue.toLowerCase())
      )
    )
    .map((item, index) => ({ ...item, bil: index + 1 }));
    // const filtered = adminList.find((item) => new String(item.name).toLowerCase().includes(new String(filteredValue.toLowerCase())));
    console.log(filtered);
    setSearchValue(filtered);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // }
    // catch (error) {
    //   alert('Search failed:', error);
    //   console.error('Search failed:', error);
    // } finally {
    //   // Set the isSearching flag back to false to indicate search is completed
    setIsSearching(false);
    // }
  }

  const onClickPadam = (id) => {
    if (window.confirm("Adakah anda ingin memadam akaun Admin ini?")) {
      deleteAccount(id);
    } else {
      return;
    }
  }

  const deleteAccount = async (id) => {
    const accRef = doc(db, "Admin", id.toString());
    await deleteDoc(accRef).then(() => {
      alert("Akaun Admin telah dipadam.");
      setReload(reload + 1);
    });
  }

  return (
    <div className='app_box'>
      <div className='programsec'>
        <h1 className='title'>
          Senarai Admin
        </h1>
        <div className='features'>
          {/* Sorting */}
          {/* <form className='filter'>
            <div className='filtericon'>
              <img src={filterpic} alt='This is a filter icon.' className="filterpic" />
            </div>
            <div className='dropdownbox'>
              <select value={selectedValue} className='dropdown' onChange={handleSelectChange} >
                <option value="Susunan" data-display-value="Susunan" hidden>Susunan</option>
                <option value="None" data-display-value="None">None</option>
                <option value="Tarikh&Masa" data-display-value="Tarikh & Masa">Tarikh & Masa</option>
                <option value="NamaAdmin" data-display-value="Nama Admin">Nama Admin</option>
              </select>
            </div>
          </form> */}
          <form className='search'>
            <div className='searchbox'>
              <input value={filteredValue} type="text" placeholder="Nama Admin" className='searchtype' onChange={(e) => { setFilteredValue(e.target.value); handleSubmit() }} />
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
        {filteredValue == "" ? (
          <>
            <ItemTableWidget
              key={tableKey}
              itemList={getCurrentPageItems()}
              onClickPadam={onClickPadam}
            />
          </>) : (
          <>
            <ItemTableWidget
              key={tableKey}
              itemList={searchValue}
              onClickPadam={onClickPadam}
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

export default AdminList
