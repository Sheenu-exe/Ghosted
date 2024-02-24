import { useState, useEffect } from 'react';
import { CreateStory } from './createStory'; // Adjust import path as needed
import { IoIosAdd } from "react-icons/io";
import { IoTrash } from "react-icons/io5"; // Ensure you've installed react-icons and imported correctly
import { db, auth, database } from '../../firebase.config'; // Ensure this path matches your project structure
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { ref as databaseRef, get } from 'firebase/database';
import "../../App.css"

export const Story = () => {
  const [add, setAdd] = useState(false);
  const [userStoriesVisible, setUserStoriesVisible] = useState({});
  const [clickTimeout, setClickTimeout] = useState(null);
  const [stories, setStories] = useState({});
  const [userProfilePictures, setUserProfilePictures] = useState({});

  useEffect(() => {
    const fetchUserProfilePictures = async () => {
      const usersRef = databaseRef(database, 'users');
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const profilePictures = Object.keys(usersData).reduce((acc, userId) => {
          acc[userId] = usersData[userId].profilePicUrl || '';
          return acc;
        }, {});
        setUserProfilePictures(profilePictures);
      } else {
        console.log("No users found.");
      }
    };

    fetchUserProfilePictures();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const storiesByUser = {};
      querySnapshot.forEach((doc) => {
        const storyData = { id: doc.id, ...doc.data() };
        if (storiesByUser[storyData.userId]) {
          storiesByUser[storyData.userId].push(storyData);
        } else {
          storiesByUser[storyData.userId] = [storyData];
        }
      });
      setStories(storiesByUser);
    });

    return () => unsubscribe(); // Clean up on unmount
  }, []);

  const handleStoryClick = (userId) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setUserStoriesVisible({}); // Close all by resetting state
      setClickTimeout(null);
    } else {
      const timeout = setTimeout(() => {
        setUserStoriesVisible(prevState => ({
          ...prevState,
          [userId]: !prevState[userId]
        }));
        setClickTimeout(null);
      }, 300);
      setClickTimeout(timeout);
    }
  };

  const toggleAddStory = () => setAdd(!add);

  const deleteStory = async (storyId, event) => {
    event.stopPropagation(); // Prevent the click from opening the story
    try {
      await deleteDoc(doc(db, 'stories', storyId));
      console.log('Story deleted successfully');
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  return (
    <>
      {add && <CreateStory onClose={() => setAdd(false)} />}
      <div className="stories h-[18vh] w-full overflow-x-scroll flex items-center">
        <div>
       
        <button onClick={toggleAddStory} className='flex justify-center items-center rounded-full p-1 m-2 bg-gray-200 text-black'>
        <img src={userProfilePictures[auth.currentUser.uid]} className='rounded-full addprofile object-cover w-[60px] h-[60px] border-2 border-base' alt="User Profile" />

          <IoIosAdd size={24} /></button>
        </div>
        {Object.keys(stories).map((userId) => (
          <div key={userId} onClick={() => handleStoryClick(userId)} className="user-story-container h-full w-fit flex justify-center items-center m-2">
            <div className='p-1 colorbg relative  rounded-full'>
              <img src={userStoriesVisible[userId] ? stories[userId][0]?.imageUrl : userProfilePictures[userId] || 'path/to/default/profile/image'} alt="Story cover" className='rounded-full object-cover w-[60px] h-[60px] border-2 border-white' />
              
            </div>
            {userStoriesVisible[userId] && (
              <div className="user-stories-expanded flex justify-center items-center backdrop-blur-sm backdrop-brightness-75 absolute z-50 top-0 left-0 w-screen h-screen">
                <div className="stories-scroll-container flex overflow-x-scroll overflow-y-hidden justify-start items-center h-screen w-screen space-x-4 bg-black bg-opacity-50 rounded-lg">
                  {stories[userId].map(story => (
                    <div key={story.id} className='story-item h-screen w-screen flex justify-center items-center flex-shrink-0 relative'>
                      <img src={story.imageUrl} className='h-[90vh] rounded-lg mx-1' alt="Story" />
                      {auth.currentUser && auth.currentUser.uid === story.userId && (
                        <button onClick={(e) => deleteStory(story.id, e)} className="delete-button absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full">
                          <IoTrash size={24} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
