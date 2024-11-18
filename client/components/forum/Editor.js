import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import PropTypes from 'prop-types'

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div>載入中...</div>
})

const QuillEditor = ({ value, onChange, readOnly }) => {
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: { image: imageHandler }
    }
  }), [])

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

  return (
    <div className="quill-editor">
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={[
          'header',
          'bold', 'italic', 'underline',
          'list', 'bullet',
          'align',
          'link', 'image'
        ]}
        readOnly={readOnly}
        className="editor-inner"
      />
      <style jsx global>{`
        .quill-editor {
          display: flex;
          flex-direction: column;
          min-height: 500px;
          width: 100%;
          background: white;
        }

        .quill-editor .ql-toolbar {
          border: 1px solid #ccc;
          border-bottom: none;
          border-radius: 4px 4px 0 0;
          background: #f8f9fa;
        }

        .quill-editor .ql-container {
          flex-grow: 1;
          min-height: 450px;
          border: 1px solid #ccc;
          border-radius: 0 0 4px 4px;
          font-size: 16px;
        }

        .quill-editor .ql-editor {
          min-height: 450px;
        }
      `}</style>
    </div>
  )
}

QuillEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool
}

export default QuillEditor