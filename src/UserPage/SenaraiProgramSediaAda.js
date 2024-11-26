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
  const [tableKey, setTableKey] = useState(Date.now()); // State for forcing re-render of table

  //Filter the data array based on the nama or kod value entered by the user.
  const filteredData = programs.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.kod.toLowerCase().includes(searchValue.toLowerCase())
  );
  
  const userCollectionRef = collection(db, "Program")

  //fetch all the document data in the Program collections
  useEffect(() => {
    const getProgram = async () => {
      const data = await getDocs(userCollectionRef);
      console.log(data);
      setPrograms(
        data.docs
          .map((doc) => ({
            ...doc.data(),
            id: doc.id,
            formattedDate: new Date(doc.data().mula.split('/').reverse().join('-')), 
          }))
          .sort((a, b) => b.formattedDate - a.formattedDate)
      );
    }
    getProgram();
  }, [])
//If there is a search value, show the filtered data array. Otherwise, show the whole data array
  return (
    <>
    <div className="tableSenarai">
      <div style={{ backgroundImage: `url(${Intan})`}}>
      <div>
      <h1>SENARAI PROGRAM SEDIA ADA</h1>
      </div>
      <div className="Search">
        <input type="text" placeholder='Kod/Name' className="textboxsearch"
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
              itemList={programs}
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
    </div>
    </>
  );
}

export default SenaraiProgramSediaAda;
