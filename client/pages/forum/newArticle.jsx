import Head from "next/head";
import Link from "next/link";
import Myeditor from "@/components/editor/Myeditor";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
// import { Alert } from '@/components/ui/alert';
// import { AlertCircle } from 'lucide-react';
import "@/components/editor/editor.module.css";

const Editor = () => {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [data, setData] = useState("");
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  const validateData = () => {
    if (!title.trim()) {
      throw new Error("請輸入文章標題");
    }
    if (title.length > 35) {
      throw new Error("標題不能超過35個字元");
    }
    if (!data.trim()) {
      throw new Error("請輸入文章內容");
    }
    if (data.length > 50000) {
      // 假設內容限制為50000字
      throw new Error("文章內容過長");
    }
  };

  // 前端發送請求的代碼
const handlePublish = async () => {
  try {
    // 驗證數據
    if (!title.trim() || !data.trim()) {
      throw new Error('標題和內容不能為空');
    }

    const response = await fetch("http://localhost:3005/api/forumpublish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({  // 記得使用 JSON.stringify
        title: title.trim(),  // 使用正確的變量名
        content: data.trim(), // 使用正確的變量名
      }),
      credentials: "include",
    });

    // 檢查響應狀態
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '發布失敗');
    }

    const result = await response.json();
    
    // 成功處理
    alert('文章發布成功！');
    router.push('/forum');

  } catch (error) {
    console.error('發布錯誤:', error);
    alert(error.message || '發布失敗，請稍後重試');
  }
};

  return (
    <>
      <Head>
        <title>發表新文章 | 論壇</title>
      </Head>

      <div className="container py-5">
        <h1 className="mb-4">發表新文章</h1>

        <div className="mb-3">
          <label htmlFor="articleTitle" className="form-label">
            文章標題{" "}
            <span className="text-sm text-gray-500">({title.length}/35)</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="articleTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="請輸入標題..."
            maxLength={100}
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            文章內容{" "}
            <span className="text-sm text-gray-500">({data.length}/50000)</span>
          </label>
          <Myeditor
            name="content"
            onChange={(data) => setData(data)}
            editorLoaded={editorLoaded}
            value={data}
            disabled={isSubmitting}
          />
        </div>

        <div className="d-flex gap-3 mt-4">
          <button
            className="btn btn-primary"
            onClick={handlePublish}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="loading loading-spinner"></span>
                發布中...
              </span>
            ) : (
              "發布文章"
            )}
          </button>
          <Link
            href="/forum"
            className={`btn btn-outline-secondary ${
              isSubmitting ? "disabled" : ""
            }`}
            onClick={(e) => isSubmitting && e.preventDefault()}
          >
            返回文章列表
          </Link>
        </div>
      </div>
    </>
  );
};

export default Editor;
