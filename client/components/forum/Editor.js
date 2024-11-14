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
  editorState: initialContent,
  onEditorStateChange,
  placeholder = '請輸入內容...',
  height = '300px'
}) => {
  const [mounted, setMounted] = useState(false)
  const [content, setContent] = useState('')

  useEffect(() => {
    setMounted(true)
    if (initialContent) {
      setContent(initialContent)
    }
  }, [initialContent])

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ]
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'align',
    'link'
  ]

  if (!mounted) return null

  return (
    <div className="editor-wrapper">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={(value) => {
          setContent(value)
          onEditorStateChange?.(value)
        }}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height }}
      />
      <style jsx global>{`
        .editor-wrapper {
          background: white;
          border-radius: 4px;
          overflow: hidden;
        }
        .editor-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: ${height};
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
        }
        .ql-toolbar {
          border-top: 1px solid #dee2e6 !important;
          border-left: 1px solid #dee2e6 !important;
          border-right: 1px solid #dee2e6 !important;
          border-bottom: none !important;
          border-radius: 4px 4px 0 0;
          background: #f8f9fa;
        }
        .ql-container {
          border: 1px solid #dee2e6 !important;
          border-radius: 0 0 4px 4px;
          min-height: ${height};
          font-size: 16px;
        }
        .ql-editor {
          min-height: ${height};
          max-height: 500px;
          overflow-y: auto;
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