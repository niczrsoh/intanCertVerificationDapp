import { React, useEffect, useState } from 'react';
import './SemakSijil.css';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../Backend/firebase/firebase-config';
import { getDoc, doc } from 'firebase/firestore';
import method1 from '../../img/method1.png';
import method2 from '../../img/method2.png';
import { Buttons } from '../../Component';
export default function SemakSijil() {
  const navigate = useNavigate();
  const params = useParams();
  const [appId, setappId] = useState(params.appId || '');
  const [txnId, setTxnInfo] = useState(params.transId ||'');
  
  useEffect(() => {
    // console.log(sessionStorage.getItem("navigatingBack"));
    if (txnId && sessionStorage.getItem("navigatingBack") !== "true") {
      navigate(`/informasi-sijil/${txnId}`);
    }
    // Reset the sessionStorage flag when the component is unmounted
    return () => {
      sessionStorage.removeItem("navigatingBack");
    };
  }, []);
  
  //navigate to informasi sijil page after submit
  const handleSubmit = (transId) => {
    // console.log(transId);
    // console.log(appId);
    navigate(`/informasi-sijil/${transId}`);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page
    try {
      //get the latest transaction id from the firestore database using app id
      console.log(appId);
      const sijilRef = doc(db, "Sijil", appId.trim());
      const docSnap = await getDoc(sijilRef);
      const transId = docSnap.data().txnId;
      const status = docSnap.data().action;
      setTxnInfo(transId);
      // console.log(status);
      if(status !== 'Delete')
        handleSubmit(transId);
      else
      navigate(`/errorPage/${appId}`,{state:{message:"merupakan sijil yang tidak sah. Sila semak semula."}});

    } catch (error) {
      console.error("Error retrieving data:", error);
      // Handle the error appropriately, e.g., display an error message
      navigate(`/errorPage/${appId}`,{state:{message:"tidak wujud."}});
    }
  };
  return (
    <>
      <div className="semakSijilContainer">
        <h1 className="searchBar-title">Semak Sijil</h1>

        {/* Search Bar */}
        <form className="searchBar" method="get" onSubmit={handleFormSubmit}>
          <input
            id="search-id"
            name="search-id"
            type="text"
            placeholder="Sijil App ID"
            value={appId.toLowerCase()}
            onChange={(e) => {
            setappId(e.target.value.toLowerCase().trim());
            }}
          />
        </form>
        <div className='submitBtn'><Buttons title="🔍 Semak" onClick={handleFormSubmit}/></div>
        <p>Untuk menyemak sijil, terdapat dua kaedah</p>
        <div className="table-container">
          <div className="row">
            {/* First Row, First Column */}
            <div className="cell">
              <div className="circle">
                <span className="circle-number">1</span>
              </div>
              <div className="instruction">
                <p>Salin ID sijil dan tampal dalam bar carian untuk carian</p>
              </div>
            </div>

            {/* First Row, Second Column */}
            <div className="cell">
              <div className="circle">
                <span className="circle-number">2</span>
              </div>
              <div className="instruction">
                <p>Imbas kod QR untuk menyemak sijil</p>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="row">
            <div className="image-cell">
              <img src={method1} alt="Method 1" />
            </div>
            <div className="image-cell">
              <img src={method2}  alt="Method 2" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
