import React from "react";
import dynamic from "next/dynamic";
const CustomEditor = dynamic(() => import("@/pages/forum/Editor.js"), {
    ssr: false,
  });
  
function newAritcle() {
  return <>CustomEditor</>;
}
