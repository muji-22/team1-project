import React from "react";

// app/page.js (App Router)
// pages/index.js (Pages Router)

import dynamic from 'next/dynamic';

const CustomEditor = dynamic( () => import( '@/pages/forum/Editor.js' ), { ssr: false } );

function forumPage() {
  return (
    <CustomEditor />
  );
}


export default forumPage