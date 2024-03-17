import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Tabs, Tab, Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import InputColor from "react-input-color";
import axios from "axios";
import { IKContext, IKImage, IKUpload } from "imagekitio-react";
import { Link, useNavigate } from "react-router-dom";
import "./edit.css";

const urlEndpoint = "https://ik.imagekit.io/arokee123";
const publicKey = "public_l3XCrmtwvPynDFWM7UQtkjp7Mkk=";
const authenticationEndpoint = "https://popup-build.herokuapp.com/imagekitauth";

const checkboxData = [
  {
    id: 1,
    name: "Home Page",
    value: "index",
    isChecked: false,
  },
  {
    id: 2,
    name: "Collection Page",
    value: "collection",
    isChecked: false,
  },
  {
    id: 3,
    name: "Product Page",
    value: "product",
    isChecked: false,
  },
  {
    id: 4,
    name: "Cart Page",
    value: "cart",
    isChecked: false,
  },
];

function Edit() {
  const navigate = useNavigate();

  const [height, setHeight] = useState("290px");
  const [width, setWidth] = useState("280px");
  const [bgImage, setBgImage] = useState("");
  const [bgImageSize, setBgImageSize] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [bgInitial, setBgInitial] = useState("#ffffff");

  const [title, setTitle] = useState("");
  const [titleColor, setTitleColor] = useState("#5e72e4");
  //const [initialTitleColor, setInitialTitleColor] = useState("#5e72e4");
  const [titleSize, setTitleSize] = useState("");
  const [titleWeight, setTitleWeight] = useState("");

  const [image, setImage] = useState("");
  const [imageHeight, setImageHeight] = useState("");
  const [imageWidth, setImageWidth] = useState("");

  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [initialMessageColor, setInitialMessageColor] = useState("#5e72e4");
  const [messageSize, setMessageSize] = useState("");
  const [messageWeight, setMessageWeight] = useState("");
  const [classId, setClassId] = useState("");
  const [disable, setDisable] = useState(false);
  const [checkboxInfo, setCheckboxInfo] = useState(checkboxData);
  const [template, setTemplate] = useState("");
  const [value, setValue] = useState("");
  const [sample, setSample] = useState({});
  const [typeText, setTypeText] = useState(". or #");
  const [userSelector, setUserSelector] = useState("Classname or Id");
  const [styleDisplay, setStyleDisplay] = useState("none");
  const [styleDisplay1, setStyleDisplay1] = useState("none");
  const [selectAllCheckbox, setSelectAllCheckbox] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [radioCheck, setRadioCheck] = useState(false);
  const [radioCheck1, setRadioCheck1] = useState(false);
  const [radioCheck2, setRadioCheck2] = useState(false);
  const [imageFilename, setImageFilename] = useState("");
  const [bgImageFilename, setBgImageFilename] = useState("");

  const [chooseBgFile, setChooseBgFile] = useState("Choose File");
  const [bgImageFileColor, setBgImageFileColor] = useState("#23395d");
  const [chooseImageFile, setChooseImageFile] = useState("Choose File");
  const [imageFileColor, setImageFileColor] = useState("#23395d");

  const onError = (err) => {
    console.log("Error", err);
  };
  const onBgError = (err) => {
    console.log("Error", err);
  };

  const onSuccess = (res) => {
    console.log("Success", res);
    const fileImagePath = res.filePath;
    // console.log("filePath", fileImagePath);
    setImage(fileImagePath);
    setChooseImageFile("Image Selected");
    setImageFileColor("green");
  };
  //console.log("IMAGE", image);

  const onBgImageSuccess = (res) => {
    console.log("Success", res);
    const fileBgImagePath = res.filePath;
    //console.log("fileBgImagePath", fileBgImagePath);
    setBgImage(fileBgImagePath);
    setChooseBgFile("Image Selected");
    setBgImageFileColor("green");
  };

  const handleChange = (e) => {
    setRadioCheck(false);
    setRadioCheck1(false);
    setRadioCheck2(false);
    setStyleDisplay("none");
    setStyleDisplay1("none");
    const { value, name, checked } = e.target;

    // console.log(`${value} is ${checked}`);

    let newcheckboxData = checkboxInfo.map((item) =>
      item.name === name ? { ...item, isChecked: checked } : item
    );

    if (newcheckboxData.find((item) => item.isChecked === true)) {
      setValue("checkboxpageedit");
    }

    if (
      (name === "allpages" && checked) ||
      !newcheckboxData.some((item) => item?.isChecked !== true)
    ) {
      setSelectAllCheckbox(true);
      setValue("checkboxpageedit");
      newcheckboxData = checkboxInfo.map((item) => {
        return { ...item, isChecked: false };
      });
      setCheckboxInfo(newcheckboxData);
    } else {
      setSelectAllCheckbox(false);

      setCheckboxInfo(newcheckboxData);
    }

    const checkedBoxData = newcheckboxData.filter((i) => i.isChecked);
    let data = [];
    if (
      (name === "allpages" && checked) ||
      !newcheckboxData.some((item) => item?.isChecked !== true)
    ) {
      data = newcheckboxData
        .map((i) => i.value && `template == '${i.value}'`)
        .join(" or ");
    } else {
      for (let i = 0; i < checkedBoxData.length; i++) {
        if (i === 0 && checkedBoxData[i].isChecked) {
          data.push(`template == '${checkedBoxData[i].value}'`);
        } else if (
          i > 0 &&
          i + 1 <= newcheckboxData.length &&
          checkedBoxData[i].isChecked
        ) {
          data.push(`or template =='${checkedBoxData[i].value}'`);
        }
      }
      data = data.join("");
    }
    const assignTemplate = `${data}`;
    setTemplate(assignTemplate);
  };

  console.log("value111", value);
  console.log("newTemplate", template);

  let newcheckboxData123 = checkboxInfo.map((item) =>
    item.isChecked === true ? { ...item, isChecked: false } : item
  );

  console.log("newcheckboxData123", newcheckboxData123);

  const handleRadioCheckboxChange = (e) => {
    setValue(e.target.value);
  };

  const handleClassOrId = (e) => {
    setTypeText(e.target.value);
    setUserSelector(e.target.id);
  };

  const handleHeight = (e) => {
    setHeight(e.target.value);
  };

  const handleWidth = (e) => {
    setWidth(e.target.value);
  };
  const handleBgImage = (e) => {
    const reader = new FileReader();

    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = function () {
      setBgImage(reader.result);
    };
  };
  const handleBgImageDelete = () => {
    setBgImage("");
    //setBgImageFilename("");
    setChooseBgFile("Choose File");
    setBgImageFileColor("#23395d");
  };

  const handleBgImageSize = (e) => {
    setBgImageSize(e.target.value);
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  // const handleTitleColor = (e) => {
  //   console.log("e.target", e.target.hex);
  // };
  console.log("hvvuyhb", titleColor);

  const handleTitleSize = (e) => {
    setTitleSize(e.target.value);
  };
  const handleTitleWeight = (e) => {
    setTitleWeight(e.target.value);
  };

  const handleImage = (e) => {
    const reader = new FileReader();

    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = function () {
      setImage(reader.result);
    };
  };
  const handleImageDelete = () => {
    setImage("");
    //setImageFilename("");
    setChooseImageFile("Choose File");
    setImageFileColor("#23395d");
  };

  const handleImageHeight = (e) => {
    setImageHeight(e.target.value);
  };
  const handleImageWidth = (e) => {
    setImageWidth(e.target.value);
  };

  const heightWidth = {
    height: imageHeight,
    width: imageWidth,
  };

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };
  const handleMessageSize = (e) => {
    setMessageSize(e.target.value);
  };
  const handleMessageWeight = (e) => {
    setMessageWeight(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    setStyleDisplay("none");
    setStyleDisplay1("none");
    setRadioCheck(!radioCheck);
    setRadioCheck1(false);
    setRadioCheck2(false);
    setSelectAllCheckbox(false);
    setCheckboxInfo(newcheckboxData123);
    setValue(e.target.value);
  };

  const handleRadioboxChangeButton = (e) => {
    setRadioCheck1(!radioCheck1);
    setRadioCheck(false);
    setRadioCheck2(false);
    setStyleDisplay1("none");
    setSelectAllCheckbox(false);
    setCheckboxInfo(newcheckboxData123);
    setValue(e.target.value);

    if (e.target.value === "buttonpopupedit") {
      setStyleDisplay("block");
    } else {
      setStyleDisplay("none");
    }
  };

  const handleRadioboxChangeButtonOnce = (e) => {
    setRadioCheck2(!radioCheck2);
    setRadioCheck(false);
    setRadioCheck1(false);
    setStyleDisplay("none");
    setSelectAllCheckbox(false);
    setCheckboxInfo(newcheckboxData123);
    setValue(e.target.value);

    if (e.target.value === "popuponcebuttonedit") {
      setStyleDisplay1("block");
    } else {
      setStyleDisplay1("none");
    }
  };
  const handleClassId = (e) => {
    setClassId(e.target.value);
  };

  const handleClick = async () => {
    try {
      const data = await window.api.get(`/check12?shop=${window.shop}`);
      console.log("SHOP", data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleEditPopup = async () => {
    // const data = fetch("http://localhost:3000/api/1")
    //   .then((res) => res.json())
    //   .then((jsonRes) => console.log("dbData", jsonRes))
    //   .catch((err) => console.log("dberr", err));

    try {
      const data = await window.api.get(`/1?shop=${window.shop}`);
      console.log("ND", data.data);
      const newHeight = data.data[0].height;
      const newWidth = data.data[0].width;
      const newBgImage = data.data[0].bgImage;
      const newBgColor = data.data[0].bgColor;
      const newTitleColor = data.data[0].titleColor;
      const newTitleSize = data.data[0].titleSize;
      const newTitleWeight = data.data[0].titleWeight;
      const newMessageColor = data.data[0].messageColor;
      const newMessageSize = data.data[0].messageSize;
      const newMessageWeight = data.data[0].messageWeight;
      const newImageHeight = data.data[0].imageHeight;
      const newImageWidth = data.data[0].imageWidth;
      const newTitle = data.data[0].title;
      const newImage = data.data[0].image;
      const newMessage = data.data[0].message;

      setHeight(newHeight);
      setWidth(newWidth);
      setBgImage(newBgImage);
      setBgColor(newBgColor);
      setTitleColor(newTitleColor);
      setTitleSize(newTitleSize);
      setTitleWeight(newTitleWeight);
      setMessageColor(newMessageColor);
      setMessageSize(newMessageSize);
      setMessageWeight(newMessageWeight);
      setImageHeight(newImageHeight);
      setImageWidth(newImageWidth);
      setTitle(newTitle);
      setImage(newImage);
      setMessage(newMessage);
      //setDisplay(newDisplay);

      if (newImage === "") {
        setChooseImageFile("Choose File");
        setImageFileColor("#23395d");
      } else {
        setChooseImageFile("Image Selected");
        setImageFileColor("green");
      }

      if (newBgImage === "") {
        setChooseBgFile("Choose File");
        setBgImageFileColor("#23395d");
      } else {
        setChooseBgFile("Image Selected");
        setBgImageFileColor("green");
      }

      // const imagePath0 = newImage.split("/");
      // console.log("IMGbyslash", imagePath0[1]);
      // const imagePath1 = imagePath0[1].split("_");
      // console.log("IMGbyundrscr", imagePath1[0]);
      // const imagePath2 = imagePath0[1].split(".");
      // console.log("IMGbydot", imagePath2[1]);
      // const newImagePath = imagePath1[0].concat(".", imagePath2[1]);
      // console.log("newImagePath", newImagePath);

      // const bgImagePath0 = newBgImage.split("/");
      // const bgImagePath1 = bgImagePath0[1].split("_");
      // const bgImagePath2 = bgImagePath0[1].split(".");
      // const newBgImagePath = bgImagePath1[0].concat(".", bgImagePath2[1]);
      // console.log("newBgImagePath", newBgImagePath);

      // setImageFilename(newImagePath);
      // setBgImageFilename(newBgImagePath);
    } catch (e) {
      console.log(e);
    }

    alert(
      "Please choose display condition which is mandatory and then click on submit popup"
    );
  };

  console.log("H", imageHeight);

  useEffect(() => {
    handleClick();
    handleEditPopup();
  }, []);

  const clearData = () => {
    setHeight("300px");
    setWidth("300px");
    setBgImage("");
    setBgColor("");
    setTitleColor("");
    setTitleSize("");
    setTitleWeight("");
    setMessageColor("");
    setMessageSize("");
    setMessageWeight("");
    setImageHeight("");
    setImageWidth("");
    setTitle("");
    setImage("");
    setMessage("");
    //setDisplay("");
  };

  const handleSubmitPopup = (e) => {
    // if (checkStates.find((i) => i.checked !== true)) {
    //   alert("Add Display Condition");
    // }
    // const newStates = checkStates.find((i) => i.checked === true);
    // console.log("newStates", newStates.url);

    const popupData12 = {
      shop: window.shop,
      template: template,
      height: height,
      width: width,
      bgImage: bgImage,
      bgColor: bgColor,
      bgImageSize: bgImageSize,

      titleColor: titleColor,
      titleSize: titleSize,
      titleWeight: titleWeight,

      messageColor: messageColor,
      messageSize: messageSize,
      messageWeight: messageWeight,

      imageHeight: imageHeight,
      imageWidth: imageWidth,

      classId: classId,

      title: title,
      image: image,
      message: message,
    };

    e.preventDefault();
    console.log("popupData12", popupData12);

    const postRequest = window.api
      .post(`/${value}?shop=${window.shop}`, popupData12)
      .then(() => {
        clearData();
      })
      .catch((err) => console.log(err));
    //console.log("postRequest", postRequest);
    setDisable(true);

    //navigate("/", { replace: true });
  };

  const handleNavigate = () => {
    navigate("/", { replace: true });
  };
  return (
    <>
      <div className="create-popup-content">
        <div className="row pad-left-32 pad-right-32">
          <div className="header-content">
            <div className="heading">
              <h2>Create Popup Template</h2>
            </div>
            <div className="dashbord-btn">
              <button
                type="button"
                className="pop-btn2"
                data-bs-toggle="modal"
                data-bs-target="#myModal"
                onClick={handleNavigate}
              >
                Go To Dashboard
              </button>
            </div>
          </div>
          <div className="col-12 col-md-12 col-lg-6">
            <div className="">
              <div className="">
                <div className="sidebar1">
                  <Tabs
                    defaultActiveKey="templates"
                    id="uncontrolled-tab"
                    className="tab-nav"
                  >
                    <Tab
                      eventKey="templates"
                      title="IMAGE"
                      className="temp-tab pop-head-style"
                    >
                      <h3>Popup Styles</h3>
                      <div className="row row-margin">
                        <div className="col-12">
                          <ul className="w-h-c">
                            <li>
                              <div className="">
                                <label className="sub-heading" for="">
                                  PopUp Height:
                                </label>
                                <br />
                                <select
                                  className="sel-1"
                                  onChange={(e) => handleHeight(e)}
                                >
                                  <option>{height}</option>
                                  <option>320px</option>
                                  <option>480px</option>
                                  <option>560px</option>
                                  <option>620px</option>
                                  <option>720px</option>
                                </select>
                              </div>
                            </li>
                            <li>
                              <div className="">
                                <label className="sub-heading" for="">
                                  PopUp Width:
                                </label>
                                <br />
                                <select
                                  className="sel-1"
                                  onChange={(e) => handleWidth(e)}
                                >
                                  <option>{width}</option>
                                  <option>360px</option>
                                  <option>480px</option>
                                  <option>560px</option>
                                  <option>620px</option>
                                  <option>720px</option>
                                  <option>920px</option>
                                  <option>1080px</option>
                                </select>
                              </div>
                            </li>
                            <li>
                              <div className="">
                                <label className="sub-heading" for="myfile">
                                  PopUp Bg-color:
                                </label>
                                <br />
                                <div className="">
                                  <InputColor
                                    className="input-weight-height-img"
                                    initialValue={bgColor}
                                    onChange={(value) => setBgColor(value.hex)}
                                  />
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="row row-margin">
                        <div className="col-md-6  wt-50">
                          <label
                            className="sub-heading bg-img-lable"
                            htmlFor="select-bg-image"
                          >
                            Background-Image:
                          </label>
                          <br />
                          {/* <button className="img-btn">
                            <IKContext
                              publicKey={publicKey}
                              urlEndpoint={urlEndpoint}
                              authenticationEndpoint={authenticationEndpoint}
                            >
                              <IKUpload
                                //fileName="test-upload.png"
                                onError={onError}
                                onSuccess={onBgImageSuccess}
                                //onChange={onSuccess}
                              />
                            </IKContext>
                          </button>
                          <span>{bgImageFilename}</span> */}

                          <button className="img-btn">
                            <label
                              for="files"
                              className="image-uploade-btn"
                              style={{ backgroundColor: bgImageFileColor }}
                            >
                              {chooseBgFile}
                            </label>
                            <IKContext
                              publicKey={publicKey}
                              urlEndpoint={urlEndpoint}
                              authenticationEndpoint={authenticationEndpoint}
                            >
                              <IKUpload
                                id="files"
                                style={{ visibility: "hidden" }}
                                // fileName="test-upload.png"
                                onError={onBgError}
                                onSuccess={onBgImageSuccess}
                                //onChange={onSuccess}
                              />
                            </IKContext>
                          </button>

                          <button
                            onClick={handleBgImageDelete}
                            className="delete-btn"
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
                        <div className="col-md-6 wt-50">
                          <label
                            className="sub-heading choose-text"
                            htmlFor="select-bg-image"
                          >
                            Image:
                          </label>
                          <br />
                          {/* <button className="img-btn">
                            <IKContext
                              publicKey={publicKey}
                              urlEndpoint={urlEndpoint}
                              authenticationEndpoint={authenticationEndpoint}
                            >
                              <IKUpload
                                // fileName="test-upload.png"
                                onError={onError}
                                onSuccess={onSuccess}
                              />
                            </IKContext>
                          </button>
                          <span>{imageFilename}</span> */}

                          <button className="img-btn">
                            <label
                              for="files12"
                              className="image-uploade-btn"
                              style={{ backgroundColor: imageFileColor }}
                            >
                              {chooseImageFile}
                            </label>
                            <IKContext
                              publicKey={publicKey}
                              urlEndpoint={urlEndpoint}
                              authenticationEndpoint={authenticationEndpoint}
                            >
                              <IKUpload
                                id="files12"
                                style={{ visibility: "hidden" }}
                                // fileName="test-upload.png"
                                onError={onError}
                                onSuccess={onSuccess}
                                //onChange={onSuccess}
                              />
                            </IKContext>
                          </button>

                          <button
                            onClick={handleImageDelete}
                            className="delete-btn"
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
                      </div>

                      <div className="row row-margin">
                        <div className="col-12 col-md-6 add-image">
                          <div className=" ">
                            <label className="sub-heading" for="">
                              Add Image Height:
                            </label>
                            <br />
                            <input
                              className="inout-height-width"
                              type="number"
                              value={imageHeight}
                              onChange={handleImageHeight}
                            />
                          </div>
                        </div>
                        <div className=" col-12 col-md-6 add-image">
                          <div className="">
                            <label className="sub-heading" for="">
                              Add Image width:
                            </label>
                            <br />
                            <input
                              type="number"
                              className="inout-height-width"
                              value={imageWidth}
                              onChange={handleImageWidth}
                            />
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab
                      eventKey="display"
                      title="CONTENT"
                      className="temp-tab"
                    >
                      <h3>Title Styles</h3>

                      <div className="row">
                        <div className="col-12">
                          <label className="sub-heading" for="">
                            Add Title:
                          </label>
                          <br />
                          <input
                            className="input-title"
                            type="text"
                            placeholder="add Title"
                            value={title}
                            onChange={handleTitle}
                          />
                        </div>
                      </div>
                      <div className="row row-margin">
                        <div className="col-12">
                          <ul className="font-s-h-c">
                            <li>
                              <div className="">
                                <label className="sub-heading" for="">
                                  Font-size:
                                </label>
                                <br />
                                <input
                                  className="input-weight-height"
                                  type="number"
                                  value={titleSize}
                                  onChange={handleTitleSize}
                                />
                              </div>
                            </li>
                            <li>
                              <div className="">
                                <label className="sub-heading" for="">
                                  Font-weight:
                                </label>
                                <br />
                                <input
                                  className="input-weight-height"
                                  type="number"
                                  value={titleWeight}
                                  onChange={handleTitleWeight}
                                />
                              </div>
                            </li>
                            <li>
                              <div className="">
                                <label className="sub-heading" for="myfile">
                                  Color:
                                </label>
                                <br />
                                <div>
                                  <InputColor
                                    className="input-weight-height-content"
                                    initialValue={titleColor}
                                    onChange={(value) =>
                                      setTitleColor(value.hex)
                                    }
                                  />
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="row row-margin">
                        <h3>Message Styles</h3>
                        <div className="col-12">
                          <label className="sub-heading" for="">
                            Add message:
                          </label>
                          <br />
                          <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Type your messge here"
                            value={message}
                            onChange={handleMessage}
                          />
                        </div>
                        {/* <div className="row row-margin"> */}
                        <div className="col-12">
                          <ul className="font-s-h-c">
                            <li>
                              <div className="">
                                <label className="sub-heading" for="myfile">
                                  Font-weight:
                                </label>
                                <br />
                                <input
                                  className="input-weight-height"
                                  type="number"
                                  value={messageWeight}
                                  onChange={handleMessageWeight}
                                />
                              </div>
                            </li>
                            <li>
                              <div className="">
                                <label className="sub-heading" for="myfile">
                                  Font-size:
                                </label>
                                <br />
                                <input
                                  className="input-weight-height"
                                  type="number"
                                  value={messageSize}
                                  onChange={handleMessageSize}
                                />
                              </div>
                            </li>
                            <li>
                              <div className="">
                                <label className="sub-heading" for="myfile">
                                  Color:
                                </label>
                                <br />
                                <InputColor
                                  className="input-weight-height-content-2"
                                  initialValue={messageColor}
                                  onChange={(value) =>
                                    setMessageColor(value.hex)
                                  }
                                />
                              </div>
                            </li>
                          </ul>
                        </div>

                        {/* </div> */}
                      </div>
                    </Tab>
                    <Tab
                      eventKey="condtion"
                      title="DISPLAY"
                      className="temp-tab"
                    >
                      <>
                        <div>
                          <label className="head-names" for="11">
                            Popup For Pages
                          </label>
                          <div>
                            <div className="two-check">
                              <div className="two-check-margin-bottom">
                                {" "}
                                <input
                                  type="checkbox"
                                  id="1"
                                  name="allpages"
                                  value="allpages"
                                  checked={selectAllCheckbox}
                                  onChange={(e) => handleChange(e)}
                                />
                                <label className="page-lable for-page1" for="1">
                                  All Pages
                                </label>
                              </div>
                              <div className="for-all-check">
                                {checkboxInfo.map((item, index) => (
                                  <div key={index}>
                                    <input
                                      type="checkbox"
                                      name={item.name}
                                      value={item.value}
                                      checked={item?.isChecked || false}
                                      onChange={(e) => handleChange(e)}
                                    />
                                    <label className="page-lable for-page1">
                                      {item.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className=" popup-for-page-load-lable">
                              <label className="head-names " for="12">
                                Popup For Page-Load & Button Click
                              </label>
                            </div>
                            <div className="page-load-button-click">
                              <div className="popup-for-page-load-check ">
                                <input
                                  type="radio"
                                  id="5"
                                  name="page1"
                                  value="popuponceedit"
                                  checked={radioCheck}
                                  onChange={(e) => handleCheckboxChange(e)}
                                />
                                <label
                                  className="page-lable margin-left-13"
                                  for="5"
                                >
                                  Once On Pageload
                                </label>
                              </div>
                              <div className="popup-for-button-click">
                                <div className="popup-for-button-click-before">
                                  <div className="popup-for-button-click-check">
                                    <input
                                      type="radio"
                                      id="6"
                                      name="page2"
                                      value="buttonpopupedit"
                                      checked={radioCheck1}
                                      onChange={(e) =>
                                        handleRadioboxChangeButton(e)
                                      }
                                    />
                                  </div>
                                  <div className="popup-on-button-click-lable m-t-l">
                                    <label className="page-lable" for="6">
                                      On Button Click
                                    </label>
                                  </div>
                                  <div
                                    className="popup-once-pad-left"
                                    style={{ display: styleDisplay }}
                                  >
                                    <div className="popup-once-input-text-field">
                                      <div className="popup-on-button-click-radio">
                                        <input
                                          type="radio"
                                          id="Classname"
                                          name="classid"
                                          value="."
                                          onChange={(e) => handleClassOrId(e)}
                                        />
                                      </div>
                                      <div className="popup-on-button-click-radio-lable m-t-l">
                                        <label
                                          className="page-lable-classname"
                                          for="className"
                                        >
                                          Class Name
                                        </label>
                                      </div>
                                      <div className="popup-on-button-click-radio-button">
                                        <input
                                          type="radio"
                                          id="Id"
                                          name="classid"
                                          value="#"
                                          onChange={(e) => handleClassOrId(e)}
                                        />
                                        <div className="popup-on-button-click-radio-lable m-t-l">
                                          <label
                                            className="page-lable-id-radio"
                                            for="Id"
                                          >
                                            ID
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="popup-once-on-button-click-box">
                                      <div className="popup-on-button-click-add-classname-or-id-lable">
                                        <label
                                          className="sub-heading1 pad-bottom-0"
                                          for="classid"
                                        >
                                          Add Class or Id
                                        </label>{" "}
                                      </div>
                                      <br />
                                      <div>
                                        <input
                                          className="popup-on-button-click-input-field"
                                          id="classid"
                                          type="text"
                                          onChange={(e) => handleClassId(e)}
                                        />
                                      </div>
                                      <br />
                                      <p className="note-text">
                                        <b> Note</b>: Add {typeText} before
                                        adding {userSelector}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="popup-once-on-button-click-check">
                                  <div>
                                    <input
                                      type="radio"
                                      id="7"
                                      name="page3"
                                      value="popuponcebuttonedit"
                                      checked={radioCheck2}
                                      onChange={(e) =>
                                        handleRadioboxChangeButtonOnce(e)
                                      }
                                    />
                                  </div>
                                  <div className="popup-once-on-button-click-lable m-t-l">
                                    <label className="page-lable" for="7">
                                      Once on Button Click
                                    </label>
                                  </div>
                                  <div
                                    className="popup-once-pad-left"
                                    style={{ display: styleDisplay1 }}
                                  >
                                    <div className="popup-once-input-text-field">
                                      <div className="popup-once-on-button-click-class-check">
                                        <input
                                          type="radio"
                                          id="Classname"
                                          name="classid"
                                          value="."
                                          onChange={(e) => handleClassOrId(e)}
                                        />
                                      </div>
                                      <div className="popup-once-on-button-click-class-lable m-t-l">
                                        <label
                                          className="page-lable-classname"
                                          for="className"
                                        >
                                          Class Name
                                        </label>
                                      </div>

                                      <div className="popup-once-on-button-click-id-check">
                                        <input
                                          type="radio"
                                          id="Id"
                                          name="classid"
                                          value="#"
                                          onChange={(e) => handleClassOrId(e)}
                                        />
                                      </div>
                                      <div className="popup-once-on-button-click-id-lable m-t-l">
                                        <label
                                          className="page-lable-id"
                                          for="Id"
                                        >
                                          ID
                                        </label>
                                      </div>
                                    </div>
                                    <div className="popup-once-on-button-click-box">
                                      <div className="popup-once-on-button-click-add-classname-id-lable">
                                        <label
                                          className="sub-heading1 pad-bottom-0"
                                          for="classid"
                                        >
                                          Add Class or Id
                                        </label>{" "}
                                      </div>
                                      <br />
                                      <div>
                                        <input
                                          className="popup-on-button-click-input-field"
                                          id="classid"
                                          type="text"
                                          onChange={(e) => handleClassId(e)}
                                        />
                                      </div>
                                      <br /> <br />
                                      <p className="note-text">
                                        <b> Note</b>: Add {typeText} before
                                        adding {userSelector}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 text-center">
                            <button
                              type="button"
                              className="pop-btn1 "
                              data-bs-toggle="modal"
                              data-bs-target="#myModal"
                              onClick={handleSubmitPopup}
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </>
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-12 col-lg-6 ">
            <div className="view" id="scr">
              {/* <h2>Create Template</h2> */}
              <div className="pre-view">
                <div
                  className="preview"
                  style={{
                    height: height,
                    width: width,
                    textAlign: "center",
                    border: "1px solid #D3D3D3",
                    backgroundImage: `url(${
                      "https://ik.imagekit.io/arokee123" + bgImage
                    })`,
                    // backgroundSize: bgImageSize,
                    backgroundSize: "100% 100%",
                    backgroundColor: bgColor,
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="modal-header">
                    <h4
                      className="modal-title"
                      style={{
                        color: titleColor,
                        fontSize: titleSize + "px",
                        fontWeight: titleWeight,
                        textalign: "center",
                        // position: "absolute",
                        whiteSpace: "pre-wrap",
                        overflowWrap: "break-word",
                      }}
                    >
                      {title}
                    </h4>
                  </div>

                  <div
                    className="modal-body"
                    style={{
                      color: messageColor,
                      fontSize: messageSize + "px",
                      fontWeight: messageWeight,
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                    }}
                  >
                    <div style={styles.preview}>
                      <IKImage
                        publicKey={publicKey}
                        urlEndpoint={urlEndpoint}
                        path={image}
                        transformation={[heightWidth]}
                      />
                    </div>
                    <br />
                    {message}
                  </div>
                </div>
                <div className="bl-head">
                  <h3>Live Preview</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Edit;

const styles = {
  preview: {
    //display: "flex",
    flexDirection: "column",
  },
};
