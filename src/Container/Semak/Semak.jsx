import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import backicon from "../../img/arrow.png";
import "../Semak/semak.css";
import closeicon from "../../img/close.png";
import { Buttons } from "../../Component";
import AppContext from "../../Context/AppContext";
import { deleteProductAction } from "../../Utils/utils";
import { db } from "../../Backend/firebase/firebase-config";
import {
  collection,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { indexerClient } from "../../Constant/ALGOkey";
import {
  checkTransactionAndFetchData,
  readCertificate,
  invalidateCertificate,
} from "../../Utils/ethUtils";
import ItemTableWidget from './AdminProgramDetailTableWidget';

const Semak = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [alertDelete, setDeleteAlert] = useState(false);
  const navigate = useNavigate();
  const { account, setAccount } = useContext(AppContext);
  const [reload, setReload] = useState(0);
  const txnId = "OMC2FKODOV3N76MVJGTQWXCLUKNYDIMOTR245VKDFJR3ASYIW5FQ";
  const userCollectionRef = collection(db, "ActionLog");
  const [appId, setAppId] = useState("");
  const [mula, setMula] = useState("");
  const [nama, setNama] = useState("");
  const [loading, setLoading] = useState(false);
  const [penganjur, setPenganjur] = useState("");
  const [penyelaras, setPenyelaras] = useState("");
  const [maksimumPeserta, setMaksimumPeserta] = useState("");
  const [jumlahPeserta, setJumlahPeserta] = useState("");
  const [tamat, setTamat] = useState("");
  const [pesertaList, setPesertaList] = useState([]);
  const [pesertaNama, setPesertaNama] = useState([]);
  const [pesertaStatus, setPesertaStatus] = useState([]);
  const [yuran, setYuran] = useState("");
  const [tableKey, setTableKey] = useState(Date.now()); // State for forcing re-render of table
  const [programDetail, setProgramDetail] = useState([]);
  const ITEMS_PER_PAGE = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  //Delete the cert at firestore
  const deleteCert = async (deleteId, appId) => {
    //delete the sijil at sijil section in firebase
    const sijilDoc = doc(db, "Sijil", appId.toString().toLowerCase());
    await deleteDoc(sijilDoc);
    //set the txnid at program section to delete transaction id
    //set the peserta of the person to dipadam
    const programDocRef = doc(db, "Program", programID);
    //get the program info and modify the info
    const data = await getDoc(programDocRef);
    const pesertaStatusList = data.data().pesertaStatus;
    const txnIdList = data.data().transactionId;
    pesertaStatusList[currentUser] = "Dipadam";
    txnIdList[currentUser] = deleteId;

    const adminName = sessionStorage.getItem("adminName");
    const adminID = sessionStorage.getItem("userID");

    //update the new program info
    await updateDoc(programDocRef, {
      transactionId: txnIdList,
      pesertaStatus: pesertaStatusList,
    })
      .then(() => {
        alert("Sijil telah dipadam.");
      })
      .catch((error) => {
        console.error(error.message);
      });
    //add this action to the action log
    const actionRef = collection(db, "ActionLog");
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${padNumber(
      date.getMonth() + 1
    )}-${padNumber(date.getDate())} ${padNumber(date.getHours())}:${padNumber(
      date.getMinutes()
    )}:${padNumber(date.getSeconds())}`;
    await addDoc(actionRef, {
      admin: `${account[0]}`,
      adminName: adminName,
      adminID: adminID,
      date: `${formattedDate.toString()}`,
      transactionId: deleteId,
      type: "Delete",
    });
    setIsOpen(false);
    setReload(reload + 1);
  };
  function formatDate(dateString) {
    // Split the original date string
    const [year, month, day] = dateString.split('-');

    // Reassemble in dd-mm-yyyy format
    return `${day}-${month}-${year}`;
  }
  const padNumber = (num) => {
    return num.toString().padStart(2, "0");
  };

  const getUserTxn = async (user) => {
    //obtain the app id for the particular user cert in the program
    const programDocRef = doc(db, "Program", programID);
    const data = await getDoc(programDocRef); //read 2
    const userTxnId = data.data().transactionId[user];
    // console.log(userTxnId);
    return userTxnId;
  };
  const semakUser = async (user) => {
    const userTxnId = await getUserTxn(user);
    navigate(`/informasi-sijil/${userTxnId}`);
  };

  let { programID } = useParams();
  const fetchPesertaData = async (pesertaList, programData, pesertaNama) => {
    const rows = pesertaList.map((mykad, index) => {
      return {
        id: index + 1,  // Or use a unique identifier for the row
        mykad: mykad,  // The 'mykad' value from the pesertaList
        pesertaNama: pesertaNama[mykad],  // The mapping of 'mykad' to 'pesertaNama'
        pesertaStatus: programData.pesertaStatus ? programData.pesertaStatus[mykad] : 'No Status',  // Example of a status field
      };
    });
    setProgramDetail(rows);
    console.log(rows);
    setTotalPages(Math.ceil(rows.length / ITEMS_PER_PAGE));
  };
  //get all the information of the program when entering into this page
  useEffect(() => {
    const getPeserta = async () => {
      //define the program info document path and get the document data
      const docRef = doc(db, "Program", programID.toString());
      const detail = await getDoc(docRef);
      // Check if the document exists
      if (detail.exists()) {
        // Extract data from the document snapshot
        const programData = detail.data();

        // Assume the programData contains a 'pesertaList' (array) and 'pesertaNama' (object) fields
        const pesertaList = programData.pesertaList || [];
        const pesertaNama = programData.pesertaNama || {};
        await fetchPesertaData(pesertaList, programData, pesertaNama);
      }
      setMula(detail.data().mula);
      setNama(detail.data().nama);
      setPenganjur(detail.data().penganjur);
      setPenyelaras(detail.data().penyelaras);
      setMaksimumPeserta(detail.data().maksimumPeserta);
      setJumlahPeserta(detail.data().jumlahPeserta);
      setTamat(detail.data().tamat);
      setPesertaStatus(detail.data().pesertaStatus);
      setPesertaNama(detail.data().pesertaNama);
      setYuran(detail.data().yuran);
    };
    if (isOpen) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      getPeserta();
    }
  }, [reload, isOpen]);
  const getCurrentPageItems = () => {
    if (programDetail.length === 0) {
      return [];
    }
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return programDetail.slice(startIndex, endIndex).map((peserta, index) => ({
      ...peserta, // Include the program data
      programIndex: startIndex + index, // Calculate the absolute index
    }));
  };
  return (
    <div className="app_box">
      <div className="semakdaftarheader">
        <button className="backbutton" onClick={() => navigate(-1)}>
          <div className="back-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
            <img
              src={backicon}
              alt="This is a back button."
              className="backicon"
              style={{ width: '24px', height: '24px', objectFit: 'contain' }} // Make sure the image has a fixed size
            />
            {/* Adding the "Kembali" (Back) text below the back icon */}
            <div className="kembali-text">
              Kembali
            </div>
          </div>
        </button>
        <h1 className="semakdaftaradmin" style={{ marginLeft: '16px' }}>{nama}</h1>
      </div>
      {/* Program Information */}
      <div className="informasibox">
        <div className="informasiprogramtitle">INFORMASI PROGRAM</div>
        <div className="programtitle">
          <div className="informasiprogram">
            <label>Nama Penganjur</label>
            <p>:</p>
            <p className="informasicontent">{penganjur}</p>
          </div>
          <div className="informasiprogram">
            <label>Nama Penyelaras</label>
            <p>:</p>
            <p className="informasicontent">{penyelaras}</p>
          </div>
          <div className="informasiprogram">
            <label>Tempoh</label>
            <p>:</p>
            <p className="informasicontent">
              {formatDate(mula)} hingga {formatDate(tamat)}
            </p>
          </div>
          <div className="informasiprogram">
            <label>Yuran</label>
            <p>:</p>
            <p className="informasicontent">RM {yuran}</p>
          </div>
          <div className="informasiprogram">
            <label>Maksimum Peserta</label>
            <p>:</p>
            <p className="informasicontent">{maksimumPeserta} orang</p>
          </div>
          <div className="informasiprogram">
            <label>Jumlah Peserta</label>
            <p>:</p>
            <p className="informasicontent">{jumlahPeserta} orang</p>
          </div>
        </div>
      </div>
      <div className="subtitle">SENARAI PESERTA</div>
      <div className="program">
        {/* {(programDetail.length === 0) ? 
          "Tiada peserta yang mendaftar pada program ini."
        : */}
        <ItemTableWidget
          key={tableKey}
          itemList={getCurrentPageItems()}
          programID={programID}
          semakUser={semakUser}
          setCurrentUser={setCurrentUser}
          setIsOpen={setIsOpen}
        />

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
      {/* padam sijil peserta */}
      {isOpen && (
        <div className="semaksijil">
          <div className="contentdeletesijil">
            <div className="semaksijilboxadmin">
              <div className="sejarahheaderadmin">
                <h2 className="sejarahtitleadmin">Padam</h2>
                <button
                  className="closebutton"
                  onClick={() => {
                    setIsOpen(false);
                    setDeleteAlert(false);
                    setLoading(false);
                  }}
                >
                  <img
                    src={closeicon}
                    alt="This is a close icon."
                    className="closeicon"
                  />
                </button>
              </div>

              {!alertDelete ? (
                <div>
                  <div className="contentdelete">
                    <div className="contentpopout">
                      <p>
                        Adakah anda pasti untuk memadam sijil?
                      </p>
                    </div>
                  </div>
                  <div className="padamconfirmbuttonadmin">
                    {loading ? (
                      <div>
                        <center>
                          <div className="loading-spinner"></div>
                          <br></br>
                          <div>Sila tunggu sebentar...</div>
                          <br></br>
                          <div className="contentdeleteadmin">
                            {" "}
                            Sedang memadamkan sijil ini dalam blockchain dan pangkalan data
                            ...
                          </div>
                        </center>
                      </div>
                    ) : (
                        <div className="buttonrekod">
                          <div className="comfirmya">
                            <button className="option" onClick={async () => {
                              setLoading(true);
                              // console.log('account', account);
                              // console.log('crntUser', currentUser);
                              console.log("account: ", account);
                              const userTxnId = await getUserTxn(currentUser);
                              let deleteId;
                              let appId;
                              const info = await checkTransactionAndFetchData(
                                userTxnId
                              );
                              if (info.isEther) {

                                const { contractAddress } = info;
                                appId = contractAddress;
                                deleteId = await invalidateCertificate(contractAddress);
                              } else {
                                //obtain the app id for the particular user cert in the program

                                // console.log("TxnID" , userTxnId);
                                const info = await indexerClient
                                  .lookupTransactionByID(userTxnId)
                                  .do();
                                appId = await info.transaction[
                                  "application-transaction"
                                ]["application-id"];
                                // console.log('appID', appId);

                                //delete the cert at algorand blockchain
                                deleteId = await deleteProductAction(
                                  appId,
                                  account
                                );
                                // console.log(deleteId);
                              }

                              //delete the cert in firebase
                              deleteCert(deleteId, appId);
                            }}>Ya</button>
                          </div>
                          <div className="comfirmno">
                            <button className="option" onClick={() => {
                              setIsOpen(false);
                              setDeleteAlert(false);
                              setLoading(false);
                            }}>
                              Tidak
                            </button>
                          </div>
                        </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="contentdeleteadmin">
                  <div>
                    <p>
                      Sijil ini berjaya dipadamkan dalam rangkaian blockchain.!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Semak;
