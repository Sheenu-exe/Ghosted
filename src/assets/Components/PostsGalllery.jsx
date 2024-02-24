import { useEffect, useState } from 'react';
import { db } from '../../firebase.config';
import { collection, query, onSnapshot, orderBy  } from 'firebase/firestore';
import { doc, deleteDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase.config';
import { RiDeleteBin5Line } from "react-icons/ri";
import PostIt from "../img/PostIt.png"
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

export const FeedArea = () => {
    const [user] = useAuthState(auth);
    const [posts, setPosts] = useState([]);
    const [like,setLike] = useState(false)


    const likeAdd = () =>{
      return(
        setLike(!like)
      )
    }

    useEffect(() => {
      // Create a query against the collection "posts", ordering them by creation time
      const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      
      // Listen for real-time updates
      const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
        const postsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsArray);
      });
  
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, []);
  
    // Render posts or a message if there are no posts
    if (posts.length === 0) {
      return <div className='min-h-[82vh] flex justify-center items-center flex-col'>
        <img className='h-96 w-96' src={PostIt} alt="" />
        <h1 className='text-6xl font-bold'>No Post To Display!</h1>
        <p className='text-xl m-2'>You Should Create one!</p>
      </div>;
    
    }
    const deletePost = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
          await deleteDoc(doc(db, "posts", postId));
          // Optionally, refresh the posts list or use onSnapshot to listen for real-time updates
        }
      };
        // You would also need to update the 'likedByUser' status here for a complete implementation

  
      return (
        <div className="w-full max-h-fit flex justify-center overflow-x-hidden items-start">
                  <div className='w-fit '>
          {posts.map((post) => (
            <div key={post.id} className="flex min-h-fit flex-col max-w-lg p-3 m-2 overflow-hidden rounded-lg shadow-md bg-gray-100 text-gray-900">
            <div className="flex justify-start items-center">
                <img alt="" src={post.userPhotoUrl || 'AvatarUrl'} className="object-cover m-1 w-12 h-12 rounded-full shadow bg-gray-100" />
                <div className="flex flex-col items-center">
                    <a rel="noopener noreferrer" href="#" className="text-lg font-semibold">{post.userName || 'Anonymous'}</a>
                </div>
            </div>
            <div>
                <img src={post.imageUrl} alt="" className="object-cover rounded-lg w-full my-4 h-fit bg-gray-500" />
                <div className='flex items-center'>
                <h2 className="text-xl mx-1 font-extrabold">{post.userName || 'Anonymous'}</h2>
                <p className="text-base text-gray-900">{post.caption}</p>
                </div>
            </div>
            <div className="flex flex-wrap justify-between">
                <div className="flex space-x-2 my-2 items-center text-sm text-white">
                    <button onClick={likeAdd} type="button" className="flex items-center p-1 text-2xl space-x-1.5">
                        {like?<FaHeart className=' fill-red-500'/>:<FaRegHeart/>}
                        
                    </button>
                    {user && user.uid === post.userId && (
                <button onClick={() => deletePost(post.id)} className="delete-button w-4 h-4 text-2xl fill-current text-white">
                  <RiDeleteBin5Line/>
                </button>
              )}
                </div>
            </div>
        </div>
          ))}
        </div>
        </div>
      );
  };