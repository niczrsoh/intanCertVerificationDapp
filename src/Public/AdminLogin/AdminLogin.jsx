import { React, useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import MyAlgo from "@randlabs/myalgo-connect";
import { PeraWalletConnect } from "@perawallet/connect";
import AppContext from "../../Context/AppContext";
import { db } from "../../Backend/firebase/firebase-config";
import { getDoc, doc } from "firebase/firestore";
import SimpleButton from "../../Component/button/SimpleButton";
import { connectWallet } from "../../Utils/ethUtils";

function AdminLogin() {
  const navigate = useNavigate();
  const [mykad, setMykad] = useState("");
  const myAlgoWallet = new MyAlgo();
  const { account, setAccount } = useContext(AppContext);
  //clear the local storage after refresh
  useEffect(() => {
    sessionStorage.clear();
    localStorage.clear();
    setAccount("");
  }, []);
  const connectMyAlgoWallet = async () => {
    let account = "";
    try {
      await myAlgoWallet.connect().then((value) => {
        console.log("account", value[0]);
        account = value[0].address;
        setAccount(value[0].address);
      });
    } catch (err) {
      console.error("Error connecting to wallet:", err);
    }
    return account;
  };
  const connectPeraAlgoWallet = async () => {
    let account = "";
    const peraConnect = new PeraWalletConnect({
      shouldShowSignTxnToast: false,
    });
    await peraConnect
      .connect()
      .then((value) => {
        setAccount(value);
        account = value;
        console.log("Connected with Pera Wallet. Account address:", value);
      })
      .catch((err) => {
        console.error("Error connecting with Pera Wallet:", err);
      });
    return account;
  };

  const connectEthWallet = async () => {
    try {
      const account = await connectWallet();
      setAccount(account);
      return account;
    } catch (err) {
      console.error("Error connecting to wallet:", err);
    }
  };

  return (
    <>
      <div className="adminLoginPage">
        <div className="adminLoginContainer">
          <div className="titleAdminLogin">
            <h1>Daftar Masuk</h1>
            <p>Sebagai Admin</p>
          </div>
          {/*Amin login form */}
          <form
            className="adminLoginForm"
            method="post"
            action="/admin/home"
            onSubmit
          >
            <label htmlFor="LoginMykad">
              No. MyKad:
              <input
                id="LoginMykad"
                name="LoginMykad"
                type="text"
                placeholder="000000-00-0000"
                minLength="14"
                maxLength="14"
                onChange={(event) => {
                  setMykad(event.target.value);
                }}
              />
            </label>

            <div>
              {/* Sila log masuk dengan salah satu algorand wallet untuk dapatkan
              algorand akaun */}
              Sila log masuk dengan metamask wallet anda untuk dapatkan akaun
            </div>
            <br></br>
            {/* <div>
              <SimpleButton
                title="Connect to Pera Algo Wallet"
                onClick={connectPeraAlgoWallet}g 
              ></SimpleButton>
              <SimpleButton
                title="Connect to MyAlgo Wallet"
                onClick={connectMyAlgoWallet}
              ></SimpleButton>
            </div> */}
            <SimpleButton
              title="Sambung ke Metamask Wallet"
              onClick={connectEthWallet}
            ></SimpleButton>
            <div>Akaun yang anda log masuk: </div>
            <div className="displayAcc">
              <div>{account}</div>
            </div>
            <button type="Submit">Masuk</button>
            <div className="otherLinks">
              <NavLink className="otherlink" to="/login">
                Log masuk sebagai pengguna
              </NavLink>
            </div>
          </form>

        </div>
      </div>
    </>
  );
}

export default AdminLogin;
