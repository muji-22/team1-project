// pages/auth/user.js
import React from "react";
import Head from "next/head";
import UserFrom from "@/components/users/userFrom";



export default function Index() {
  return (
    <>
      <Head>
        <title>會員中心 | Pertho</title>
      </Head>
      <UserFrom />
    </>
  );
}
