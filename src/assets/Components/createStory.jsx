
import { storage, db, auth } from '../../firebase.config'; // Adjust the import paths according to your project structure
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import PropTypes from 'prop-types';
import { PiXCircleDuotone } from 'react-icons/pi';
import { useState } from 'react';// Adjust based on your project structure



export const CreateStory = ({onClose}) => {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const uploadStory = async () => {
        if (!image || uploading) return;

        setUploading(true);
        const imageRef = ref(storage, `stories/${image.name}_${Date.now()}`);
        try {
            // Upload the image to Firebase Storage
            const snapshot = await uploadBytes(imageRef, image);
            const imageUrl = await getDownloadURL(snapshot.ref);

            // Add story metadata to Firestore
            await addDoc(collection(db, "stories"), {
                userId: auth.currentUser.uid,
                imageUrl: imageUrl,
                imageRef: snapshot.ref.fullPath, // Save the reference to the image in Storage for later use
                createdAt: serverTimestamp(), // Use server timestamp for consistency
            });

            alert('Story uploaded successfully!');
        } catch (error) {
            console.error("Error uploading story: ", error);
            alert("Error uploading story.");
        } finally {
            setUploading(false);
            setImage(null);
        }
    };

    return (
        <div className='absolute backdrop-brightness-75 backdrop-blur-sm left-0 top-0 z-[100] w-screen h-screen flex flex-col justify-center items-center'>
            <button className='text-4xl absolute top-10 right-10' onClick={onClose}><PiXCircleDuotone/></button>
            <input className='file-input w-full max-w-xs' type="file" name='story' onChange={handleFileChange} accept="image/*" />
            <button className='btn btn-primary my-3' onClick={uploadStory} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Story'}
            </button>
        </div>
    );
};
CreateStory.propTypes = {
    onClose: PropTypes.func,
  };