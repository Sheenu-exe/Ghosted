import { useState , useEffect} from "react";
import { db, auth , database } from "../../firebase.config";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import PropTypes from 'prop-types';
import { useAuthState } from "react-firebase-hooks/auth";
import { ref as databaseRef, get } from "firebase/database";

// Assuming PiXCircleDuotone is a placeholder, make sure to replace it with an actual import if it's intended to be used
import { PiXSquareDuotone } from "react-icons/pi"; // Placeholder, replace with your actual import

export const PostUploader = ({ postCloser }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [user] = useAuthState(auth); // This hook is from react-firebase-hooks
  const [imageUrl, setImageUrl] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  useEffect(() => {
    const fetchProfilePicture = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log("No user signed in.");
        return;
      }

      // Directly fetch the user's profilePicUrl
      const userProfileRef = databaseRef(
        database,
        `users/${currentUser.uid}/profilePicUrl`
      );
      console.log(userProfileRef);
      const snapshot = await get(userProfileRef);
      if (snapshot.exists()) {
        const profilePicUrl = snapshot.val();
        setImageUrl(profilePicUrl);
      } else {
        console.log("No profile picture URL found.");
      }
    };

    fetchProfilePicture();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !user) return;
    setUploading(true);

    const storage = getStorage();
    const imageName = `${image.name}_${Date.now()}`; // Unique name for the image
    const storageRef = ref(storage, `posts/${imageName}`);
    try {
      const uploadTask = await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(uploadTask.ref);

      await addDoc(collection(db, "posts"), {
        caption,
        imageUrl: downloadURL,
        userName: user.displayName || "Anonymous", // Using the user's display name
        userPhotoUrl: imageUrl || "", // Using photoURL from the auth profile
        userId: user.uid, // Saving user's UID for permission checks
        createdAt: Date.now(),
      });

      setUploading(false);
      setCaption("");
      setImage(null);
      if (postCloser) postCloser(); // Close the post uploader UI if postCloser is provided
      alert("Post uploaded successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
      setUploading(false);
    }
  };
  console.log(user);

  return (
    <div className="absolute top-0 left-0 z-10 backdrop-blur-sm backdrop-brightness-75 h-screen w-screen flex flex-col justify-center items-center">
      {/* Replace PiXCircleDuotone with your actual icon component */}
      <button className="absolute right-10 text-3xl top-10 text-white" onClick={postCloser}><PiXSquareDuotone /></button>
      <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
        <input
          type="text"
          placeholder="Enter a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="input input-bordered w-full max-w-xs m-2"
        />
        <input type="file" className="file-input w-full max-w-xs" onChange={handleImageChange} />
        <button className="btn btn-primary my-3" type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Post"}
        </button>
      </form>
    </div>
  );
};

PostUploader.propTypes = {
  postCloser: PropTypes.func.isRequired,
};
