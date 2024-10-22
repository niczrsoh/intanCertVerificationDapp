import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import backicon from '../../img/arrow.png'
import { Buttons } from '../../Component'
import '../Add/add.css'
import { db } from '../../Backend/firebase/firebase-config'
import { collection, addDoc } from 'firebase/firestore'


const Add = () => {
  const navigate = useNavigate();
  const [isiProgram, setIsiProgram] = useState("");
  const [kod, setKod] = useState("");
  const [mula, setMula] = useState("");
  const [nama, setNama] = useState("");
  const [penganjur, setPenganjur] = useState("");
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
    let value = e.target.value;
    if (!/^[0-9/]*$/.test(value)) {
      alert("Peringatan! Hanya nombor dan simbol '/' sahaja yang dibenarkan untuk tarikh");
      return;
    }

    // Automatically add leading zeros for day and month if needed
    const parts = value.split("/");
  
    if (parts.length === 3) {
      let day = parts[0].padStart(2, "0");  // Ensure 2 digits for the day
      let month = parts[1].padStart(2, "0"); // Ensure 2 digits for the month
      let year = parts[2];  // Keep the year as is
  
      value = `${day}/${month}/${year}`;
  
      // Set the properly formatted date in the input field
      setMula(value);
  
      // Validate only if the full date is entered (i.e., length of 10 characters)
      if (value.length === 10) {
        const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  
        // Check if the full date matches the DD/MM/YYYY format
        if (!datePattern.test(value)) {
          alert("Peringatan! Sila letakkan format yang betul DD/MM/YYYY (e.g., 01/01/2024)");
        }
      }
    } else {
      setMula(value);  // Update state with the current value (even partially entered)
    }
  };
  const onChangeNama = (e) => {
    setNama(e.target.value);
  }
  const onChangePenganjur = (e) => {
    setPenganjur(e.target.value);
  }
  const onChangeMaksimumPeserta = (e) => {
    setMaksimumPeserta(e.target.value);
  }
  const onChangeYuran = (e) => {
    setYuran(e.target.value);
  }
  const onChangeTamat = (e) => {
    let value = e.target.value;
    if (!/^[0-9/]*$/.test(value)) {
      alert("Peringatan! Hanya nombor dan simbol '/' sahaja yang dibenarkan untuk tarikh");
      return;
    }
    // Automatically add leading zeros for day and month if needed
    const parts = value.split("/");
  
    if (parts.length === 3) {
      let day = parts[0].padStart(2, "0");  // Ensure 2 digits for the day
      let month = parts[1].padStart(2, "0"); // Ensure 2 digits for the month
      let year = parts[2];  // Keep the year as is
  
      value = `${day}/${month}/${year}`;
  
      // Set the properly formatted date in the input field
      setTamat(value);
  
      // Validate only if the full date is entered (i.e., length of 10 characters)
      if (value.length === 10) {
        const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  
        // Check if the full date matches the DD/MM/YYYY format
        if (!datePattern.test(value)) {
          alert("Peringatan! Sila letakkan format yang betul DD/MM/YYYY (e.g., 01/01/2024)");
        }
      }
    } else {
      setTamat(value);  // Update state with the current value (even partially entered)
    }
  };

  const programRegister = async (e) => {
    e.preventDefault();
    //ensure all the fields are filled
    if (isiProgram === "" || kod === "" || mula === "" || nama === "" || penganjur === "" || maksimumPeserta === "" || tamat === "" || yuran === "") {
      alert("Sila isi semua ruangan");
      return;
    }
    //collection() will define the path to the collection
    const userCollectionRef = collection(db, "Program")
    //addDoc() is used for add new document data but with auto generated id in the firestore
    //in this case it will add new program
    await addDoc(userCollectionRef, {
      isiProgram: isiProgram,
      kod: kod,
      mula: mula,
      nama: nama,
      penganjur: penganjur,
      maksimumPeserta: maksimumPeserta,
      jumlahPeserta: "0",
      pesertaStatus: {},
      pesertaList: [],
      transactionId: {},
      pesertaNama: {},
      tamat: tamat,
      yuran: yuran,
    }).then(() => {
      setIsiProgram("");
      setKod("");
      setMula("");
      setNama("");
      setPenganjur("");
      setMaksimumPeserta("");
      setTamat("");
      setYuran("");
      alert("Program berjaya didaftarkan!!");
      navigate(-1);
    });//create 2 end
  }

  return (
    <div className='app_box'>
      <div className='semakdaftarheader'>
        <button className='backbutton' onClick={() => navigate(-1)}><img src={backicon} alt='This is a back button.' className="backicon" /></button>
        <h1 className='semakdaftaradmin'>Tambah Program</h1>
        <div className='smallback'><NavLink to="/admin/home">LAMAN UTAMA</NavLink>/TAMBAH PROGRAM</div></div>
      <form className='maklumatbox' onSubmit={programRegister}>
        <div>
          <div className='maklumatadminbahru'>
            MAKLUMAT PROGRAM
          </div>
          <div className='maklumatsijil'>
            <div className='maklumat'>
              <label className="kik">KOD KURSUS</label>
              <div className='textarea'>
                <p className="kik">:</p>
                <input type="text" className='inputtext' onChange={onChangeKod} value={kod} /></div>
              {/* Input for Kod Kursus */}
            </div>
            <div className='maklumat'>
              <label className="kik">NAMA KURSUS</label>
              <div className='textarea'>
                <p className="kik">:</p>
                <input type="text" className='inputtext' onChange={onChangeNama} value={nama} /></div>
              {/* Input for Nama Kursus */}
            </div>
            <div className='maklumat'>
              <label className="kik">NAMA PENGANJUR</label>
              <div className='textarea'>
                <p className="kik">:</p>
                <input type="text" className='inputtext' onChange={onChangePenganjur} value={penganjur} /></div>
            </div>
            <div className='maklumat'>
              <label className="kik">TARIKH MULA</label>
              <div className='textarea'>
                <p className="kik">:</p>
                <input type="text" className='inputtext' onChange={onChangeMula} value={mula} placeholder="DD/MM/YYYY (e.g. 01/01/2023)"/></div>
              {/* Input for Tarikh Mula */}
            </div>
            <div className='maklumat'>
              <label className="kik">TARIKH TAMAT</label>
              <div className='textarea'>
                <p className="kik">:</p>
                <input type="text" className='inputtext' onChange={onChangeTamat} value={tamat} placeholder="DD/MM/YYYY (e.g. 01/01/2023)"/></div>
              {/* Input for Tarikh Tamat */}
            </div>
            <div className='maklumat'>
              <label className="kik">MAKSIMUM PESERTA</label>
              <div className='textarea'>
                <p className="kik">:</p>
                <input type="text" className='inputtext' onChange={onChangeMaksimumPeserta} value={maksimumPeserta} /></div>
              {/* Input for MAKSIMUM PESERTA */}
            </div>
            <div className='maklumat'>
              <label className="kik">YURAN</label>
              <div className='textarea'>
                <p className="kik">:</p>
                <input type="text" className='inputtext' onChange={onChangeYuran} value={yuran} /></div>
              {/* Input for Yuran */}
            </div>
            <div className='maklumat'>
              <label className="kik">KETERANGAN</label>
              <div className='textarea'>
                <p className="kik">:</p>
                <textarea className='inputarea' rows={9} onChange={onChangeIsiProgram} value={isiProgram} />
                {/* Input for KETERANGAN */}
              </div>
            </div>
          </div>
        </div>
        <div className='submitBtn'><Buttons title="TAMBAH" /></div>
      </form>

    </div>
  )
}

export default Add
