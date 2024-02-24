import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as databaseRef, set, push } from 'firebase/database';
import { storage, database, auth } from '../../firebase.config';
import { IoAddOutline } from "react-icons/io5";
import { useState,useEffect } from 'react';
import Cookies from 'universal-cookie';


const cookies = new Cookies()
export default function Profile() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploader,setUploader] = useState("Upload")
  // Default image URL for initial state
  const [img, setImg] = useState("https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg");
  const [selectedPronoun, setSelectedPronoun] = useState('');
  useEffect(() => {
    // Check if there's already a selected pronoun in the cookies at component mount
    const pronoun = cookies.get('selectedPronoun');
    if (pronoun) {
      setSelectedPronoun(pronoun);
    }
  }, []);

  const handlePronounChange = (event) => {
    const pronounValue = event.target.value;
    setSelectedPronoun(pronounValue);

    // Save the selected pronoun in a cookie that expires in 30 days
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    cookies.set('selectedPronoun', pronounValue, { path: '/', expires });
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the file
    if (file) {
      setFile(file); // Set the selected file into state
      setImg(URL.createObjectURL(file)); // Create and set the URL for preview
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("No user signed in.");
      return;
    }

    const uniqueFileName = `profilePictures/${currentUser.uid}_${uuidv4()}`;
    const fileRef = storageRef(storage, uniqueFileName);
    try {
      setUploader("Uploading")
      const uploadTaskSnapshot = await uploadBytes(fileRef, file);
      const photoURL = await getDownloadURL(uploadTaskSnapshot.ref);

      // Store the file URL and link it to the user
      const newPhotoRef = push(databaseRef(database, 'profilePictures'));
      await set(newPhotoRef, {
        userId: currentUser.uid,
        imageUrl: photoURL,
      });
      setUploader("Uploading...")
      const userRef = databaseRef(database, `users/${currentUser.uid}`);
      await set(userRef, {
        profilePicKey: newPhotoRef.key,
        profilePicUrl: photoURL,
      });
      setUploader("Uploaded")
      navigate('/');

      console.log('Photo uploaded and linked to user profile successfully!');
      
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };

  return (
    <div className="w-screen editProfile flex min-h-screen">
      <div className="w-1/2 min-h-screen flex justify-center items-center">
        <div className=" w-60 relative h-60 rounded-full border border-gray-700 flex justify-center items-center">
          <label className='bg-zinc-900 text-white p-2 rounded-full absolute right-6 text-xl bottom-0' htmlFor="profile"><IoAddOutline/></label>
          <input
            id="profile"
            onChange={handleFileChange}
            className="opacity-0 absolute h-48 w-48 cursor-pointer"
            type="file"
            accept="image/*"
            contentEditable
          />
          <img src={img} className='w-60 h-60 object-cover rounded-full' alt="Profile preview" />
        </div>
      </div>
      <div className="w-1/2 min-h-screen flex flex-col items-center">
        <h1 className='text-6xl my-4 font-bold text-white mt-10'>Set Up Your Profile!</h1>
        <form action="submit" className='flex flex-col'>
        <input placeholder='Full name' className='p-2 m-6 border min-w-72 border-gray-300 rounded-lg' type="text" name='name'/>

        {/* Gender Field */}
        <fieldset className='m-6 mt-0'>
      <legend>Select Pronoun:</legend>
      <div className="flex items-center justify-center">
        <label htmlFor="he-him" className="flex mx-3 cursor-pointer items-start">
          <input
            type="radio"
            id="he-him"
            name="pronoun"
            value="He/Him"
            checked={selectedPronoun === 'He/Him'}
            onChange={handlePronounChange}
            className='w-4 h-4'
          />
          <span className="font-medium ml-2 text-xl">He/Him</span>
        </label>

        <label htmlFor="she-her" className="flex cursor-pointer items-center">
          <input
            type="radio"
            id="she-her"
            name="pronoun"
            value="She/Her"
            checked={selectedPronoun === 'She/Her'}
            onChange={handlePronounChange}
            className='w-4 h-4'
          />
          <span className="font-medium ml-2 text-xl">She/Her</span>
        </label>
      </div>
      {selectedPronoun && <p>Selected pronoun: {selectedPronoun}</p>}
    </fieldset>
        {/* Gender Field Ends */}
        <textarea name="bio" className='rounded-lg p-1' placeholder='Enter Bio' id="bio" cols="58" rows="6"></textarea>
        
        </form>
        <button onClick={handleUpload} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4">
          {uploader}
        </button>
      </div>
    </div>
  );
}
