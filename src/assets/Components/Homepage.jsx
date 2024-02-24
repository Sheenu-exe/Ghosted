import { auth } from "../../firebase.config";
import { Story } from "./Story";
import { useState } from "react";
import { FeedArea } from "./PostsGalllery";
import { Sidebar } from "./Sidebar";
import { PostUploader } from "./createPost";

export const Home = () => {
  const [post,setPost] = useState(false)

  function postOpener(){
    return(
      setPost(!post)
    )
  }
  console.log(auth);
  return (
    <div className="flex flex-row"><div className="w-[20vw]"><Sidebar postopener={postOpener} /></div><div className="feed flex w-[60vw] flex-col h-fit border-r border-gray-320">
       {post?<PostUploader postCloser={postOpener}/>:""}
      <Story />
      <FeedArea />
    </div></div>
  );
};
