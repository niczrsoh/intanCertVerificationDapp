import React, { useState, useEffect } from "react";
import "../CiptaSijil/ciptasijil.css";
import { Buttons } from "../../Component";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import backicon from "../../img/arrow.png";
import { db } from "../../Backend/firebase/firebase-config";
import {
  collection,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { deployContract as deployEthContract } from "../../Utils/ethUtils";

const CiptaSijil = ({ backpage }) => {
  const navigate = useNavigate();
  let { programId, key } = useParams();
  const [tajukSijil, setTajukSijil] = useState("");
  const [tarikhMula, setTarikhMula] = useState("");
  const [tarikhTamat, setTarikhTamat] = useState("");
  const [nama, setNama] = useState("");
  const [loading, setLoading] = useState(false);
  const [NRIC, setNRIC] = useState("");
  const actionCollectionRef = collection(db, "ActionLog");
  const programDocRef = doc(db, "Program", programId);
  const userDocRef = doc(db, "User", key);

  useEffect(() => {
    const getProgramAndUser = async () => {
      const programData = await getDoc(programDocRef);
      const userData = await getDoc(userDocRef);
      setTajukSijil(programData.data().nama);
      setTarikhMula(convertDateFormat(programData.data().mula));
      setTarikhTamat(convertDateFormat(programData.data().tamat));
      setNRIC(userData.data().ic);
      setNama(userData.data().nama);
    };

    getProgramAndUser();
  }, []);
  const convertDateFormat = (date) => {
    const dateParts = date.split('-'); // Split the input date into [dd, mm, yyyy]
    if (dateParts.length === 3) {
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Return the date in dd-mm-yyyy format
    }
    return date; // Return the original date if the format is incorrect
  };
  const createSijil = async (sender, transId, appid) => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${padNumber(
      date.getMonth() + 1
    )}-${padNumber(date.getDate())} ${padNumber(date.getHours())}:${padNumber(
      date.getMinutes()
    )}:${padNumber(date.getSeconds())}`;
    const sijilCollectionRef = doc(db, "Sijil", appid.toString().toLowerCase());
    console.log(formattedDate.toLocaleString());

    const adminName = sessionStorage.getItem("adminName");
    const adminID = sessionStorage.getItem("userID");
    await setDoc(sijilCollectionRef, {
      txnId: `${transId}`,
      action: "Create",
    });
    await addDoc(actionCollectionRef, {
      admin: `${sender}`,
      adminName: adminName,
      adminID: adminID,
      date: `${formattedDate.toString()}`,
      transactionId: `${transId}`,
      type: "Create",
    });
    const data = await getDoc(programDocRef);
    const txnIdList = data.data().transactionId;
    const pesertaStatusList = data.data().pesertaStatus;
    txnIdList[key] = transId;
    pesertaStatusList[key] = "dicipta";
    await updateDoc(programDocRef, {
      transactionId: txnIdList,
      pesertaStatus: pesertaStatusList,
    })
      .then((response) => {
        alert("sijil berjaya dicipta");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const padNumber = (num) => {
    return num.toString().padStart(2, "0");
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
            <div className="kembali-text" onClick={() => navigate(-1)}>
              Kembali
            </div>
          </div>
        </button>
        <h1 className="semakdaftaradmin" style={{ marginLeft: '16px' }}>CIPTA SIJIL</h1>
      </div>

      <div>
        <div className="maklumatadminbahru">MAKLUMAT SIJIL</div>
        <div className="maklumatsijil">
          <div className="maklumat">
            <label className="kik">TAJUK SIJIL</label>
            <div className="textarea">
              <p className="kik">:</p>
              <input
                type="text"
                className="inputtext"
                id="tajukSijil"
                value={tajukSijil}
                onChange={(e) => setTajukSijil(e.target.value)}
              />
            </div>
          </div>

          <div className="maklumat">
            <label className="kik">TARIKH MULA</label>
            <div className="textarea">
              <p className="kik">:</p>
              <input
                type="text"
                id="tarikhMula"
                className="inputtext"
                value={tarikhMula}
                onChange={(e) => setTarikhMula(e.target.value)}
              />
            </div>
          </div>
          <div className="maklumat">
            <label className="kik">TARIKH TAMAT</label>
            <div className="textarea">
              <p className="kik">:</p>
              <input
                type="text"
                id="tarikhTamat"
                className="inputtext"
                value={tarikhTamat}
                onChange={(e) => setTarikhTamat(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="maklumatadminbahru">MAKLUMAT PENGUNA</div>
          <div className="maklumatsijil">
            <div className="maklumat">
              <label className="kik">NAMA</label>
              <div className="textarea">
                <p className="kik">:</p>
                <input
                  type="text"
                  id="nama"
                  className="inputtext"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>
            </div>
            <div className="maklumat">
              <label className="kik">No. MYKAD</label>
              <div className="textarea">
                <p className="kik">:</p>
                <input
                  type="text"
                  id="NRIC"
                  className="inputtext"
                  value={NRIC}
                  onChange={(e) => setNRIC(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="submitBtn">
        {loading ? (
          <div>
            <center>
              <div className="loading-spinner"></div>
              <br></br>
              <div>Sila tunggu sebentar...</div>
              <br></br>
              <div> Data anda akan disimpan ke dalam blockchain dan pangkalan data ...</div>
            </center>
          </div>
        ) : (
          <Buttons
            title="Deploy Contract"
            onClick={async () => {
              setLoading(true);

              deployEthContract({
                tajukSijil,
                tarikhMula,
                tarikhTamat,
                nama,
                NRIC,
              })
                .then((response) => {
                  const { contractAddress, transactionId, accountAddr } =
                    response;
                  createSijil(accountAddr, transactionId, contractAddress);
                  navigate(`/informasi-sijil/${transactionId}`);
                })
                .catch((error) => {
                  console.log(error.message);
                });
            }}
          ></Buttons>
        )}
      </div>
    </div>
  );
};

export default CiptaSijil;
