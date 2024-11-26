import React, { useState, useEffect } from 'react'
import filterpic from '../../img/filter.png'
import searchpic from '../../img/search.png'
import '../Log/log.css'
import { db } from '../../Backend/firebase/firebase-config'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import ItemTableWidget from './AdminLogTableWidget';

const Log = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const [searchValue, setSearchValue] = useState([]);
  const [filteredValue, setFilteredValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [logs, setLogs] = useState([])
  const [tableKey, setTableKey] = useState(Date.now()); // State for forcing re-render of table

  //document path of the ActionLog collection
  const userCollectionRef = collection(db, "ActionLog")

  useEffect(() => {
    const getLog = async () => {
      //get all the document data in the ActionLog collection
      const data = await getDocs(query(userCollectionRef, orderBy("date", "desc")));
      console.log(data);
      setLogs(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }

    getLog().then(console.log(logs));
  }, [])


  // sort by using tarikh
  const tarikhfilter = () => {
    const sorted = logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setSearchValue(sorted)
  }

  // sort by using name
  const namefilter = () => {
    console.log(logs);
    const sorted = logs.sort((a, b) => new String(a.adminName).localeCompare(new String(b.adminName)));
    setSearchValue(sorted)
  }

  const handleSelectChange = (event) => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    const displayValue = selectedOption.getAttribute('data-display-value');
    selectedOption.textContent = displayValue;
    // By default the display value should be Susunan to indicate this is for the susunan filter function
    // There don't have any "Susunan" in the list instead of "None" to indicate that they are filtering nothing
    if (selectedOption.value === "None") {
      selectedOption.value = "Susunan";
    }
    setSelectedValue(selectedOption.value);
    if (selectedOption.value === "Tarikh&Masa") { tarikhfilter(); }
    else if (selectedOption.value === "NamaAdmin") { namefilter(); }
    else if (selectedOption.value === "Susunan") { setSearchValue(logs) }


  };

  const handleSubmit = async () => {
    if (isSearching) {
      return;
    }
    setIsSearching(true);
    //    try {
    // Search by using the value that they input
    const filtered = logs.filter(obj =>
      Object.values(obj).some(value =>
        new String(value).toLowerCase().includes(new String(filteredValue.toLowerCase())) || new String(value).toLowerCase() === new String(filteredValue.toLowerCase())
      )
    );
    // const filtered = logs.find((item) => new String(item.adminName).toLowerCase().includes(new String(filteredValue.toLowerCase())));
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

  return (
    <div className='app_box'>
      <div className='programsec'>
        <h1 className='title'>
          LOG AKTIVITI
        </h1>
        <div className='features'>
          {/* Sorting */}
          <form className='filter'>
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
          </form>
          <form className='search'>
            <div className='searchbox'>
              <input value={filteredValue} type="text" placeholder="Nama Admin" className='searchtype' onChange={(e) => { setFilteredValue(e.target.value); handleSubmit();}} />
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
              itemList={logs}
            />
          </>) : (
          <>
            <ItemTableWidget
              key={tableKey}
              itemList={searchValue}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default Log
