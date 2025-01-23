import React, { useState, useEffect } from "react";
import "./styles/Detail.css";
import Modal from "./Modal";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { db } from '../Backend/firebase/firebase-config'
import { collection, getDoc, deleteDoc, doc, updateDoc, } from 'firebase/firestore'
import { LocalActivity } from "@mui/icons-material";
import backicon from '../img/arrow.png';


function SenaraiProgramSediaAda() {
  //state for showing the pop out page
  const [showDaftar, setShowDaftar] = useState(false);
  const [isiProgram, setIsiProgram] = useState("");
  const [mula, setMula] = useState("");
  const [nama, setNama] = useState("");
  const [penganjur, setPenganjur] = useState("");
  const [penyelaras, setPenyelaras] = useState("");
  const [jumlahPeserta, setJumlahPeserta] = useState("");
  const [maksimumPeserta, setMaksimumPeserta] = useState("");
  const [tamat, setTamat] = useState("");
  const [yuran, setYuran] = useState("");
  const navigate = useNavigate();

  const handleShowDaftar = () => {
    setShowDaftar(true);
  };
  const handleCloseDaftar = () => {
    setShowDaftar(false);
    //navigate back code
    navigate(-1);

  };
  function formatDate(dateString) {
    // Split the original date string
    const [year, month, day] = dateString.split('-');
    
    // Reassemble in dd-mm-yyyy format
    return `${day}-${month}-${year}`;
  }
  let { programID } = useParams();

  //get the program info
  useEffect(() => {
    const getProgram = async () => {
      const docRef = doc(db, "Program", programID.toString());
      const data1 = await getDoc(docRef);
      setIsiProgram(data1.data().isiProgram);
      setMula(data1.data().mula);
      setNama(data1.data().nama);
      setPenganjur(data1.data().penganjur);
      setPenyelaras(data1.data().penyelaras);
      setJumlahPeserta(data1.data().jumlahPeserta);
      setMaksimumPeserta(data1.data().maksimumPeserta);
      setTamat(data1.data().tamat);
      setYuran(data1.data().yuran);
    }

    getProgram();

  }, []);

  const padNumber = (num) => {
    return num.toString().padStart(2, "0");
  };

  const programDaftar = async () => {
    const docRef = doc(db, "Program", programID);
    //get the program info and modify the info data
    const data = await getDoc(docRef);
    const tempMaksimumPesertaString = data.data().maksimumPeserta;
    var tempMaksimumPesertaNum = Number(tempMaksimumPesertaString);
    const tempJumlahPeserta = data.data().jumlahPeserta;
    var newJumlahPesertaNum = Number(tempJumlahPeserta) + 1;
    var newJumlahPesertaString = newJumlahPesertaNum.toString();
    const tempList = data.data().pesertaList;
    const tempNama = data.data().pesertaNama;
    const tempStatus = data.data().pesertaStatus;
    const tempTran = data.data().transactionId;
    var newList = tempList;
    var newNama = tempNama;
    var newStatus = tempStatus;
    var newTran = tempTran;
    const userID = sessionStorage.getItem("userID");
    const userNama = sessionStorage.getItem("userNama");
    var check = true;
    //get current admin created time
    const date = new Date();
    const currentDate = new Date(`${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`);
    const programEndDate = new Date(`${tamat}`);
    tempList.forEach((id) => {
      if (id == userID) {
        alert("Anda telah memohon program ini.")
        check = false;
        console.log("check", check);
      }
    })

    if (newJumlahPesertaString > tempMaksimumPesertaNum) {
      alert("Program telah mencapai jumlah peserta maksimum.")
      check = false;
    } else if (currentDate > programEndDate) {
      alert("Program telah tamat.")
      check = false;
    }

    if (check) {
      newList.push(userID);
      newNama[userID] = userNama;
      newStatus[userID] = "-";
      newTran[userID] = "-";
      //update the new document data
      await updateDoc(docRef, {
        pesertaList: newList,
        pesertaNama: newNama,
        pesertaStatus: newStatus,
        transactionId: newTran,
        jumlahPeserta: newJumlahPesertaString,
      }).then(() => {
        alert("Pemohonan program anda telah berjaya.");
        navigate(-1);
      })
    } else {
      console.log("check", check);
      handleCloseDaftar();
    }
  }


  return (
    <div class="Detail">
      <div class="Detailheader">
      <button className="backbutton" onClick={() => navigate("/user/senarai-program-sedia-ada")}>
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
        <h1 class="titleDetail">{nama}</h1>
      </div>
      <div class="blue">
        <p>Informasi Program</p>
      </div>
      <div class="infoDetail">
        <div class="info1">
          <p>Nama Penganjur</p>
          <p>Penyelaras</p>
          <p>Tempoh</p>
          <p>Maksimum peserta</p>
          <p>Jumlah peserta</p>
          <p>Yuran</p>
        </div>
        <div class="info2">
          <p>:</p>
          <p>:</p>
          <p>:</p>
          <p>:</p>
          <p>:</p>
          <p>:</p>
        </div>
        <div class="info3">
          <p>{penganjur}</p>
          <p>{penyelaras}</p>
          <p>{formatDate(mula)} hingga {formatDate(mula)}</p>
          <p>{maksimumPeserta}</p>
          <p>{jumlahPeserta}</p>
          <p>RM {yuran}</p>
        </div>
      </div>
      <div class="blue">
        <p>Sinopsis Program</p>
      </div>
      <div class="sinopsis">
        <p>
          {isiProgram}
        </p>
      </div>
      <div className="daftarcenter">
        <button onClick={handleShowDaftar} className="Daftarbutton">
          Mohon
        </button>
      </div>
      {showDaftar && (
        <div className="Detail-modal">
          <Modal isOpen={showDaftar} onClose={handleCloseDaftar}>
            <div className="confirmation-message ">
              <div className="headpopout">
              </div>
              <button className="close" onClick={handleCloseDaftar}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-x-lg"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                </svg>
              </button>

              <div className="contentpopout">
                <p>
                  Adakah anda ingin memohon program ini? 
                </p>
              </div>

              <div className="buttonrekod">
                <div className="comfirmya">
                  <button className="option" onClick={programDaftar}>Ya</button>
                </div>
                <div className="comfirmno">
                  <button className="option" onClick={handleCloseDaftar}>Tidak</button>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default SenaraiProgramSediaAda;
