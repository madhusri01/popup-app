import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Deletebutton from "./deletebutton";
import "./dashboard.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Tooltip from "@material-ui/core/Tooltip";

function Dashboard() {
  const [APIData, setAPIData] = useState([]);
  const [disable, setDisable] = useState();

  const handleApiData = async () => {
    // const data = fetch("http://localhost:3000/api/1")
    //   .then((res) => res.json())
    //   .then((jsonRes) => console.log("dbData", jsonRes))
    //   .catch((err) => console.log("dberr", err));

    try {
      const data = await window.api.get(`/1?shop=${window.shop}`);
      console.log("Dashboard Data", data.data);
      if (data.data.length > 0) {
        setDisable(true);
      } else {
        setDisable(false);
      }
      setAPIData(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  console.log("APIData", APIData);

  const getData = () => {
    window.api.get(`/1?shop=${window.shop}`).then((getData) => {
      setAPIData(getData.data);
      console.log("yyyy", getData);
    });
  };

  const onDelete = async (id) => {
    await window.api
      .delete(`/1?id=${id}&shop=${window.shop}`)
      .then(() => {
        getData();
      })
      .catch((err) => console.log(err));
    setDisable(false);
  };

  useEffect(() => {
    handleApiData();
  }, []);

  return (
    <>
      <div className="row">
        <section class="hero-banner">
          <div class="container hero-content">
            <div class="row">
              <div
                class="col-md-6  col-lg-8 baner-text"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <h1>Create Your Website Popup</h1>
                <h2>
                  Easily create and publish popups on your website to boost
                  conversion rate, create urgency, and increase sales.
                </h2>
                <div>
                  {" "}
                  <Link to="/sidebar">
                    <Tooltip
                      title={
                        disable
                          ? "Delete existing template to create new one"
                          : ""
                      }
                    >
                      <button className="pop-btn" disabled={disable}>
                        Create Your Popup Now
                      </button>
                    </Tooltip>
                  </Link>
                </div>
                {/* <div class="d-flex flex-wrap justify-content-center justify-content-lg-start">
                </div> */}
              </div>
              <div
                class="col-md-6 col-lg-4 baner-img-right"
                data-aos="zoom-in"
                data-aos-delay="200"
              >
                <img
                  src="https://easymanage.arokee.com/shipment-bar/assets/img/hero-vector.svg"
                  class="img-fluid animated"
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* <div className="row">
          <div className="col-12 after-banner-text">
             <h2>Heading</h2>
          </div>
      </div> */}
      <div className="">
        <div className="row table1">
          <div className="col-md-12">
            <table class="table table-striped">
              <thead className="t-head" id="table-edit">
                <tr>
                  <th>Popup Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="t-boday-center">
                {APIData.map((data) => {
                  return (
                    <tr>
                      <td>{data.title}</td>
                      <td>
                        {" "}
                        <div className="td-actions">
                          <Link to="/edit">
                            <button type="button" class="btn btn-primary">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-pencil-square"
                                viewBox="0 0 16 16"
                              >
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path
                                  fill-rule="evenodd"
                                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                                />
                              </svg>
                            </button>
                          </Link>
                          <button
                            type="button"
                            class="btn btn-danger"
                            onClick={() => onDelete(data._id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-trash"
                              viewBox="0 0 16 16"
                            >
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                              <path
                                fill-rule="evenodd"
                                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* <thead class="lightt table-heading">
          <tr>
            <th className="wt-name">Template Name</th>
            <th>Actions</th>
          </tr>
          </thead>
          </div> */}

            {/*         
        <div className="row">
          <div className="col-md-12 table-content ">
            {APIData.map((data) => {
              return (
                <div className="">
                <div className="table-content1">
                <ul className="table-list">
                  <li  className="table-name">{data.title}</li>
                  <li className="table-action">
                    <div className="td-actions">
                      <Link to="/edit">
                        <button type="button" class="btn btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                      </svg>
                        </button>
                      </Link>
                      <button
                        type="button"
                        class="btn btn-danger"
                        onClick={() => onDelete(data._id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                      </button>
                    </div>
                  </li>
                </ul>
                </div>
              </div>
              );
            })}
          </div>*/}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
