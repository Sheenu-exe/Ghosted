import { auth } from "../../firebase.config";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "../../App.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import google from "../img/ggl.png"
import { Alert } from "./Alerts/Error";
import Social from "../img/social-network-concept-isolated.jpg"
const cookies = new Cookies();

export const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let timeout;
    if (error) {
      // Set a timeout to clear the error after 3 seconds
      timeout = setTimeout(() => {
        setError("");
      }, 3000);
    }

    // Cleanup the timeout on component unmount or when the error changes
    return () => clearTimeout(timeout);
  }, [error]);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      cookies.set("isLoggedIn", "true");
      navigate("/");
    } catch (error) {
      console.error("Authentication error:", error);
      setError(error.message);
    }
  };

  const handleSignInWithEmailPassword = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      cookies.set("isLoggedIn", "true");
      navigate("/");
      console.log(auth)
    } catch (error) {
      console.error("Authentication error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-row justify-center items-center">
      <div className="min-w-[50vw] flex justify-center items-center min-h-screen">
        <img src={Social} alt="" />
      </div>
      <div className="signin flex flex-col justify-center items-center min-h-[screen] min-w-[50vw] p-10 pb-0">
        
        <div className="flex flex-col justify-center w-[60%]">
        <div className="mb-5">
        <p className="font-bold my-1 text-3xl">Sign In</p>
        <p className="text-sm my-1 text-gray-700">Welcome back! Please enter your details.</p>
        </div>
          <form className="flex flex-col justify-center items-center" onSubmit={handleSignInWithEmailPassword}>
            <input placeholder="Email" className="border-b p-3 text-base mb-3 w-full" value={email} onChange={(e) => setEmail(e.target.value)} type="text" name="email" />
            <input placeholder="Password" className="border-b p-3 text-base mb-3 w-full" value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="pass" />
            <button className="btn  bg-[#e34462]  p-0 my-2 w-full text-white text-lg" type="submit">Log In</button>
          </form>
          
          <button className="btn bg-[#e34462] text-white  flex font-semibold my-4 items-center text-base justify-center" onClick={signInWithGoogle} type="button"><img className="w-8" src={google} alt="" /> Sign In with Google</button>
          <a className="text-xs text-center text-blue-900" href=".">Forgot password?</a>
        </div>
        <div className="signin py-3 text-sm mt-2 justify-center flex w-80 p-10">
        <p>Need An Account?</p><a className="ml-1 font-bold" href="/signup">Create an account</a>
      </div>
      </div>
      
      {error && <Alert message={error}/>}
    </div>
  );
};
