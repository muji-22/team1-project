import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

function forumPage() {
  return (
    <>
      <div className="main container">
        <h1 className="title">熱門文章</h1>
        <div className="searchbar">
          <input type="text" />
        </div>
        <div className="article-container container text-center">
          <div className="article-row d-flex row">
            <div className="article-card col"><Link href="/forum/newArticle">1</Link></div>
            <div className="article-card col">2</div>
            <div className="article-card col">3</div>
          </div>
          <div className="article-row d-flex row">
            <div className="article-card col">4</div>
            <div className="article-card col">5</div>
            <div className="article-card col">6</div>
          </div>
          <div className="article-row d-flex row">
            <div className="article-card col">7</div>
            <div className="article-card col">8</div>
            <div className="article-card col">9</div>
          </div>
        </div>
        <div className="page container d-flex">
          <div className="btn">1</div>
          <div className="btn">2</div>
          <div className="btn">3</div>
          <div className="btn">4</div>
          <div className="btn">5</div>
        </div>
        <div className="video-container container d-flex">
          <div className="video-card ">v1</div>
          <div className="video-card">v2</div>
          <div className="video-card">v3</div>
        </div>
      </div>
    </>
  );
}

export default forumPage;
