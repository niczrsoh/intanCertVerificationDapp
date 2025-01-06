import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Buttons } from '../../Component'
import backicon from '../../img/arrow.png'
import './programedit.css'

{/* Unused check back*/}
const ProgramEdit = () => {
  const navigate = useNavigate();
  return (
    <div className='app_box'>
      <div className='daftarheader'>
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
      <h1 className='daftaradmin' style={{ marginLeft: '16px' }}>KEMASKINI SIJIL</h1>
      </div>
        <form>
      <div>
        <div className='maklumatadminbahru'>
          MAKLUMAT SIJIL
        </div>
        <div className='maklumatsijil'>
          <div className='maklumat'>
            <label>TAJUK SIJIL</label>
            <div className='textarea'>
            <p>:</p>
            <input type="text" className='inputtext'/></div>
          </div>
          <div className='maklumat'>
            <label>TARIKH MULA</label>
            <div className='textarea'>
            <p>:</p>
            <input type="text" className='inputtext'/></div>
          </div>
          <div className='maklumat'>
            <label>TARIKH TAMAT</label>
            <div className='textarea'>
            <p>:</p>
            <input type="text" className='inputtext'/></div>
          </div>
          </div>
          </div>
          <div>
          <div className='maklumatadminbahru'>
          MAKLUMAT PENGUNA
        </div>
        <div className='maklumatsijil'>
          <div className='maklumat'>
            <label>NAMA</label>
            <div className='textarea'>
            <p>:</p>
            <input type="text" className='inputtext'/></div>
          </div>
          <div className='maklumat'>
            <label>No. MYKAD</label>
            <div className='textarea'>
            <p>:</p>
            <input type="text" className='inputtext'/></div>
          </div>
          </div>
          </div>
        </form>
        <div className='submitBtn'><Buttons title="Hantar"/></div>
      
    </div>
  )
}

export default ProgramEdit
