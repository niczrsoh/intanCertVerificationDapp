import React, { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../Backend/firebase/firebase-config'
import '../EditAdmin/editAdmin.css'
import { Buttons } from '../../Component'
import backicon from '../../img/arrow.png'
import { useNavigate, useParams } from "react-router-dom"
const EditAdmin = () => {
  let { adminID } = useParams();
  const navigate = useNavigate();
  const [mykad, setMykad] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [account, setAccount] = useState("");
  const [role, setRole] = useState("Admin");

  useEffect(() => {
    const getAdminInfo = async () => {
      const adminRef = doc(db, "Admin", adminID);
      const data = await getDoc(adminRef);
      setMykad(adminID);
      setName(data.data().name);
      setEmail(data.data().email);
      setAccount(data.data().acc);
      setRole(data.data().role);
    };
    getAdminInfo();
  }, []);

  const onChangeMykad = (e) => {
    const regex = /[0-9]*/;
    if (regex.test(e.target.value)) {
      setMykad(e.target.value);
    }
  }

  const onChangeName = (e) => {
    setName(e.target.value);
  }

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  }

  const onChangeAcc = (e) => {
    setAccount(e.target.value);
  }

  const onChangeRole = (e) => {
    setRole(e.target.value);
  }

  const padNumber = (num) => {
    return num.toString().padStart(2, "0");
  };

  const adminUpdate = async (e) => {
    e.preventDefault();
    const regex = /[0-9][0-9][0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9][0-9][0-9]/;
    if (!regex.test(mykad)) {
      alert('Sila masukkan IC dengan format "123456-12-1234".');
      return;
    }
    //doc() will define the path to the document data 
    const userCollectionRef = doc(db, "Admin", mykad)

    //get current admin created time
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${padNumber(
      date.getMonth() + 1
    )}-${padNumber(date.getDate())} ${padNumber(date.getHours())}:${padNumber(
      date.getMinutes()
    )}:${padNumber(date.getSeconds())}`;

    //getDoc() will get the document data based on the path of doc()
    //in this case, getDoc() will get the info of admin to test whether the admin ic has been registered or not

    //console.log(data.data())
    //setDoc() will add the document data with the specific document id
    await setDoc(userCollectionRef, {
      name: name,
      email: email,
      acc: account,
      role: role,
      createdDate: `${formattedDate.toString()}`,
    }).then(async () => {
      setMykad("");
      setName("");
      setEmail("");
      setAccount("");
      setRole("");
      await alert("Informasi Admin telah dikemaskini.");
      navigate(`/admin/admin-list`);
    });
  }

  return (
    <div className='app_box'>
      <div className='semakdaftarheader'>
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
        <h1 className='admintitle'>KEMASKINI ADMIN</h1>
      </div>
      <div>
        <div className='maklumatadminbahru'>
          MAKLUMAT ADMIN BARU
        </div>
        <form className='maklumatadmin' onSubmit={adminUpdate}>
          <div className='maklumat'>
            <label className="kik" onChange={(event) => {
              setMykad(event.target.value)
            }}>NO.MYKAD</label>
            <div className='textarea'>
              <p className="kik">:</p>
              <input type="text" className='inputtext' onChange={onChangeMykad} value={mykad} placeholder="000000-00-0000" minLength='14' maxLength='14' required disabled /></div>
            {/* Input for NO.MYKAD */}
          </div>
          <div className='maklumat'>
            <label className="kik">NAMA ADMIN</label>
            <div className='textarea'>
              <p className="kik">:</p>
              <input type="text" className='inputtext' onChange={onChangeName} value={name} placeholder="Ali Mohamad" required /></div>
            {/* Input for ADMIN NAME */}
          </div>
          <div className='maklumat'>
            <label className="kik">EMEL ADMIN</label>
            <div className='textarea'>
              <p className="kik">:</p>
              <input type="email" className='inputtext' onChange={onChangeEmail} value={email} placeholder="ali@gmail.com" required /></div>
            {/* Input for ADMIN EMAIL */}
          </div>
          <div className='maklumat'>
            <label className="kik">ALAMAT E-WALLET</label>
            <div className='textarea'>
              <p className="kik">:</p>
              <input type="text" className='inputtext' onChange={onChangeAcc} value={account} required /></div>
            {/* Input for ALAMAT E-Wallet */}
          </div>
          <div className='maklumat'>
            <label className="kik">PERANAN ADMIN</label>
            <div className='textarea'>
              <p className="kik">:</p>
              <select className='inputselect' onChange={onChangeRole} value={role}>
                <option value="Admin">Admin</option>
                <option value="SuperAdmin">SuperAdmin</option>
              </select>
            </div>
            {/* Input for ADMIN ROLE */}
          </div>
        </form>
        <div className='submitBtn' ><Buttons title="Kemaskini Admin" onClick={adminUpdate} /></div>
      </div >


    </div >
  )
}

export default EditAdmin
