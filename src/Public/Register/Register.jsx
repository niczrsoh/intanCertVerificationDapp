import { React, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../Backend/firebase/firebase-config'
import './Register.css';

const Register = () => {
  const [mykad, setMykad] = useState("");
  const [alamat, setAlamat] = useState("");
  const [emelPeribadi, setEmelPeribadi] = useState("");
  const [kataLaluan, setKataLaluan] = useState("");
  const [sahkataLaluan, setPengesahanKataLaluan] = useState("");
  const [jawatan, setJawatan] = useState("");
  const [nama, setNama] = useState("");
  const [TelefonPeribadi, setTelefonPeribadi] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const navigate = useNavigate();

  const validatePhoneNumber = (phoneNumber) => {
    // Remove dashes for validation
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    const phoneRegex = /^(01[0-9])-?[0-9]{7,8}$/;

    if (cleanedNumber.length < 10 || cleanedNumber.length > 11) {
      return false;
    }

    return phoneRegex.test(phoneNumber.replace(/\D/g, ''));
  };

  //navigate to login page after register
  const handleSubmit = async (e) => {
    e.preventDefault();
    const regex = /[0-9][0-9][0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9][0-9][0-9]/;
    if (!regex.test(mykad)) {
      alert('Sila masukkan IC dengan format "123456-12-1234".');
      return;
    }
    if (kataLaluan != sahkataLaluan) {
      alert('kata laluan tidak sama dengan kata laluan yang sah. \n Sila pastikan kata laluan sama dengan pengesahan kata laluan.');
      return;
    }

    //verify whether the user input ic document data has been exist or not
    const userCollectionRef = doc(db, "User", mykad)

    await getDoc(userCollectionRef).then(async (data) => {
      // console.log(data.data());
      if (data.data() != undefined) {
        alert("No. MyKad telah didaftar.");
      } else {
        await setDoc(userCollectionRef, {// create 2
          alamat: alamat,
          emelPeribadi: emelPeribadi,
          kataLaluan: kataLaluan,
          jawatan: jawatan,
          ic: mykad,
          nama: nama,
          imageUrl: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
          telefonPeribadi: TelefonPeribadi,
        }).then(() => {
          alert("Berjaya daftar akaun.");
          navigate('/login');
        });//create 2 end
      }
    });
  }

  const handlePhoneChange = (event) => {
    let value = event.target.value.replace(/[^0-9]/g, '').replace(/(\d{3})(\d+)/, '$1-$2');
    setTelefonPeribadi(value);

    // Validate the phone number format
    const regex = /^[0-9]{3}-[0-9]{7,8}$/;
    if (regex.test(value)) {
      setIsPhoneValid(true);
    } else {
      setIsPhoneValid(false);
    }
  };

  return (

    <>
      <div className='registerPage'>
        <div className='registerContainer'>
          <div className='titleRegister'>
            <h1>Daftar Akaun</h1>
            <p>Sebagai Pengguna</p>
          </div>
          {/* Register Form */}
          <form className='RegisterForm' onSubmit={handleSubmit}>
            <label htmlFor='RegisterMyKad'>No. MyKad:
              <input id='RegisterMyKad' name='RegisterMyKad' type='text' placeholder='000000-00-0000' minLength='14' maxLength='14' required onChange={(event) => {
                setMykad(event.target.value)
              }} />
            </label>
            <label htmlFor='RegisterMyKad'><br></br>Nama:
              <input id='RegisterMyKad' name='Nama' type='text' placeholder='Ali bin Ahmad' required onChange={(event) => {
                setNama(event.target.value)
              }} />
            </label>
            <label htmlFor='RegisterMyKad'><br></br>Alamat Pejabat:
              <input id='RegisterMyKad' name='Alamat' type='text' placeholder='23, Jalan Teknologi, Shah Alam' required onChange={(event) => {
                setAlamat(event.target.value)
              }} />
            </label>
            <label htmlFor='RegisterMyKad'><br></br>Emel Peribadi:
              <input id='RegisterMyKad' name='Emel Peribadi' type='email' placeholder='aliAhmad@gmail.com' required onChange={(event) => {
                setEmelPeribadi(event.target.value)
              }} />
            </label>

            <label htmlFor='RegisterMyKad'><br></br>Jawatan dan Gred:
              <input id='RegisterMyKad' name='Jawatan/Gred' type='text' placeholder='Jurutera' required onChange={(event) => {
                setJawatan(event.target.value)
              }} />
            </label>
            <div>
              <label htmlFor='RegisterMyKad'>
                <br></br>Telefon Peribadi:
                <input
                  id='RegisterMyKad'
                  name='TelefonPeribadi'
                  type='tel'
                  pattern="[0-9]{3}-[0-9]{7,8}"
                  inputMode='numeric'
                  required
                  placeholder='012-3456789'
                  value={TelefonPeribadi}
                  onChange={handlePhoneChange}
                />
              </label>

              {/* Error message if the phone number format is invalid */}
              {!isPhoneValid && (
                <p style={{ color: 'red', textAlign: 'left' }}>
                  Nombor telefon mestilah 10 atau 11 digit
                </p>
              )}
            </div>
            <label htmlFor='RegisterMyKad'><br></br>Kata Laluan:
              <input id='RegisterMyKad' name='KataLaluan' type='password' placeholder='******' required onChange={(event) => {
                setKataLaluan(event.target.value)
              }} />
            </label>
            <label htmlFor='RegisterMyKad'><br></br>Pengesahan Kata Laluan:
              <input id='RegisterMyKad' name='PengesahanKataLaluan' type='password' placeholder='******' required onChange={(event) => {
                setPengesahanKataLaluan(event.target.value)
              }} />
            </label>
            <button className='register' type='Submit'>Daftar Akaun</button>
          </form>
          <div className='otherLinks'>
            <NavLink className='otherlink' to='/login'>Telah mempunyai akaun? Sila log masuk</NavLink>
          </div>

        </div>
      </div>

    </>

  )
}

export default Register;