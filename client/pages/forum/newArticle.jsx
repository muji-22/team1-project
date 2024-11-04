import Link from "next/link";
import Myeditor from "@/components/editor/Myeditor";
import { useState, useEffect } from "react";
import "@/components/editor/editor.module.css"
const Editor = ()=>{
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [data, setData] = useState("");

  useEffect(() => {
    setEditorLoaded(true);
  }, []);


  return(
    <div className="container py-5">
      <h1>建立文章</h1>
      <Myeditor
        name="description"
        onChange={(data) => {
          setData(data);
        }}
        editorLoaded={editorLoaded}
      />
      <br/>
      <Link href="/">回首頁</Link>
    </div>
  );
};

export default Editor;