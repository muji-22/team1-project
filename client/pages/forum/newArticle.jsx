import Head from "next/head";
import Link from "next/link";
import Myeditor from "@/components/editor/Myeditor";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "@/components/editor/editor.module.css";

const Editor = () => {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [data, setData] = useState("");
  const [title, setTitle] = useState("");
  // const [author, setAuthor] = useState(""); // 等待整合會員系統
  const router = useRouter();

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  // 儲存文章到資料庫
  const saveArticle = async () => {
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

      const response = await fetch("/api/forumarticle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          // author: author.trim(), // 等待整合會員系統
          content: data.trim(),
          created_at: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("文章發布成功！");
        router.push("/forum");
      } else {
        alert(`發布失敗: ${result.message}`);
      }
    } catch (error) {
      console.error("文章發布失敗:", error);
      alert("發布時發生錯誤，請稍後再試");
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
          <label htmlFor="articleTitle" className="form-label">
            文章標題
          </label>
          <input
            type="text"
            className="form-control"
            id="articleTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="請輸入標題..."
          />
        </div>

        {/* 作者資訊 - 等待會員系統整合 */}
        <div className="mb-3">
          <p className="text-muted">作者: {/* 等待會員系統整合 */}</p>
        </div>

        {/* 編輯器 */}
        <div className="mb-3">
          <label className="form-label">文章內容</label>
          <Myeditor
            name="content"
            onChange={(data) => setData(data)}
            editorLoaded={editorLoaded}
          />
        </div>

        {/* 按鈕區 */}
        <div className="d-flex gap-3 mt-4">
          <button className="btn btn-primary" onClick={saveArticle}>
            發布文章
          </button>
          <Link href="/forum" className="btn btn-outline-secondary">
            返回文章列表
          </Link>
        </div>
      </div>
    </>
  );
};

export default Editor;
