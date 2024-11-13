import Head from "next/head";
import Link from "next/link";
import Myeditor from "@/components/editor/Myeditor";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import "@/components/editor/editor.module.css"

const Editor = () => {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [data, setData] = useState("");
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // 新增送出狀態
  const router = useRouter();

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  // 儲存文章到資料庫
  const handlePublish = async () => {
    // 防止重複送出
    if (isSubmitting) return;

    try {
      // 基本驗證
      if (!title.trim()) {
        alert("請輸入文章標題");
        return;
      }
      if (!data.trim()) {
        alert("請輸入文章內容");
        return;
      }

      setIsSubmitting(true); // 開始送出

      const response = await fetch('http://localhost:3005//api/forumpublish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: data.trim(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("文章發布成功！");
        router.push('/forum');
      } else {
        throw new Error(result.message || '發布失敗');
      }
    } catch (error) {
      console.error("文章發布失敗:", error);
      alert(error.message || "發布時發生錯誤，請稍後再試");
    } finally {
      setIsSubmitting(false); // 結束送出狀態
    }
  };

  return (
    <>
      <Head>
        <title>發表新文章 | 論壇</title>
      </Head>
      
      <div className="container py-5">
        <h1 className="mb-4">發表新文章</h1>
        
        {/* 標題輸入 */}
        <div className="mb-3">
          <label htmlFor="articleTitle" className="form-label">文章標題</label>
          <input
            type="text"
            className="form-control"
            id="articleTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="請輸入標題..."
            maxLength={100} // 加入長度限制
          />
        </div>

        {/* 編輯器 */}
        <div className="mb-3">
          <label className="form-label">文章內容</label>
          <Myeditor
            name="content"
            onChange={(data) => setData(data)}
            editorLoaded={editorLoaded}
            value={data}
          />
        </div>

        {/* 按鈕區 */}
        <div className="d-flex gap-3 mt-4">
          <button 
            className="btn btn-primary"
            onClick={handlePublish}
            disabled={isSubmitting} // 送出時禁用按鈕
          >
            {isSubmitting ? '發布中...' : '發布文章'}
          </button>
          <Link 
            href="/forum" 
            className={`btn btn-outline-secondary ${isSubmitting ? 'disabled' : ''}`}
            onClick={(e) => isSubmitting && e.preventDefault()} // 送出時禁止返回
          >
            返回文章列表
          </Link>
        </div>
      </div>
    </>
  );
};

export default Editor;