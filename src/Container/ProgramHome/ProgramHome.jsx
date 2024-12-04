import React, { useState,useContext,useEffect } from 'react'
import { NavLink, redirect,useNavigate } from 'react-router-dom'
import { Buttons } from '../../Component'
import './ProgramHome.css'
import filterpic from '../../img/filter.png'
import searchpic from '../../img/search.png'
import addicon from '../../img/add.png'
import closeicon from '../../img/close.png'
import AppContext,{ AppContextProvider } from '../../Context/AppContext'
import { db } from '../../Backend/firebase/firebase-config'
import { collection, getDocs, deleteDoc, doc,} from 'firebase/firestore'
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ItemTableWidget from './AdminProgramTableWidget';

const ProgramHome = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredValue, setFilteredValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen,setIsOpen]= useState(false);
  const { account, setAccount } = useContext(AppContext);
  const [totalPages, setTotalPages] = useState(0);
  const ITEMS_PER_PAGE = 10;
  const [programs,setPrograms] = useState([]);
  const [programID,setProgramID] = useState("");
  const [tableKey, setTableKey] = useState(Date.now()); // State for forcing re-render of table
  const [reload,setReload] = useState(0);
      // Fetch total item count to calculate total pages
      const fetchAllData = async () => {
        const ref = collection(db, "Program");
        const snapshot = await getDocs(ref);
    
        // Transform data and sort by formattedDate
        const fetchedItems = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          formattedDate: new Date(doc.data().mula.split("/").reverse().join("-")), // Format mula to Date
        }));
        const sortedItems = fetchedItems.sort((a, b) => b.formattedDate - a.formattedDate); // Sort in descending order
    
        setPrograms(sortedItems);
        setTotalPages(Math.ceil(sortedItems.length / ITEMS_PER_PAGE));
      };
   //Filter the data array based on the nama or kod value entered by the user.
   const filteredData = programs.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.kod.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.penyelaras.toLowerCase() === searchValue.toLowerCase()
  );
  useEffect(() => {
    if (isOpen) {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scrolling to top
    }else{
      fetchAllData();
  }
  }, [isOpen])


  const kodfilter = () => {
      const sorted = programs.sort((a, b) => a.kod.localeCompare(b.kod));
      setSearchValue(sorted)}

  const tmfilter = () => {
      const sorted = programs.sort((a, b) => {
      const dateA = new Date(a.mula.split('/').reverse().join('-')); // Convert 'DD/MM/YYYY' to 'YYYY-MM-DD'
      const dateB = new Date(b.mula.split('/').reverse().join('-'));
      return dateB - dateA; // Compare the two dates
        });
      setSearchValue(sorted);
      };
      
  const ttfilter = () => {
      const sorted = programs.sort((a, b) => {
      const dateA = new Date(a.tamat.split('/').reverse().join('-')); // Convert 'DD/MM/YYYY' to 'YYYY-MM-DD'
      const dateB = new Date(b.tamat.split('/').reverse().join('-'));
      return dateB - dateA; // Compare the two dates
        });
      setSearchValue(sorted);
     };

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
      if (selectedOption.value === "KodKursus"){kodfilter();}
      else if (selectedOption.value === "TarikhMula"){tmfilter();}
      else if (selectedOption.value === "TarikhTamat"){ttfilter();}
      else if (selectedOption.value === "Susunan"){setSearchValue(programs)}


    };

    // const handleSubmit = async () => {
    //   if (isSearching) {
    //     return;
    //   }
    //   setIsSearching(true);
    //   try{
    //     const lowerCaseFilteredValue = filteredValue.toLowerCase();

    //     const filtered = programs.filter(item =>
    //       Object.values(item).some(val =>
    //         val.toString().toLowerCase().includes(lowerCaseFilteredValue)
    //       )
    //     );
    //     setSearchValue(filtered);
    //   await new Promise((resolve) => setTimeout(resolve, 2000));}
    //   catch (error) {
    //     console.error('Search failed:', error);
    //   } finally {
    //     // Set the isSearching flag back to false to indicate search is completed
    //     setIsSearching(false);
    //   }
    // }

    const popOut = (e,id) =>{
      setProgramID(id);
      setIsOpen(true);
    }
    //delete the document data
    const deleteProg = async () => {
      const docRef = doc(db,"Program",programID)
      await deleteDoc(docRef).then(()=>{
        setIsOpen(false);
        alert("Program Dipadam");
        setReload(reload+1);
      });
    };
    const getCurrentPageItems = () => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      return programs.slice(startIndex, endIndex).map((program, index) => ({
        ...program, // Include the program data
        programIndex: startIndex + index, // Calculate the absolute index
      }));
    };
  return (
    
    <div className='app_box'>
      <NavLink to='/admin/add-course'><button className='addbutton'><img src={addicon} alt="This is an add icon." className='addicon'/></button></NavLink>
      <div className='programsec'>
        <h1 className='title'>
            SENARAI PROGRAM
        </h1>
        <div className='features'>
            <form className='search'>
                <div className='searchbox'>
                    <input value={searchValue} type="text" placeholder="Kod / Kursus / Penyelaras" className='searchtype' onChange={e => setSearchValue(e.target.value)}/>
                </div>
                {/* <div className='filtericon'>
                    <button className="searchbutton" onClick={handleSubmit} disabled={isSearching}>
                        <img src={searchpic} alt='This is a search button.' type="submit" className="searchpic"/>
                    </button>
                </div> */}
            </form>
        </div>
    </div>
    <div className='program'>
        {searchValue === "" ? (
          <>
            <ItemTableWidget
              key={tableKey}
              itemList={getCurrentPageItems()}
              popOut={popOut}
            />
          </>
        ) : (
          <>
            <ItemTableWidget
              key={tableKey}
              itemList={filteredData}
              popOut={popOut}
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
    {/* Padam program */}
    {isOpen && (
        <div className='semaksijil'>
           <div className='contentdeletesijil'>
            <div className='semaksijilbox'>
              <div className='sejarahheader'>
              <h2 className='sejarahtitle'>Padam</h2>
              <button className='closebutton' onClick={() => setIsOpen(false)}><img src={closeicon} alt="This is a close icon." className='closeicon'/></button>
              </div>
              <div className='contentdelete'>
              <div><p>
              Adakah anda pasti untuk memadam program?
                </p></div>
                <div className='padamconfirmbutton'><Buttons title="Padam" onClick={() => deleteProg()}/></div>
              </div>
            </div>
            </div>
        </div>
        )}
    </div>
  )
}

export default ProgramHome
