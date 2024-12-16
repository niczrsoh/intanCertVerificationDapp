import React,{useState,useEffect} from 'react'
import "./styles/SenaraiProgram.css"
import Intan from "../intan.png"
import { NavLink } from "react-router-dom";
import { db } from '../Backend/firebase/firebase-config'
import { collection, getDocs, deleteDoc, doc,} from 'firebase/firestore'
import ItemTableWidget from './UserProgramTableWidget';

function SenaraiProgramSediaAda() {
  //state for showing the pop out page
  const [searchValue, setSearchValue] = useState("");
  const [programs,setPrograms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [tableKey, setTableKey] = useState(Date.now()); // State for forcing re-render of table
  const [totalPages, setTotalPages] = useState(0);
  //Filter the data array based on the nama or kod value entered by the user.
  const filteredData = programs.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.kod.toLowerCase().includes(searchValue.toLowerCase())
  );
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Convert the string to a Date object
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  };
  const userCollectionRef = collection(db, "Program")
      // Fetch total item count to calculate total pages
      const fetchAllData = async () => {
        const ref = collection(db, "Program");
        const snapshot = await getDocs(ref);
        
        // Transform data and sort by formattedDate
        const fetchedItems = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          formattedMula: formatDate(doc.data().mula.split("/").reverse().join("-")), // Format mula to Date
          formattedTamat: formatDate(doc.data().tamat.split("/").reverse().join("-")), // Format tamat to Date
        }));
        const sortedItems = fetchedItems.sort((a, b) => new Date(b.mula) - new Date(a.mula)); // Sort in descending order
    
        setPrograms(sortedItems);
        setTotalPages(Math.ceil(sortedItems.length / ITEMS_PER_PAGE));
      };
 
  //fetch all the document data in the Program collections
  useEffect(() => {
    fetchAllData();
  }, [])
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return programs.slice(startIndex, endIndex).map((program, index) => ({
      ...program, // Include the program data
      programIndex: startIndex + index, // Calculate the absolute index
    }));
  };
//If there is a search value, show the filtered data array. Otherwise, show the whole data array
  return (
    <>
    <div className="tableSenarai">
      <div style={{ backgroundImage: `url(${Intan})`}}>
      <div>
      <h1>SENARAI PROGRAM SEDIA ADA</h1>
      </div>
      <div className="Search">
        <input type="text" placeholder='Kod/Nama' className="textboxsearch"
        value={searchValue} onChange={e => setSearchValue(e.target.value)} ></input>
        <div className="searchicon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg>
        </div>
      
      </div>
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
    </>
  );
}

export default SenaraiProgramSediaAda;
