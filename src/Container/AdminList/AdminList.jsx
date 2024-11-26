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

  //document path of the ActionLog collection
  const userCollectionRef = collection(db, "Admin")

  useEffect(() => {
    const getAdminList = async () => {
      //get all the document data in the ActionLog collection
      const data = await getDocs(userCollectionRef);
      console.log(data);
      // Map through the documents and include doc.id, then sort by the "name" field
      const sortedAdminList = data.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .sort((a, b) => a.name.localeCompare(b.name))  // Sort by "name" field in ascending order
        .map((doc, index) => ({
          ...doc,         // Spread the existing data
          bil: index + 1, // Add the index based on the sorted order
        }));
      // Set the sorted admin list
      setAdminList(sortedAdminList);
    }

    getAdminList().then(console.log(adminList));
  }, [reload])


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
    if (window.confirm("Adakah anda ingin memadamkan akaun admin ini?")) {
      deleteAccount(id);
    } else {
      return;
    }
  }

  const deleteAccount = async (id) => {
    const accRef = doc(db, "Admin", id.toString());
    await deleteDoc(accRef).then(() => {
      alert("Akaun Admin telah dipadam!!");
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
              itemList={adminList}
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
    </div>
  )
}

export default AdminList
