import { useState, useEffect } from "react";
import { auth, database } from "../../firebase.config";
import { ref as databaseRef, get } from "firebase/database";
import {
  PiCompassDuotone,
  PiDoorOpenDuotone,
  PiGearDuotone,
  PiHeartDuotone,
  PiHouseDuotone,
  PiMessengerLogoDuotone,
  PiPlusSquareDuotone,
  PiVideoDuotone,
} from "react-icons/pi";
import Logo from "../img/Logo.png";
import { PiMagnifyingGlassDuotone } from "react-icons/pi";
import Cookies from "universal-cookie";
import PropTypes from 'prop-types';



const cookie = new Cookies();


export const Sidebar = ({postopener}) => {


  const username = auth.currentUser?.displayName || "Guest";
  const [imageUrl, setImageUrl] = useState("");

  const pronoun = cookie.get("selectedPronoun");
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

  const signOut = async () => {
    try {
      await auth.signOut();
      Cookies.remove("userAuth");
      console.log("User signed out successfully and cookie removed.");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <>
      <div className="fixed border-r  top-0 left-0 h-screen p-3 space-y-2 w-[20vw] bg-base text-zinc-900">
        <div className="titlearea my-2 items-center justify-start ml-4 w-full flex">
          <img className="w-10 h-auto" src={Logo} alt="" />

          <h1 className="logo text-5xl h-10">Ghosted</h1>
        </div>
        <div className="flex items-center p-2 space-x-4">
          <img
            className="w-16 h-16 object-cover rounded-xl bg-gray-500"
            src={imageUrl || "/path/to/default/image.png"}
            alt="Profile"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/path/to/default/image.png";
            }}
          />
          <div>
            <h2 className="text-xl font-semibold">{username}</h2>
            <h2 className="text-sm m-0 text-gray-600">{pronoun}</h2>
            <span className="flex items-center space-x-1">
              <a
                rel="noopener noreferrer"
                href="/profile"
                className="text-xs hover:underline text-zinc-600"
              >
                View profile
              </a>
            </span>
          </div>
        </div>
        <div className="divide-y divide-gray-300">
          <ul className="pt-2 pb-4 space-y-1 text-sm">
            <li className="text-zinc-900">
              <a
                rel="noopener noreferrer"
                href="/"
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <span className="text-2xl">
                  <PiHouseDuotone />
                </span>
                <span>Home</span>
              </a>
            </li>
            <li>
              <a
                rel="noopener noreferrer"
                href="#"
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <span className="text-2xl">
                  <PiMagnifyingGlassDuotone />
                </span>
                <span>Search</span>
              </a>
            </li>
            <li>
              <a
                rel="noopener noreferrer"
                href="#"
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <span className="text-2xl">
                  <PiCompassDuotone />
                </span>
                <span>Explore</span>
              </a>
            </li>
            <li>
              <a
                rel="noopener noreferrer"
                href="#"
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <span className="text-2xl">
                  <PiMessengerLogoDuotone />
                </span>
                <span>Chats</span>
              </a>
            </li>
            <li>
              <a
                rel="noopener noreferrer"
                href="#"
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <span className="text-2xl">
                  <PiVideoDuotone />
                </span>
                <span>Reels</span>
              </a>
            </li>
            <li>
              <a
                rel="noopener noreferrer"
                href="#"
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <span className="text-2xl">
                  <PiHeartDuotone />
                </span>
                <span>Notifications</span>
              </a>
            </li>
            <li>
              <a
                rel="noopener noreferrer"
                onClick={postopener}
                className="flex items-center cursor-pointer p-2 space-x-3 rounded-md"
              >
                <span className="text-2xl">
                  <PiPlusSquareDuotone />
                </span>
                <span>Create</span>
              </a>
            </li>
          </ul>
          <ul className="pt-4 pb-2 space-y-1 text-sm">
            <li>
              <a
                rel="noopener noreferrer"
                href="#"
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <span className="text-2xl">
                  <PiGearDuotone />
                </span>
                <span>Setting</span>
              </a>
            </li>
            <li>
              <a
                rel="noopener noreferrer"
                onClick={signOut}
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <span className="text-2xl">
                  <PiDoorOpenDuotone />
                </span>
                <span>Log Out</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
Sidebar.propTypes = {
    postopener: PropTypes.func,
  };