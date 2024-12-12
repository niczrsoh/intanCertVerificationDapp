import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import backicon from '../../img/arrow.png'
import { Buttons } from '../../Component'
import '../EditProgram/editprogram.css'
import { db } from '../../Backend/firebase/firebase-config'
import { getDoc, updateDoc, doc } from 'firebase/firestore'
import Calendar from "react-date-picker"; 
import {DatePicker} from "react-date-picker"; 

const EditProgram = () => {
  const navigate = useNavigate();
  const [isiProgram, setIsiProgram] = useState("");
  const [kod, setKod] = useState("");
  const [mula, setMula] = useState("");
  const [nama, setNama] = useState("");
  const [penganjur, setPenganjur] = useState("");
  const [penyelaras, setPenyelaras] = useState("");
  const [maksimumPeserta, setMaksimumPeserta] = useState("");
  const [yuran, setYuran] = useState("");
  const [tamat, setTamat] = useState("");

  const onChangeIsiProgram = (e) => {
    setIsiProgram(e.target.value);
  }
  const onChangeKod = (e) => {
    setKod(e.target.value);
  }
  const onChangeMula = (e) => {
    setMula(e);
  }
  const onChangeNama = (e) => {
    setNama(e.target.value);
  }
  const onChangePenganjur = (e) => {
    setPenganjur(e.target.value);
  }
  const onChangePenyelaras = (e) => {
    setPenyelaras(e.target.value);
  }
  const onChangeMaksimumPeserta = (e) => {
    setMaksimumPeserta(e.target.value);
  }
  const onChangeYuran = (e) => {
    setYuran(e.target.value);
  }
  const onChangeTamat = (e) => {
    setTamat(e);
  }
  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  let { programID } = useParams();
  const parseDate = (dateString) => {
    if (!dateString) return null; // Handle empty or invalid input
    const [year, month, day] = dateString.split("-").map(Number); // Split and convert to numbers
    return new Date(year, month - 1, day); // Create and return the Date object
  };
  //useEffect() will be executed once when the web is initialize  
  useEffect(() => {
    const getProgram = async () => {
      //doc() will define the path to the document data 
      const docRef = doc(db, "Program", programID.toString());
      //getDoc() will get the document data based on the path 
      const data1 = await getDoc(docRef);
      console.log(data1.data());
      setIsiProgram(data1.data().isiProgram);
      setKod(data1.data().kod);
      setMula(parseDate(data1.data().mula));
      setNama(data1.data().nama);
      setPenganjur(data1.data().penganjur);
      setPenyelaras(data1.data().penyelaras);
      setMaksimumPeserta(data1.data().maksimumPeserta);
      setYuran(data1.data().yuran);
      setTamat(parseDate(data1.data().tamat));
    }

    getProgram();

  }, []);

  const editProgram = async (e) => {
    e.preventDefault();
    const userCollectionRef = doc(db, "Program", programID)
    //updateDoc() will update the document data that stored at the specified path
    await updateDoc(userCollectionRef, {
      isiProgram: isiProgram,
      kod: kod,
      mula: formatDate(mula),
      nama: nama,
      penganjur: penganjur,
      penyelaras: penyelaras,
      maksimumPeserta: maksimumPeserta,
      yuran: yuran,
      tamat: formatDate(tamat),
    }).then(() => {
      setIsiProgram("");
      setKod("");
      setMula("");
      setNama("");
      setPenganjur("");
      setPenyelaras("");
      setMaksimumPeserta("");
      setTamat("");
      setYuran("");
      alert("Program telah dikemaskini!!");
      navigate(-1);
    });
  }
  return (
    <div className='app_box'>
      <div className='semakdaftarheader'>
        {/* back to previous page */}
        <button className='backbutton' onClick={() => navigate(-1)}><img src={backicon} alt='This is a back button.' className="backicon" /></button>
        <h1 className='semakdaftaradmin'>KEMASKINI PROGRAM</h1>
      </div>
      {/*Information input section for Edit Program */}
      <form className='maklumatbox' onSubmit={editProgram}>
        <div>
          <div className='maklumatadminbahru'>
            MAKLUMAT PROGRAM
          </div>
          <div className='maklumatsijil'>
            <div className='maklumat'>
              <label className="kik">KOD PROGRAM</label>
              <div className='textarea'>
                <p className="kik">:</p>
                <input type="text" className='inputtext' onChange={onChangeKod} value={kod} /></div>
            </div>
            <div className='maklumat'>
              <label className="kik">NAMA PROGRAM</label>
              <div className='textarea'>
                <p className="kik">:</p>
                <input type="text" className='inputtext' onChange={onChangeNama} value={nama} /></div>
            </div>
            <div className='maklumat'>
              <label className="kik">NAMA PENGANJUR</label>
              <div className='textarea'>
                <p className="kik">:</p>
                <input type="text" className='inputtext' onChange={onChangePenganjur} value={penganjur} /></div>
            </div>
            <div className='maklumat'>
              <label className="kik">NAMA PENYELARAS</label>
              <div className='textarea'>
                <p className="kik">:</p>
                <input type="text" className='inputtext' onChange={onChangePenyelaras} value={penyelaras} disabled/></div>
            </div>
            <div className='maklumat'>
              <label className="kik">TARIKH MULA</label>
              <div className='textarea'>
                <p className="kik">:</p>
                <DatePicker
         className='date-field'
          onChange={onChangeMula}
          value={mula}// Optionally close on blur
          minDate={new Date()}
          format="y-MM-dd"  
        /></div>
            </div>
            <div className='maklumat'>
              <label className="kik">TARIKH TAMAT</label>
              <div className='textarea'>
                <p className="kik">:</p>
                <Calendar
         className='date-field'
          onChange={onChangeTamat}
          value={tamat}// Optionally close on blur
          minDate={mula}
          format="y-MM-dd" 
        /></div>
            </div>
            <div className='maklumat'>
              <label className="kik">MAKSIMUM PESERTA</label>
              <div className='textarea'>
                <p className="kik">:</p>
                <input type="text" className='inputtext' onChange={onChangeMaksimumPeserta} value={maksimumPeserta} /></div>
            </div>
            <div className='maklumat'>
              <label className="kik">YURAN</label>
              <div className='textarea'>
                <p className="kik">:</p>
                <span className="currency-symbol">RM</span>
                <input type="text" className='inputtext' onChange={onChangeYuran} value={yuran} /></div>
            </div>
            <div className='maklumat'>
              <label className="kik">KETERANGAN</label>
              <div className='textarea'>
                <p className="kik">:</p>
                <textarea className='inputarea' rows={9} onChange={onChangeIsiProgram} value={isiProgram} />
              </div>
            </div>
          </div>
        </div>
       
      </form>
      <div className='submitBtn' ><Buttons title="Hantar" onClick={editProgram}/></div>
    </div>
  )
}

export default EditProgram
