// components/forum/Editor.js
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import PropTypes from 'prop-types'

const ReactQuill = dynamic(
  () => import('react-quill'),
  {
    ssr: false,
    loading: () => (
      <div className="editor-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">載入編輯器中...</span>
        </div>
      </div>
    )
  }
)

const QuillEditor = ({
  editorState,
  onEditorStateChange,
  placeholder = '請輸入內容...',
  height = '300px'
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 圖片上傳處理函數
  function imageHandler() {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    const quill = this.quill

    input.onchange = async () => {
      const file = input.files[0]
      if (file) {
        try {
          const formData = new FormData()
          formData.append('image', file)

          const token = localStorage.getItem('token')
          const response = await fetch('http://localhost:3005/api/upload/forum-image', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          })

          const data = await response.json()

          if (response.ok) {
            const imageUrl = `http://localhost:3005${data.data.url}`
            const range = quill.getSelection()
            
            if (range) {
              quill.insertEmbed(range.index, 'image', imageUrl)
              quill.setSelection(range.index + 1)
            } else {
              quill.insertEmbed(quill.getLength(), 'image', imageUrl)
              quill.setSelection(quill.getLength() + 1)
            }
          } else {
            throw new Error(data.message || '圖片上傳失敗')
          }
        } catch (error) {
          console.error('圖片上傳錯誤:', error)
          alert('圖片上傳失敗: ' + error.message)
        }
      }
    }
  }

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'align',
    'link', 'image'
  ]

  if (!mounted) return null

  return (
    <div className="editor-wrapper">
      <ReactQuill
        theme="snow"
        value={editorState}
        onChange={onEditorStateChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height }}
      />
      <style jsx global>{`
  .editor-wrapper {
    background: white;
    border-radius: 4px;
    height: ${height}; /* 固定整體高度 */
    display: flex;
    flex-direction: column;
  }

  .ql-toolbar {
    border-top: 1px solid #dee2e6 !important;
    border-left: 1px solid #dee2e6 !important;
    border-right: 1px solid #dee2e6 !important;
    border-bottom: none !important;
    border-radius: 4px 4px 0 0;
    background: #f8f9fa;
    position: sticky !important;
    top: 0 !important;
    z-index: 1000 !important;
    flex-shrink: 0; /* 防止工具列縮小 */
  }

  .ql-container {
    border: 1px solid #dee2e6 !important;
    border-radius: 0 0 4px 4px;
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 0 !important; /* 讓容器自適應剩餘空間 */
  }

  .ql-editor {
    height: 100% !important; /* 填滿容器 */
    max-height: 100% !important;
    overflow-y: auto !important; /* 允許垂直捲動 */
  }
`}</style>
    </div>
  )
}

QuillEditor.propTypes = {
  editorState: PropTypes.string,
  onEditorStateChange: PropTypes.func,
  placeholder: PropTypes.string,
  height: PropTypes.string
}

export default QuillEditor