import React, { useState, useRef} from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import backicon from '../../img/arrow.png'
import { Buttons } from '../../Component'
import '../Add/add.css'
import { db } from '../../Backend/firebase/firebase-config'
import { collection, addDoc } from 'firebase/firestore'
import Calendar from "react-date-picker"; // Make sure you've installed react-date-picker
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";


const Add = () => {
  const navigate = useNavigate();
  const [isiProgram, setIsiProgram] = useState("");
  const [kod, setKod] = useState("");
  const [mula, setMula] = useState("");
  const [nama, setNama] = useState("");
  const [penganjur, setPenganjur] = useState("");
  const adminName = sessionStorage.getItem("adminName");
  const [penyelaras, setPenyelaras] = useState(adminName);
  const [maksimumPeserta, setMaksimumPeserta] = useState("");
  const [yuran, setYuran] = useState('0.00');
  const [tamat, setTamat] = useState("");
  const [timeValidating, setTimeValidating] = useState(false);
  const calendarRef = useRef(null);
  const onChangeIsiProgram = (e) => {
    setIsiProgram(e.target.value);
  }
  const onChangeKod = (e) => {
    setKod(e.target.value);
  }
  const onChangeMula = (e) => {
    setMula(e);
  };
  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };
  const onBlurTamat = (e) => {
    let value = e.target.value;
    const parts = value.split("/");

    if (parts.length === 3) {
      let day = parts[0].padStart(2, "0");  // Ensure 2 digits for the day
      let month = parts[1].padStart(2, "0"); // Ensure 2 digits for the month
      let year = parts[2];  // Keep the year as is
  
      value = `${day}/${month}/${year}`;
  
      // Set the properly formatted date in the input field
      setTamat(value);
    } else {
      setTamat(value);  // Update state with the current value (even partially entered)
    }

if (value.length === 10) {
  const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  // Check if the full date matches the DD/MM/YYYY format
  if (!datePattern.test(value)) {
    alert("Peringatan! Sila letakkan format yang betul DD/MM/YYYY dan nilai tarikh yang betul (e.g., 01/01/2024)");
    setTimeValidating(false); // Reset validating flag after alert
    return;
  }else if (isPastDate(value)) {
    alert("Peringatan! Tarikh tamat tidak boleh meletakkan sebelum tarikh hari ini");
    setTimeValidating(false); // Reset validating flag after alert
    return;
  }else if (!compareDate(mula,value)) {
    alert("Peringatan! Tarikh tamat tidak boleh meletakkan sebelum tarikh mula");
    setTimeValidating(false); // Reset validating flag after alert
    return;
  }else{
    setTimeValidating(true);
  }
  //compare the date with the start date
} 
};
const compareDate = (mula,tamat) => {
  const [mday, mmonth, myear] = mula.split('/').map(num => parseInt(num, 10));
  const mulaDateObj = new Date(myear, mmonth - 1, mday); // Create a Date object (month is 0-indexed)
  const [day, month, year] = tamat.split('/').map(num => parseInt(num, 10));
  const tamatDateObj = new Date(year, month - 1, day); // Create a Date object (month is 0-indexed)


  return mulaDateObj < tamatDateObj;
};

  const isPastDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(num => parseInt(num, 10));
    const inputDateObj = new Date(year, month - 1, day); // Create a Date object (month is 0-indexed)

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set today's time to 00:00 to only compare the date part

    return inputDateObj < today;
  };
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
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, '');
    setMaksimumPeserta(value);
  }
  const onChangeYuran = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, '');
    if (value === '') {
      setYuran('0.00');
      return;
    }
    let formattedValue = (parseInt(value, 10) / 100).toFixed(2);
    setYuran(formattedValue);
  };
  const onChangeTamat = (e) => {
    setTamat(e);
  };

  const programRegister = async (e) => {
    e.preventDefault();
    // if(!timeValidating){
    //   alert("Sila semak tarikh mula dan tamat!! Sila pastikan tarikh mula dan tamat tidak meletakkan sebelum tarikh hari ini dan format tarikh adalah betul (e.g., 01/01/2024)");
    //   return;
    // }
    //ensure all the fields are filled
    if (isiProgram === "" || kod === "" || mula === "" || nama === "" || penganjur === "" || penyelaras === "" || maksimumPeserta === "" || tamat === "" || yuran === "") {
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
      mula: formatDate(mula),
      nama: nama,
      penganjur: penganjur,
      penyelaras: penyelaras,
      maksimumPeserta: maksimumPeserta,
      jumlahPeserta: "0",
      pesertaStatus: {},
      pesertaList: [],
      transactionId: {},
      pesertaNama: {},
      tamat: formatDate(tamat),
      yuran: yuran,
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
      alert("Program berjaya didaftarkan!!");
      navigate(-1);
    });//create 2 end
  }

  return (
    <div className='app_box'>
      <div className='semakdaftarheader'>
        <button className='backbutton' onClick={() => navigate(-1)}><img src={backicon} alt='This is a back button.' className="backicon" /></button>
        <h1 className='semakdaftaradmin'>Tambah Program</h1>
      </div>
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
              <label className="kik">NAMA PENYELARAS</label>
              <div className='textarea'>
                <p className="kik">:</p>
                <input type="text" className='inputtext' onChange={onChangePenyelaras} value={penyelaras} disabled/></div>
            </div>
            <div className='maklumat'>
              <label className="kik">TARIKH MULA</label>
              <div className='textarea'>
                <p className="kik">:</p>
              <div>
         <Calendar
         className='date-field'
          onChange={onChangeMula}
          value={mula}// Optionally close on blur
          minDate={new Date()} 
        />
      </div>
      </div>
              {/* Input for Tarikh Mula */}
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
        /></div>
            </div>
            <div className='maklumat'>
              <label className="kik">MAKSIMUM PESERTA</label>
              <div className='textarea'>
                <p className="kik">:</p>
                <input type="text" className='orangtext' onChange={onChangeMaksimumPeserta} value={maksimumPeserta} />
                Orang 
                </div>
              {/* Input for MAKSIMUM PESERTA */}
            </div>
            <div className='maklumat'>
              <label className="kik">YURAN</label>
              <div className='textarea'>
                <p className="kik">:</p>
                <span className="currency-symbol">RM</span>
                <input type="text" className='inputtext' onChange={onChangeYuran} value={yuran} /></div>
              {/* Input for Yuran (RM) */}
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
       
      </form>
      <div className='submitBtn'><Buttons title="TAMBAH" onClick={programRegister}/></div>
    </div>
  )
}

export default Add
