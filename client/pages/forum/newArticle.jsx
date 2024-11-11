import Head from "next/head";
// import styles from "@/styles/Articles.module.sass";
import Link from "next/link";
import Myeditor from "@/components/editor/Myeditor";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import "@/components/editor/editor.module.css"
const Publish = () => {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [data, setData] = useState("");
  const [title, setTitle] = useState("");
  // const [author, setAuthor] = useState("");  rember to reintergret it !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const router = useRouter();

  const saveToDb = async () => {
    try {
      const response = await fetch('/api/article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          // author,
          article: data,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("資料寫入成功");
        router.push('/article');
      } else {
        alert(`寫入失敗: ${result.message}`);
      }
    } catch (error) {
      console.error("寫入文章失敗", error);
      alert("寫入發生錯誤，稍後再試。");
    }
  };

  useEffect(() => {
    setEditorLoaded(true);
  }, []);}


const testAlert =()=>{
  console.log("Alert!Test!");
}
const Editor = ()=>{
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [data, setData] = useState("");

  useEffect(() => {
    setEditorLoaded(true);
  }, []);


  return(
    <div className="container py-5">
      <h1>發表新文章</h1>
      <Myeditor
        name="description"
        onChange={(data) => {
          setData(data);
        }}
        editorLoaded={editorLoaded}
      />
      <br/>
      <div className="btn" onClick={Publish}>發布文章</div>
      <Link href="/forum">回文章首頁</Link>
    </div>
  );
};

export default Editor;