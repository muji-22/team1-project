// components/forum/Editor.js
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import 'draft-js/dist/Draft.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState, ContentState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { toast } from 'react-toastify'

// 動態引入編輯器組件
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
)

const DraftEditor = ({ 
  editorState: initialContent, 
  onEditorStateChange,
  placeholder = '請輸入內容...',
  height = '300px'
}) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  // 初始化編輯器內容
  useEffect(() => {
    if (typeof initialContent === 'string' && initialContent) {
      const contentBlock = htmlToDraft(initialContent)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        setEditorState(EditorState.createWithContent(contentState))
      }
    }
  }, [initialContent])

  // 處理編輯器內容變化
  const handleEditorStateChange = (newState) => {
    setEditorState(newState)
    if (onEditorStateChange) {
      const html = draftToHtml(convertToRaw(newState.getCurrentContent()))
      onEditorStateChange(html)
    }
  }

  return (
    <div className="editor-wrapper">
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        placeholder={placeholder}
        toolbar={{
          options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'emoji', 'image', 'history'],
          inline: {
            options: ['bold', 'italic', 'underline', 'strikethrough'],
          },
          blockType: {
            inDropdown: true,
            options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote'],
          },
          list: {
            inDropdown: true,
            options: ['unordered', 'ordered'],
          },
          textAlign: {
            inDropdown: true,
            options: ['left', 'center', 'right', 'justify'],
          },
          link: {
            inDropdown: false,
            showOpenOptionOnHover: true,
            defaultTargetOption: '_blank',
            options: ['link', 'unlink'],
          },
          emoji: {
            inDropdown: true,
          },
          image: {
            uploadCallback: async (file) => {
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

                if (!response.ok) throw new Error('圖片上傳失敗')
                
                const data = await response.json()
                return { data: { link: `http://localhost:3005${data.data.url}` } }
              } catch (error) {
                console.error('圖片上傳失敗:', error)
                toast.error('圖片上傳失敗')
                return { data: { link: null } }
              }
            },
            previewImage: true,
            inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
            alt: { present: true, mandatory: false },
          },
        }}
        localization={{
          locale: 'zh',
        }}
      />
      <style jsx global>{`
        .editor-wrapper {
          width: 100%;
        }
        .wrapper-class {
          padding: 1rem;
          border: 1px solid #ccc;
        }
        .editor-class {
          background-color: #fff;
          padding: 1rem;
          min-height: ${height};
        }
        .toolbar-class {
          border: 1px solid #ccc !important;
          margin-bottom: 0 !important;
        }
        .rdw-option-wrapper {
          border: 1px solid #F1F1F1;
          padding: 5px;
          min-width: 25px;
          height: 20px;
          border-radius: 2px;
          margin: 0 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          background: white;
          text-transform: capitalize;
        }
        .rdw-dropdown-wrapper {
          height: 30px;
          background: white;
          cursor: pointer;
          border: 1px solid #F1F1F1;
          border-radius: 2px;
          margin: 0 3px;
          text-transform: capitalize;
          background: white;
        }
        .rdw-dropdown-wrapper:hover {
          box-shadow: 1px 1px 0px #BFBDBD;
        }
        .rdw-dropdown-optionwrapper {
          z-index: 100;
          position: relative;
          border: 1px solid #F1F1F1;
          width: 98%;
          background: white;
          border-radius: 2px;
          margin: 0;
          padding: 0;
          max-height: 250px;
          overflow-y: scroll;
        }
      `}</style>
    </div>
  )
}

export default DraftEditor