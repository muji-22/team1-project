// components/forum/Editor.js
import React, { useState, useEffect, useCallback } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { toast } from 'react-toastify'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const DraftEditor = ({ 
  editorState, 
  onEditorStateChange, 
  placeholder = '請輸入內容...',
  height = '300px'
}) => {
  // 初始化編輯器狀態
  const [editorStateInternal, setEditorStateInternal] = useState(() => {
    if (typeof editorState === 'string') {
      // 如果是 HTML 字串，轉換成 EditorState
      const contentBlock = htmlToDraft(editorState)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        )
        return EditorState.createWithContent(contentState)
      }
    }
    return EditorState.createEmpty()
  })

  // 當編輯器內容變更時
  const handleEditorStateChange = useCallback((state) => {
    setEditorStateInternal(state)
    // 轉換成 HTML 並傳給父組件
    const html = draftToHtml(convertToRaw(state.getCurrentContent()))
    onEditorStateChange(html)
  }, [onEditorStateChange])

  // 當傳入的 editorState 變更時
  useEffect(() => {
    if (typeof editorState === 'string' && editorState !== draftToHtml(convertToRaw(editorStateInternal.getCurrentContent()))) {
      const contentBlock = htmlToDraft(editorState)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        )
        setEditorStateInternal(EditorState.createWithContent(contentState))
      }
    }
  }, [editorState])

  // 工具列設定
  const toolbarOptions = {
    options: ['inline', 'blockType', 'list', 'link', 'emoji', 'image', 'history'],
    inline: {
      options: ['bold', 'italic', 'underline', 'strikethrough'],
      bold: { className: 'bordered-option-classname' },
      italic: { className: 'bordered-option-classname' },
      underline: { className: 'bordered-option-classname' },
      strikethrough: { className: 'bordered-option-classname' },
    },
    blockType: {
      className: 'bordered-option-classname',
    },
    list: {
      options: ['unordered', 'ordered'],
    },
    link: {
      showOpenOptionOnHover: true,
      defaultTargetOption: '_blank',
    },
    emoji: {
      className: 'bordered-option-classname',
    },
    image: {
      alignmentEnabled: true,
      uploadEnabled: true,
      uploadCallback: async (file) => {
        try {
          const formData = new FormData()
          formData.append('image', file)

          const token = localStorage.getItem('token')
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/forum-image`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          })

          if (!response.ok) {
            throw new Error('圖片上傳失敗')
          }

          const data = await response.json()
          return {
            data: {
              link: `${process.env.NEXT_PUBLIC_API_URL}${data.data.url}`
            }
          }
        } catch (error) {
          console.error('圖片上傳失敗:', error)
          toast.error('圖片上傳失敗')
          return { data: { link: null } }
        }
      },
      previewImage: true,
      inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/webp',
      alt: { present: true, mandatory: false },
    },
    history: {
      undo: { className: 'bordered-option-classname' },
      redo: { className: 'bordered-option-classname' },
    },
  }

  return (
    <div className="border rounded">
      <Editor
        editorState={editorStateInternal}
        onEditorStateChange={handleEditorStateChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        toolbar={toolbarOptions}
        placeholder={placeholder}
        editorStyle={{
          height,
          padding: '0 15px',
          overflowY: 'auto'
        }}
        localization={{
          locale: 'zh_TW',
          translations: {
            'generic.add': '新增',
            'generic.remove': '移除',
            'components.controls.blocktype.normal': '一般',
            'components.controls.blocktype.h1': '標題 1',
            'components.controls.blocktype.h2': '標題 2',
            'components.controls.blocktype.h3': '標題 3',
            'components.controls.blocktype.h4': '標題 4',
            'components.controls.blocktype.h5': '標題 5',
            'components.controls.blocktype.h6': '標題 6',
            'components.controls.blocktype.blockquote': '引用',
            'components.controls.blocktype.code': '程式碼',
            'components.controls.image.fileUpload': '上傳圖片',
            'components.controls.image.byURL': '圖片網址',
            'components.controls.image.dropFileText': '拖曳圖片或點擊上傳',
            'components.controls.link.linkTitle': '連結標題',
            'components.controls.link.linkTarget': '連結目標',
            'components.controls.link.linkTargetOption': '在新視窗開啟',
          }
        }}
      />
      <style jsx global>{`
        .wrapper-class {
          min-height: ${height};
        }
        .editor-class {
          font-size: 16px;
          line-height: 1.5;
          min-height: calc(${height} - 100px);
        }
        .toolbar-class {
          border-bottom: 1px solid #E0E0E0;
          background: #f8f9fa;
        }
        .public-DraftStyleDefault-block {
          margin: 0.5em 0;
        }
        .bordered-option-classname {
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        .rdw-option-wrapper {
          border: none;
          padding: 5px;
          min-width: 25px;
          height: 25px;
          border-radius: 4px;
          margin: 0 4px;
          transition: all 0.2s ease;
        }
        .rdw-option-wrapper:hover {
          box-shadow: none;
          background: #e9ecef;
        }
        .rdw-option-active {
          box-shadow: none;
          background: #dee2e6;
        }
        .rdw-dropdown-wrapper {
          border: 1px solid #dee2e6;
          border-radius: 4px;
        }
        .rdw-dropdown-wrapper:hover {
          box-shadow: none;
          background: #f8f9fa;
        }
        .rdw-dropdown-optionwrapper {
          border: 1px solid #dee2e6;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .rdw-link-modal {
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .rdw-image-modal {
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .rdw-emoji-modal {
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .rdw-embedded-modal {
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .public-DraftEditorPlaceholder-root {
          color: #6c757d;
        }
        .public-DraftEditor-content {
          img {
            max-width: 100%;
            height: auto;
            margin: 0.5em 0;
          }
          blockquote {
            border-left: 5px solid #e9ecef;
            margin: 0;
            padding-left: 1em;
            color: #6c757d;
          }
        }
      `}</style>
    </div>
  )
}

export default DraftEditor