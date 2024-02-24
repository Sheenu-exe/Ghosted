import { auth } from "../../firebase.config";
import {
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    updateProfile

  } from "firebase/auth";
  import SignupVector from "../img/sign-up-4922762-4097209.png"
import "../../App.css"
  import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import IcGoogle from "../img/ggl.png"

const cookies = new Cookies()
export const SignUp = () =>{
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");


    const signInWithGoogle = async () => {
        try {
          const provider = new GoogleAuthProvider();
          await signInWithPopup(auth, provider);
          cookies.set("isLoggedIn", "true");
          navigate("/");
        } catch (error) {
          console.error("Authentication error:", error);
        }
      };

    
      const signUpWithEmailPassword = async (e) => {
        e.preventDefault(); // Prevent the form from reloading the page
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          // Await the completion of the updateProfile call
          await updateProfile(userCredential.user, {
            displayName: username,
            
          });
          console.log(userCredential.user)
          cookies.set("username",username)
         
          // On success, set a cookie or local storage
          cookies.set("isLoggedIn", "true"); 
          // Cookie expires in 7 days
          console.log(userCredential); // For debugging purposes
          navigate("/profile"); // Redirect to the main app page after sign up
        } catch (error) {
          console.error("Sign Up error:", error.message);
        }
      };
      
    return(
        <div className="w-screen h-screen flex">
          
          <div className="w-[50vw]  h-screen flex flex-col justify-center items-center">
          <div className="signin mx-4 text-center  w-full m-3 text-sm justify-center flex">
<p className=" mx-1 flex w-[80%]">Have an Account? <a className="font-semibold text-sky-400" href="/signin">Log In</a></p>
</div>

<div className="flex justify-center w-[80%] signin flex-col">
<h1 className="font-bold m-3 text-4xl">Sign Up</h1>
<form className="flex mx-3 justify-center flex-col" onSubmit={signUpWithEmailPassword}>
<input placeholder="Username" className="border-b p-3 text-base mb-3 w-full" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
<input placeholder="Email" className="border-b p-3 text-base mb-3 w-full" value={email} onChange={(e) => setEmail(e.target.value)} type="text" name="email" id="mail" />
<input placeholder="Password" className="border-b p-3 text-base mb-3 w-full"  value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="pass" id="pass" />

<p className="text-xs text-gray-500">By signing up, you agree to our Terms, Privacy Policy & Cookies Policy. <a className=" text-blue-900" href=".">Learn More</a></p>

<button className="btn flex  w-full justify-center my-2 bg-[#0060f9] text-white p-1 rounded-md"  onClick={signUpWithEmailPassword} to="/profile" type="submit">Sign Up</button>

</form>
<span className="flex my-2 justify-center items-center">
<span className="h-px flex-1  bg-zinc-300"></span>
<span className="shrink-0 px-6">OR</span>
<span className="h-px flex-1 bg-zinc-300"></span>
</span>
<button className="btn mx-3 flex justify-center my-2 bg-[#0060f9] text-white p-1 rounded-md" onClick={signInWithGoogle}><img className="w-8" src={IcGoogle} alt="" />Log In with Google</button>
</div>

</div>
<div className="w-[50vw] items-center h-screen flex justify-center">
  <img src={SignupVector} alt="" />
</div>
        </div>
    )
}