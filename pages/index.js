import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar/navbar";
import Dashboard from "../components/Dashboard/dashboard";
import Sidebar from "../components/sidebar/Sidebar";
import Edit from "../components/Edit/Edit";
import { useRouter } from "next/router";

function Index() {
  const router = useRouter();

  console.log("router", router.pathname);
  return (
    <>
      <BrowserRouter>
        {/* <Dashboard /> */}
        <Routes>
          <Route exact path="/" element={<Dashboard />} />
          <Route exact path="/sidebar" element={<Sidebar />} />
          <Route exact path="/edit" element={<Edit />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default Index;
