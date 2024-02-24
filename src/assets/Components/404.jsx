import { useEffect, useState } from 'react';
import ErrorImg from "../img/no-internet.png"


const Error = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const setOnline = () => setIsOnline(true);
    const setOffline = () => setIsOnline(false);

    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="bg-zinc-100 flex flex-col justify-center items-center h-screen w-screen fixed top-0 left-0 z-50 text-white text-center p-4">
        <img src={ErrorImg} alt="" />
        <p className='text-3xl font-bold m-2 text-pink-600'>Error: No network connection. Please check your internet connection.</p>
      </div>
    );
  }

  return null; // Render nothing if there's an internet connection
};

export default Error;
