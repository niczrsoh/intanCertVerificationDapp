import { React, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { db } from '../../Backend/firebase/firebase-config'
import { getDoc, doc } from 'firebase/firestore'
import './UserLogin.css';

function UserLogin() {
  const navigate = useNavigate();
  const [mykad, setMykad] = useState("");
  const [password, setPassword] = useState("");

  //after login, direct user to user home page (program list), set the role as USER

  return (
    <>
      <div className='loginPage'>
        <div className='loginContainer'>
          <div className='titleLogin'>
            <h1>Daftar Masuk</h1>
            <p>Sebagai Pengguna</p>
          </div>
          {/*User login form */}
          <form className='loginForm' action="senarai-program-sedia-ada" onSubmit>
            <label htmlFor='LoginMyKad'>No. MyKad:
              <input id='LoginMyKad' name='LoginMyKad' type='text' placeholder='No. MyKad' minLength='14' maxLength='14' onChange={(event) => {
                setMykad(event.target.value)
              }} />
            </label>
            <br></br>
            <label htmlFor='LoginMyKad'>Kata Laluan:
              <input id='LoginMyKad' name='LoginMyKad' type='password' placeholder='Kata Laluan' onChange={(event) => {
                setPassword(event.target.value)
              }} />
            </label>
            <button className='login' type='Submit'>Masuk</button>
            <div className='otherLinks'>
              <NavLink className='otherlink' to='/register'>Tidak mempunyai akaun? Daftar akaun</NavLink>
              <NavLink className='otherlink' to='/admin-login'>Log masuk sebagai admin</NavLink>
            </div>

          </form>

        </div>
      </div>
    </>
  )
}

export default UserLogin;