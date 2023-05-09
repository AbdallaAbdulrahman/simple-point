import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import * as projectService from 'services/projectService';
import {httpService} from 'services/httpService';

import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Check from "@material-ui/icons/Check";
import Snackbar from "components/Snackbar/Snackbar.js";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import AdornedButton from "components/CustomButtons/AdornedButton.js";
import FormControl from "@material-ui/core/FormControl";
import Datetime from "react-datetime";
import InputLabel from "@material-ui/core/InputLabel";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import Radio from "@material-ui/core/Radio";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import AnnouncementIcon from '@material-ui/icons/Announcement';
import { Link, animateScroll as scroll } from "react-scroll";
import AddAlert from "@material-ui/icons/AddAlert";

import styles from "../Components/style/mainStyle";

const useStyles = makeStyles(styles);

var moment = require('moment-business-days');

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ProposalCreate = ({history, user}) => {

  const verifyLength = (value, length) => {
    if (value.length >= length) {
      return true;
    }
    return false;
  };

  const verifyNameLength = (value, min, max) => {
    if (value.length >= min && value.length <= max) {
      return true;
    }
    return false;
  };

  const verifyHaValue = (value) => {
    if (value >= 1 && value <= 200) {
      return true;
    }
    return false;
  };

  const [show, setShow] = useState(false);
  const [place, setPlace] = useState('br');
  const [message, setMessage] = useState('');
  const admin_id = '1';

  const [checked, setChecked] = React.useState([24, 22]);
  const [selectedValue, setSelectedValue] = React.useState("1");
  const [selectedValue2, setSelectedValue2] = React.useState("500");
  const [createProjectModal, setCreateProjectModal] = React.useState(false);
  const [inProgress, setInProgress] = React.useState(false);

  const [selectdata, setSelectdata] = React.useState([]);
  const [selectdata1, setSelectdata1] = React.useState([]);
  const [selectdata2, setSelectdata2] = React.useState([]);
  const [selectdata3, setSelectdata3] = React.useState([]);
  const [selectdata4, setSelectdata4] = React.useState([]);
  const [selectdata5, setSelectdata5] = React.useState([]);
  const [selectdata6, setSelectdata6] = React.useState([]);
  const [selectdata7, setSelectdata7] = React.useState([]);

  const [title, setTitle] = React.useState("");
  // const [deliverDate, setDeliverDate] = React.useState("");
  const [inputdata1, setInputData1] = React.useState("");
  const [inputdata2, setInputData2] = React.useState("");
  const [inputdata3, setInputData3] = React.useState("");
  const [inputdata4, setInputData4] = React.useState("");
  const [inputdata5, setInputData5] = React.useState("");
  const [inputdata6, setInputData6] = React.useState("");
  const [inputdata7, setInputData7] = React.useState("");
  const [inputdata8, setInputData8] = React.useState("");
  const [inputErrorState0, setInputErrorState0] = React.useState("error");
  const [inputErrorState1, setInputErrorState1] = React.useState("");
  const [inputErrorState2, setInputErrorState2] = React.useState("");
  const [inputErrorState3, setInputErrorState3] = React.useState("");
  const [inputErrorState4, setInputErrorState4] = React.useState("");
  
  const [simpleSelect1, setSimpleSelect1] = React.useState("");
  const [simpleSelect2, setSimpleSelect2] = React.useState("");
  const [simpleSelect3, setSimpleSelect3] = React.useState("");
  const [simpleSelect4, setSimpleSelect4] = React.useState("");
  const [simpleSelect5, setSimpleSelect5] = React.useState("");
  const [simpleSelect6, setSimpleSelect6] = React.useState("");
  const [simpleSelect7, setSimpleSelect7] = React.useState("");
  const [simpleSelect8, setSimpleSelect8] = React.useState("");
  const [selectErrorState1, setSelectErrorState1] = React.useState("");
  const [selectErrorState2, setSelectErrorState2] = React.useState("");
  const [selectErrorState3, setSelectErrorState3] = React.useState("");
  const [selectErrorState4, setSelectErrorState4] = React.useState("");
  const [selectErrorState5, setSelectErrorState5] = React.useState("");
  const [selectErrorState6, setSelectErrorState6] = React.useState("");
  const [selectErrorState7, setSelectErrorState7] = React.useState("");
  const [selectErrorState8, setSelectErrorState8] = React.useState("");
  
  const [unitPrices, setUnitPrices] = useState([]);
  var deliveryDate = "2021-08-31";
  var workDays = 0;
  var sum = 0;

  let ground_price = 0;
  let simplified_drawing_price = 0;
  let contour_price = 0;
  let longitudinal_price = 0;
  let simple_orthphoto_price = 0;
  let mesh_soil_volume_price = 0;
  let simple_accuracy_price = 0;
  let public_accuracy_price = 0;

  function currencyPrettyPrint(yen) {
    return yen.toLocaleString("en");
  }

  const subtotal = () => {
    sum = 0;
    workDays = 0;

    if (checked.indexOf(1) >= 0) {
      ground_price = (unitPrices[0].main_amount + unitPrices[0].add_amount * inputdata1);
      workDays += unitPrices[0].main_period;
      workDays += (inputdata1 <= 20) ? 0 : Math.ceil((inputdata1 - 20) / 10);
    }
    const steps1 = [2,3,3,2,3];
    const steps2 = [2,2,1,2,2,1,2,2,2,1];
    const steps3 = [2,1];
    const steps4 = [1,1,1,2];

    // const steps2 = [2,2,2,2,2,1,2,2,2,1];
    // const steps3 = [2,2,1,2,2,1,2,2,2,1];
    // const steps4 = [1,1,1,2];

    // const stepsA1000 = [2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2]; // for A rank Scale 1000
    // const stepsB1000 = [2,1,1,2,1,2]
    // const stepsC1000 = [1,1,1,2,1,1,2,1,1,2,1];

    simplified_drawing_price = 0;
    if (checked.indexOf(2) >= 0) {
      var step = Math.floor((inputdata2 - 1) / 5);
      if (selectedValue2 === '500') {
        switch (selectedValue) {
          case '1':
            simplified_drawing_price += 300000;
            workDays += 10;
            if (step > 0) {
              simplified_drawing_price += (75000 + (step - 1) * 150000);
              /* 2 3 3 2 3 */
              workDays += 1;
            // // workDays += 15;
            // workDays +=29;
            // if (step > 0) {
            //   simplified_drawing_price += (75000 + (step - 1) * 150000);
            //   /* 2 3 3 2 3 */
            //   workDays += 2;
              step -= 1;
              var i = 0;
              while (step > 0) {
                workDays += steps1[i];
                step -= 1;
                i = i == steps1.length - 1 ? 0 : i + 1;
              }
            }
            break;
          case '2':
            simplified_drawing_price += 240000;
            workDays += 7;
            if (step > 0) {
              simplified_drawing_price += (60000 + (step - 1) * 120000);
              /* 2 */
              workDays += (1 + (step - 1) * 2);
            // workDays += 27;
            // if (step > 0) {
            //   simplified_drawing_price += (60000 + (step - 1) * 120000);
            //   /* 2 */
            //   // workDays += (1 + (step - 1) * 2);

            //   // New Added 28/7/2022 by william
            //   workDays += 1;
            //   step -= 1;
            //   var i = 0;
            //   while (step > 0) {
            //     workDays += steps2[i];
            //     step -= 1;
            //     i = i == steps1.length - 1 ? 0 : i + 1;
            //   }
            //   // New Added 28/7/2022 by william
            }
            break;
          case '3':
            simplified_drawing_price += 204000;
            workDays += 6;
            // workDays += 26;
            if (step > 0) {
              simplified_drawing_price += (51000 + (step - 1) * 102000);
              /* 2 2 1 2 2 1 2 2 2 1 */
              workDays += 1;
              step -= 1;
              var i = 0;
              while (step > 0) {
                workDays += steps2[i];
                step -= 1;
                i = i == steps2.length - 1 ? 0 : i + 1;
                // workDays += steps3[i];
                // step -= 1;
                // i = i == steps3.length - 1 ? 0 : i + 1;
              }
            }
            break;
        }
      }
      else {
        switch (selectedValue) {
          case '1':
            simplified_drawing_price += 180000;
            workDays += 7;
            if (step > 0) {
              simplified_drawing_price += (45000 + (step - 1) * 75000);
              /* 2 */
              workDays += (1 + (step - 1) * 2);
            // workDays += 27;
            // if (step > 0) {
            //   simplified_drawing_price += (45000 + (step - 1) * 75000);
            //   /* 2 */
            //   // workDays += (1 + (step - 1) * 2);

            //   // New Added 28/7/2022 by william
            //   workDays += 1;
            //   step -= 1;
            //   var i = 0;
            //   while (step > 0) {
            //     workDays += stepsA1000[i];
            //     step -= 1;
            //     i = i == stepsA1000.length - 1 ? 0 : i + 1;
            //   }
            //   // New Added 28/7/2022 by william
            }
            break;
          case '2':
            simplified_drawing_price += 144000;
            workDays += 5;
            // workDays += 25;
            if (step > 0) {
              simplified_drawing_price += (36000 + (step - 1) * 60000);
              /* 2 1 */
              workDays += 1;
              step -= 1;
              var i = 0;
              while (step > 0) {
                workDays += steps3[i];
                step -= 1;
                i = i == steps3.length - 1 ? 0 : i + 1;
                // workDays += stepsB1000[i];
                // step -= 1;
                // i = i == stepsB1000.length - 1 ? 0 : i + 1;
              }
            }
            break;
          case '3':
            simplified_drawing_price += 122400;
            workDays += 5;
            // workDays += 25;
            if (step > 0) {
              simplified_drawing_price += (30600 + (step - 1) * 51000);
              /* 1 1 1 2 */
              workDays += 1;
              step -= 1;
              var i = 0;
              while (step > 0) {
                workDays += steps4[i];
                step -= 1;
                i = i == steps4.length - 1 ? 0 : i + 1;
              }
              //   workDays += stepsC1000[i];
              //   step -= 1;
              //   i = i == stepsC1000.length - 1 ? 0 : i + 1;
              //   console.log(stepsC1000[i], "--looping workday")
              // }
              // console.log(workDays, "--workdays")
            }
            break;
        }
      }
      // console.log('--------sum:', sum);
      // console.log('--------workDays:', workDays);
    }
    if (checked.indexOf(3) >= 0) {
      if (checked.indexOf(1) >= 0) {
        // グラウンドデータと等高線が同時に発注された場合、等高線の特別価格(30,000)
        contour_price = 30000;
      }
      else {
        contour_price = (unitPrices[2].main_amount + unitPrices[2].add_amount * inputdata3);
      }
      workDays += unitPrices[2].main_period;
      workDays += (inputdata3 <= 20) ? 0 : Math.ceil((inputdata3 - 20) / 10);
    }
    if (checked.indexOf(4) >= 0) {
      longitudinal_price = (unitPrices[3].main_amount + unitPrices[3].add_amount * inputdata4);
      workDays += unitPrices[3].main_period;
      workDays += (inputdata3 <= 40) ? 0 : Math.ceil((inputdata3 - 40) / 40) * 2;
    }
    
    // 土量計算
    if (checked.indexOf(5) >= 0) {
      mesh_soil_volume_price = unitPrices[5].main_amount;
      workDays += unitPrices[5].main_period;
    }
    // オルソ画像
    if (checked.indexOf(6) >= 0) {
      simple_orthphoto_price = unitPrices[4].main_amount;
      workDays += unitPrices[4].main_period;
    }
    // 簡易精度管理表
    if (checked.indexOf(7) >= 0) {
      simple_accuracy_price = unitPrices[6].main_amount;
      workDays += unitPrices[6].main_period;
    }
    // 公共精度管理表
    if (checked.indexOf(8) >= 0) {
      public_accuracy_price = unitPrices[7].main_amount;
      workDays += unitPrices[7].main_period;
    }

    sum += (ground_price + simplified_drawing_price + contour_price + longitudinal_price + mesh_soil_volume_price +
      simple_orthphoto_price + simple_accuracy_price + public_accuracy_price);
    return sum;
  }

  const tax = () => {
    return sum / 10;
  }

  const total = () => {
    return sum + tax();
  }

  const calcDeliveryDate = () => {
    // setDeliverDate(deliveryDate);
    // deliveryDate = moment('30-01-2015', 'DD-MM-YYYY').businessAdd(workDays)._d;
    const showDeliveryDate = moment().businessAdd(workDays).format('Y年M月D日');
    deliveryDate = moment().businessAdd(workDays).format('Y-M-D');  // for further process
    return showDeliveryDate;
  }

  const handleChange = event => {
    setSelectedValue(event.target.value);
  };

  const handleChange2 = event => {
    setSelectedValue2(event.target.value);
  };

  const handleSimple1 = event => {
    setSimpleSelect1(event.target.value);
  };
  const handleSimple2 = event => {
    setSimpleSelect2(event.target.value);
  };
  const handleSimple3 = event => {
    setSimpleSelect3(event.target.value);
  };
  const handleSimple4 = event => {
    setSimpleSelect4(event.target.value);
  };
  const handleSimple5 = event => {
    setSimpleSelect5(event.target.value);
  };
  const handleSimple6 = event => {
    setSimpleSelect6(event.target.value);
  };
  const handleSimple7 = event => {
    setSimpleSelect7(event.target.value);
  };
  const handleSimple8 = event => {
    setSimpleSelect8(event.target.value);
  };

  
  const handleToggle = value => {
  
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
      switch (value) {
        case 1:
          setInputErrorState1("error");
          if (simpleSelect1 === "")
            setSelectErrorState1("error");
          break;
        case 2:
          setInputErrorState2("error");
          if (simpleSelect2 === "")
            setSelectErrorState2("error");
          break;
        case 3:
          setInputErrorState3("error");
          if (simpleSelect3 === "")
            setSelectErrorState3("error");
          break;
        case 4:
          setInputErrorState4("error");
          if (simpleSelect4 === "")
            setSelectErrorState4("error");
          break;
        case 5:
          if (simpleSelect5 === "")
            setSelectErrorState5("error");
          break;
        case 6:
          if (simpleSelect6 === "")
            setSelectErrorState6("error");
          break;
        case 7:
          if (simpleSelect7 === "")
            setSelectErrorState7("error");
          break;
        case 8:
          if (simpleSelect8 === "")
            setSelectErrorState8("error");
          break;
      }
    } else {
      newChecked.splice(currentIndex, 1);
      switch (value) {
        case 1:
          setInputErrorState1("success");
          setSelectErrorState1("success");
          setErrorContent1("");
          break;
        case 2:
          setInputErrorState2("success");
          setSelectErrorState2("success");
          setErrorContent2("");
          break;
        case 3:
          setInputErrorState3("success");
          setSelectErrorState3("success");
          setErrorContent3("");
          break;
        case 4:
          setInputErrorState4("success");
          setSelectErrorState4("success");
          setErrorContent4("");
          break;
        case 5:
          setSelectErrorState5("success");
          setErrorContent5("");
          break;
        case 6:
          setSelectErrorState6("success");
          setErrorContent6("");
          break;
        case 7:
          setSelectErrorState7("success");
          setErrorContent7("");
          break;
        case 8:
          setSelectErrorState8("success");
          setErrorContent8("");
          break;
      }
      switch(value) {
        case 1:
          setInputData1("");
          // setSimpleSelect1("");  // not working
          break;
        case 2:
          setInputData2("");
          // setSimpleSelect2("");
          break;
        case 3:
          setInputData3("");
          // setSimpleSelect3("");
          break;
        case 4:
          setInputData4("");
          // setSimpleSelect4("");
          break;
     }
    }
    setChecked(newChecked);

  };

  const [errorContent0, setErrorContent0] = React.useState("");
  const [errorContent1, setErrorContent1] = React.useState("");
  const [errorContent2, setErrorContent2] = React.useState("");
  const [errorContent3, setErrorContent3] = React.useState("");
  const [errorContent4, setErrorContent4] = React.useState("");
  const [errorContent5, setErrorContent5] = React.useState("");
  const [errorContent6, setErrorContent6] = React.useState("");
  const [errorContent7, setErrorContent7] = React.useState("");
  const [errorContent8, setErrorContent8] = React.useState("");

  const errorName = () => {
    return (
      <div style={{ backgroundColor: "#FBF2F3", marginTop: "25px", paddingLeft: "20px", color: "#e12e3e", borderRadius: "5px" }}>
          <span>入力された案件名が正しくありません。</span>
      </div>
    );
  }

  const errorItem = () => {
    return (
      <div style={{ backgroundColor: "#FBF2F3", marginTop: "25px", paddingLeft: "20px", color: "#e12e3e", borderRadius: "5px" }}>
          <span>成果物を 1 つ以上選択してください。</span>
      </div>
    );
  }

  const errorText = () => {
    return (
      <div style={{ backgroundColor: "#FBF2F3", marginTop: "25px", paddingLeft: "20px", color: "#e12e3e", borderRadius: "5px" }}>
          <span>入力された数値が正しくありません。</span>
      </div>
    );
  }

  const errorOutputFormat = () => {
    return (
      <div style={{ backgroundColor: "#FBF2F3", marginTop: "25px", paddingLeft: "20px", color: "#e12e3e", borderRadius: "5px" }}>
          <span>出力形式が選択されていません。</span>
      </div>
    );
  }

  const scrollToTop = (pos) => {
    // scroll.scrollToTop();
    scroll.scrollTo(pos);
  };

  const checkValidity = () => {
    // if (inputdata1 === "") {
    //   setInputErrorState1("error");
    // } else {
    //   setInputErrorState1("success");
    // }

    // if (simpleSelect1 === "") {
    //   setSelectErrorState1("error");
    // } else {
    //   setSelectErrorState1("success");
    // }
    
    if (inputErrorState0 === "error") {
      setErrorContent0(errorName);
      scrollToTop(0);
      return false;
    }
    else {
      setErrorContent0("");
    }
    
    if (total() === 0) {
      setErrorContent0(errorItem);
      scrollToTop(0);
      return false;
    }
    else {
      setErrorContent0("");
    }

    if (inputErrorState1 === "error" || selectErrorState1 === "error") {
      scrollToTop(100);
      setErrorContent1(inputErrorState1 === "error" ? errorText : errorOutputFormat);
      return false;
    }
    else {
      setErrorContent1("");
    }
    if (inputErrorState2 === "error" || selectErrorState2 === "error") {
      scrollToTop(200);
      setErrorContent2(inputErrorState2 === "error" ? errorText : errorOutputFormat);
      return false;
    }
    else {
      setErrorContent2("");
    }
    if (inputErrorState3 === "error" || selectErrorState3 === "error") {
      scrollToTop(300);
      setErrorContent3(inputErrorState3 === "error" ? errorText : errorOutputFormat);
      return false;
    }
    else {
      setErrorContent3("");
    }
    if (inputErrorState4 === "error" || selectErrorState4 === "error") {
      scrollToTop(400);
      setErrorContent4(inputErrorState4 === "error" ? errorText : errorOutputFormat);
      return false;
    }
    else {
      setErrorContent4("");
    }
    if (selectErrorState5 === "error") {
      scrollToTop(500);
      setErrorContent5(errorOutputFormat);
      return false;
    }
    else {
      setErrorContent5("");
    }
    if (selectErrorState6 === "error") {
      scrollToTop(600);
      setErrorContent6(errorOutputFormat);
      return false;
    }
    else {
      setErrorContent6("");
    }
    if (selectErrorState7 === "error") {
      setErrorContent7(errorOutputFormat);
      return false;
    }
    else {
      setErrorContent7("");
    }
    if (selectErrorState8 === "error") {
      setErrorContent8(errorOutputFormat);
      return false;
    }
    else {
      setErrorContent8("");
    }
    return true;
  }

  const createProject = () => {
    if (checkValidity() == false) {
      setCreateProjectModal(false);
      return;
    }

    const mesh_soil_volume = checked.indexOf(5) < 0 ? null : 1;
    const simple_orthphoto = checked.indexOf(6) < 0 ? null : 1;
    const simple_accuracy_table = checked.indexOf(7) < 0 ? null : 1;
    const public_accuracy_table = checked.indexOf(8) < 0 ? null : 1;
    // console.log(user.id)
    // console.log(deliverDate.slice(0,10));
    if (user.id !== "" && title !== "" && deliveryDate !== "" && total() !== 0) {
      setInProgress(true);
      projectService.createProject({  
                                      client_id: user.id, 
                                      admin_id: admin_id,
                                      title: title, 
                                      amount: total(),
                                      subamount: sum,
                                      tax: tax(), 
                                      delivery_date: deliveryDate, 
                                      ground_data: inputdata1, 
                                      ground_data_output: simpleSelect1[0],
                                      simplified_drawing: inputdata2, 
                                      simplified_drawing_output: simpleSelect2[0],
                                      simplified_drawing_rank: selectedValue,
                                      simplified_drawing_scale: selectedValue2,
                                      contour_data: inputdata3,
                                      contour_data_output: simpleSelect3[0], 
                                      longitudinal_data: inputdata4, 
                                      longitudinal_data_output: simpleSelect4[0], 
                                      mesh_soil_volume: mesh_soil_volume, 
                                      mesh_soil_volume_output: simpleSelect5[0], 
                                      simple_orthphoto: simple_orthphoto, 
                                      simple_orthphoto_output: simpleSelect6[0], 
                                      simple_accuracy_table: simple_accuracy_table, 
                                      simple_accuracy_table_output: simpleSelect7[0], 
                                      public_accuracy_table: public_accuracy_table, 
                                      public_accuracy_table_output: simpleSelect8[0],
                                      ground_price: ground_price,
                                      simplified_drawing_price: simplified_drawing_price,
                                      contour_price: contour_price,
                                      longitudinal_price: longitudinal_price,
                                      simple_orthphoto_price: simple_orthphoto_price,
                                      mesh_soil_volume_price: mesh_soil_volume_price,
                                      simple_accuracy_price: simple_accuracy_price,
                                      public_accuracy_price: public_accuracy_price
                                  }).then(({status, data}) => {
                                    if(status === 200){
                                      // showNotification('br', 'create success~~~');
                                      setInProgress(false);
                                      // history.push("/admin/projectdetail/"+ data.project.id +"" );
                                      history.push({
                                        pathname: "/admin/projectdetail/" + data.project.id,
                                        state: data.project
                                      });
                                      setCreateProjectModal(false);
                                    } else {
                                      // showNotification('br', 'Register failed');
                                      setInProgress(false);
                                      setCreateProjectModal(false);
                                    }
                                  }).catch((err) => {
                                    console.log(err);
                                    setInProgress(false);
                                  })
    } else {
      showNotification('br', 'Main items are missing.')
      setInProgress(false);
      setCreateProjectModal(false);
    }
  }

  useEffect(() => {
    // console.log(user);
    projectService.getProjectFormats().then(result => {
      // console.log(result.data.work_output_formats, 'users')
      if(result.data && result.data.work_output_formats){
        setSelectdata(result.data.work_output_formats[0].output_formats.map((type) => {
          return[type.format]
        }))
        setSelectdata1(result.data.work_output_formats[1].output_formats.map((type) => {
          return[type.format]
        }))
        setSelectdata2(result.data.work_output_formats[2].output_formats.map((type) => {
          return[type.format]
        }))
        setSelectdata3(result.data.work_output_formats[3].output_formats.map((type) => {
          return[type.format]
        }))
        setSelectdata4(result.data.work_output_formats[5].output_formats.map((type) => {
          return[type.format]
        }))
        setSelectdata5(result.data.work_output_formats[4].output_formats.map((type) => {
          return[type.format]
        }))
        setSelectdata6(result.data.work_output_formats[6].output_formats.map((type) => {
          return[type.format]
        }))
        setSelectdata7(result.data.work_output_formats[7].output_formats.map((type) => {
          return[type.format]
        }))
      }
      else{
        console.log('error');
      }
    }).catch((err)=>{
      console.log(err);
    });

    httpService.get('api/client/prices').then(result => {
      if (result.data && result.data.message == 'success' && result.data.prices) {
        setUnitPrices(result.data.prices);
      }
      else {
        console.log('error');
      }
    }).catch((err)=>{
      console.log(err);
    });
  }, [])

  const classes = useStyles();

  const showNotification = (place, message) => {
    setPlace(place);
    setMessage(message);
    setShow(true);
    // setTimeout(() => {
    //   setShow(false);
    // }, 6000);
  };


  return (
      <div>
        <Dialog
          open={createProjectModal}
          TransitionComponent={Transition}
          onClose={() => setCreateProjectModal(false)}
        >
           <DialogContent>
          <DialogTitle
            disableTypography
            style={{ textAlign: "center" }}
          >
            <h4><b>発注しますか？</b></h4>
          </DialogTitle>
          <DialogActions
            className={
              classes.modalFooter + " " + classes.modalFooterCenter
            }
          >
            <Button
              onClick={() => setCreateProjectModal(false)}
              style={{ backgroundColor: "lightgrey", color: "black" }}
            >
              キャンセル
            </Button>
            <AdornedButton
              loading={inProgress}
              style={{ backgroundColor: "#e12e3e" }}
              onClick={createProject}
              disabled={inProgress}
            >
              発注する
            </AdornedButton>
            {/* <Button
              // onClick={() => setDeleteProjectModal(false)}
              style={{ backgroundColor: "#e12e3e" }}
              onClick={createProject}
              disabled={inProgress}
            >
              発注する
            </Button> */}
          </DialogActions>  
          </DialogContent>
        </Dialog>
        <Card>
          <CardBody>
            <div className={classes.cardbody}>
              <span style={{ marginLeft: "-12px", fontWeight: "bold" }}>案件名</span>
              <GridContainer style={{marginBottom: "20px"}}>
                <GridItem xs={12} sm={8}>
                  <CustomInput
                    id=""
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        if (verifyNameLength(event.target.value, 1, 50)) {
                          setInputErrorState0("success");
                        } else {
                          setInputErrorState0("error");
                        }
                        setTitle(event.target.value);
                      },
                      placeholder: "1~50文字",
                      disabled: false
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={4}>
                  {errorContent0}
                </GridItem>                
              </GridContainer>

              {/* グラウンドデータ(DTM) */}

              <GridContainer>
                    <div
                      className={
                        classes.checkboxAndRadio +
                        " " +
                        classes.checkboxAndRadioHorizontal
                      }
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            tabIndex={-1}
                            onClick={() => handleToggle(1)}
                            checkedIcon={
                              <Check className={classes.checkedIcon} />
                            }
                            icon={<Check className={classes.uncheckedIcon} />}
                            classes={{
                              checked: classes.checked,
                              root: classes.checkRoot
                            }}
                          />
                        }
                        classes={{
                          label: classes.label,
                          root: classes.labelRoot
                        }}
                        // label="グラウンドデータ(DTM)"
                        label={<span style={{ color: 'black' }}>グラウンドデータ(DTM)</span>}
                      />
                    </div>
                  </GridContainer>
              <GridContainer justify="center">
                <GridItem xs={12} sm={8}>
                  <GridContainer>
                    <GridItem xs={12} sm={6}>
                      <CustomInput
                        tabIndex={-1}
                        id="firstValue"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: event => {
                            if (verifyHaValue(event.target.value)) {
                              setInputErrorState1("success");
                            } else {
                              setInputErrorState1("error");
                            }
                            setInputData1(event.target.value <= 200 ? event.target.value : 200);
                          },
                          placeholder: "1~200",
                          type: "number",
                          disabled: checked.indexOf(1) < 0,
                          value: inputdata1
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={2}>
                      <div style={{ paddingTop: '30px', color: 'black'}}>ha</div>
                    </GridItem>
                    <GridItem xs={12} sm={4}>
                    <FormControl
                    fullWidth
                    className={classes.selectFormControl}
                    >
                      <InputLabel
                        htmlFor="simple-select"
                        className={classes.selectLabel}
                      >
                        出力形式を選択
                      </InputLabel>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        classes={{
                          select: classes.select
                        }}
                        value={simpleSelect1}
                        inputProps={{
                          onChange: event => {
                            if (verifyLength(event.target.value, 1)) {
                              setSelectErrorState1("success");
                              setErrorContent1("");
                            } else {
                              setSelectErrorState1("error");
                            }
                            setSimpleSelect1(event.target.value);
                          },
                          name: "simpleSelect1",
                          id: "simple-select1",
                          disabled: checked.indexOf(1) < 0
                        }}
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem
                          }}
                        >
                          出力形式を選択
                        </MenuItem>
                        {
                          selectdata.map((format) => {
                            return ( 
                              <MenuItem
                                key={format}
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value={format}
                              >
                                {format}
                              </MenuItem>
                            )
                          })
                        } 
                      </Select> 
                    </FormControl>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={4}>
                  {errorContent1}
                </GridItem>
              </GridContainer>

              {/* 簡易図化(一般図) */}
              <GridContainer>
                <div
                  className={
                    classes.checkboxAndRadio +
                    " " +
                    classes.checkboxAndRadioHorizontal
                  }
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        tabIndex={-1}
                        onClick={() => handleToggle(2)}
                        checkedIcon={
                          <Check className={classes.checkedIcon} />
                        }
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                          checked: classes.checked,
                          root: classes.checkRoot
                        }}
                      />
                    }
                    classes={{
                      label: classes.label,
                      root: classes.labelRoot
                    }}
                    label={<span style={{ color: 'black' }}>簡易図化(一般図)</span>}
                    />
                </div>
              </GridContainer>
              <GridContainer justify="center">
                <GridItem xs={12} sm={8}>
                  <GridContainer>
                    <GridItem xs={12} sm={6}>
                      <CustomInput
                        id=""
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: event => {
                            if (verifyHaValue(event.target.value)) {
                              setInputErrorState2("success");
                            } else {
                              setInputErrorState2("error");
                            }
                            setInputData2(event.target.value <= 200 ? event.target.value : 200);
                          },
                          placeholder: "1~200",
                          type: "number",
                          disabled: checked.indexOf(2) < 0,
                          value: inputdata2
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={2}>
                      <div style={{ paddingTop: '30px', color: 'black'}}>ha</div>
                    </GridItem>
                    <GridItem xs={12} sm={4}>
                    <FormControl
                    fullWidth
                    className={classes.selectFormControl}
                    >
                      <InputLabel
                        htmlFor="simple-select"
                        className={classes.selectLabel}
                      >
                        出力形式を選択
                      </InputLabel>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        classes={{
                          select: classes.select
                        }}
                        value={simpleSelect2}
                        inputProps={{
                          onChange: event => {
                            if (verifyLength(event.target.value, 1)) {
                              setSelectErrorState2("success");
                              setErrorContent2("");
                            } else {
                              setSelectErrorState2("error");
                            }
                            setSimpleSelect2(event.target.value);
                          },
                          name: "simpleSelect2",
                          id: "simple-select2",
                          disabled: checked.indexOf(2) < 0
                        }}
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem
                          }}
                        >
                          出力形式を選択
                        </MenuItem>
                        {
                          selectdata1.map((format) => {
                            return ( 
                              <MenuItem
                                key={format}
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value={format}
                              >
                                {format}
                              </MenuItem>
                            )
                          })
                        } 
                      </Select> 
                    </FormControl>
                    </GridItem>
                  </GridContainer>
                  {checked.indexOf(2) > 0 && <div className={classes.selectType}>
                    <b>図化対象</b>
                    <GridContainer>
                      <GridItem xs={12} sm={4}>
                        <div
                        className={
                          classes.checkboxAndRadio +
                          " " +
                          classes.checkboxAndRadioHorizontal
                        }
                        >
                          <FormControlLabel
                            control={
                              <Radio
                                checked={selectedValue === "1"}
                                onChange={handleChange}
                                value="1"
                                name="A"
                                aria-label="1"
                                icon={
                                  <FiberManualRecord
                                    className={classes.radioUnchecked}
                                  />
                                }
                                checkedIcon={
                                  <FiberManualRecord
                                    className={classes.radioChecked}
                                  />
                                }
                                classes={{
                                  checked: classes.radio,
                                  root: classes.radioRoot
                                }}
                              />
                            }
                            classes={{
                              label: classes.label,
                              root: classes.labelRoot
                            }}
                            label={<span style={{ color: 'black' }}>Aランク<br/>家屋密度　高</span>}
                            />
                        </div>
                      </GridItem>
                      <GridItem xs={12} sm={4}>
                        <div
                        className={
                          classes.checkboxAndRadio +
                          " " +
                          classes.checkboxAndRadioHorizontal
                        }
                        >
                          <FormControlLabel
                            control={
                              <Radio
                                checked={selectedValue === "2"}
                                onChange={handleChange}
                                value="2"
                                name="B"
                                aria-label="2"
                                icon={
                                  <FiberManualRecord
                                    className={classes.radioUnchecked}
                                  />
                                }
                                checkedIcon={
                                  <FiberManualRecord
                                    className={classes.radioChecked}
                                  />
                                }
                                classes={{
                                  checked: classes.radio,
                                  root: classes.radioRoot
                                }}
                              />
                            }
                            classes={{
                              label: classes.label,
                              root: classes.labelRoot
                            }}
                            label={<span style={{ color: 'black' }}>Bランク<br/>家屋密度　中</span>}
                          />
                        </div>
                      </GridItem>
                      <GridItem xs={12} sm={4}>
                        <div
                        className={
                          classes.checkboxAndRadio +
                          " " +
                          classes.checkboxAndRadioHorizontal
                        }
                        >
                          <FormControlLabel
                            control={
                              <Radio
                                checked={selectedValue === "3"}
                                onChange={handleChange}
                                value="3"
                                name="C"
                                aria-label="3"
                                icon={
                                  <FiberManualRecord
                                    className={classes.radioUnchecked}
                                  />
                                }
                                checkedIcon={
                                  <FiberManualRecord
                                    className={classes.radioChecked}
                                  />
                                }
                                classes={{
                                  checked: classes.radio,
                                  root: classes.radioRoot
                                }}
                              />
                            }
                            classes={{
                              label: classes.label,
                              root: classes.labelRoot
                            }}
                            label={<span style={{ color: 'black' }}>Cランク<br/>家屋密度　低</span>}
                          />
                        </div>
                      </GridItem>
                    </GridContainer>
                    <br/>
                    <b> 縮尺</b>
                    <GridContainer>
                      <GridItem xs={12} sm={4}>
                        <div
                        className={
                          classes.checkboxAndRadio +
                          " " +
                          classes.checkboxAndRadioHorizontal
                        }
                        >
                          <FormControlLabel
                            control={
                              <Radio
                                checked={selectedValue2 === "500"}
                                onChange={handleChange2}
                                value="500"
                                name="500"
                                aria-label="500"
                                icon={
                                  <FiberManualRecord
                                    className={classes.radioUnchecked}
                                  />
                                }
                                checkedIcon={
                                  <FiberManualRecord
                                    className={classes.radioChecked}
                                  />
                                }
                                classes={{
                                  checked: classes.radio,
                                  root: classes.radioRoot
                                }}
                              />
                            }
                            classes={{
                              label: classes.label,
                              root: classes.labelRoot
                            }}
                            label={<span style={{ color: 'black' }}>1/500</span>}
                          />
                        </div>
                      </GridItem>
                      <GridItem xs={12} sm={4}>
                        <div
                        className={
                          classes.checkboxAndRadio +
                          " " +
                          classes.checkboxAndRadioHorizontal
                        }
                        >
                          <FormControlLabel
                            control={
                              <Radio
                                checked={selectedValue2 === "1000"}
                                onChange={handleChange2}
                                value="1000"
                                name="1000"
                                aria-label="1000"
                                icon={
                                  <FiberManualRecord
                                    className={classes.radioUnchecked}
                                  />
                                }
                                checkedIcon={
                                  <FiberManualRecord
                                    className={classes.radioChecked}
                                  />
                                }
                                classes={{
                                  checked: classes.radio,
                                  root: classes.radioRoot
                                }}
                              />
                            }
                            classes={{
                              label: classes.label,
                              root: classes.labelRoot
                            }}
                            label={<span style={{ color: 'black' }}>1/1,000</span>}
                          />
                        </div>
                      </GridItem>
                    </GridContainer>
                  </div>
                  }                  
                </GridItem>
                <GridItem xs={12} sm={4}>
                  {errorContent2}
                </GridItem>
              </GridContainer>

              {/* 等高線 */}
              <GridContainer>
                <div
                  className={
                    classes.checkboxAndRadio +
                    " " +
                    classes.checkboxAndRadioHorizontal
                  }
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        tabIndex={-1}
                        onClick={() => handleToggle(3)}
                        checkedIcon={
                          <Check className={classes.checkedIcon} />
                        }
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                          checked: classes.checked,
                          root: classes.checkRoot
                        }}
                      />
                    }
                    classes={{
                      label: classes.label,
                      root: classes.labelRoot
                    }}
                    label={<span style={{ color: 'black' }}>等高線</span>}
                  />
                </div>
              </GridContainer>
              <GridContainer justify="center">
                <GridItem xs={12} sm={8}>
                  <GridContainer>
                    <GridItem xs={12} sm={6}>
                      <CustomInput
                        id=""
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: event => {
                            if (verifyHaValue(event.target.value)) {
                              setInputErrorState3("success");
                            } else {
                              setInputErrorState3("error");
                            }
                            setInputData3(event.target.value <= 200 ? event.target.value : 200);
                          },
                          placeholder: "1~200",
                          type: "number",
                          disabled: checked.indexOf(3) < 0,
                          value: inputdata3
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={2}>
                      <div style={{ paddingTop: '30px', color: 'black'}}>ha</div>
                    </GridItem>
                    <GridItem xs={12} sm={4}>
                    <FormControl
                    fullWidth
                    className={classes.selectFormControl}
                    >
                      <InputLabel
                        htmlFor="simple-select"
                        className={classes.selectLabel}
                      >
                        出力形式を選択
                      </InputLabel>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        classes={{
                          select: classes.select
                        }}
                        value={simpleSelect3}
                        inputProps={{
                          onChange: event => {
                            if (verifyLength(event.target.value, 1)) {
                              setSelectErrorState3("success");
                              setErrorContent3("");
                            } else {
                              setSelectErrorState3("error");
                            }
                            setSimpleSelect3(event.target.value);
                          },
                          name: "simpleSelect3",
                          id: "simple-select3",
                          disabled: checked.indexOf(3) < 0
                        }}
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem
                          }}
                        >
                          出力形式を選択
                        </MenuItem>
                        {
                          selectdata2.map((format) => {
                            return ( 
                              <MenuItem
                                key={format}
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value={format}
                              >
                                {format}
                              </MenuItem>
                            )
                          })
                        } 
                      </Select> 
                    </FormControl>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={4}>
                  {errorContent3}
                </GridItem>
              </GridContainer>
 
              {/* 縦横断図 */}
              <GridContainer>
                <div
                  className={
                    classes.checkboxAndRadio +
                    " " +
                    classes.checkboxAndRadioHorizontal
                  }
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        tabIndex={-1}
                        onClick={() => handleToggle(4)}
                        checkedIcon={
                          <Check className={classes.checkedIcon} />
                        }
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                          checked: classes.checked,
                          root: classes.checkRoot
                        }}
                      />
                    }
                    classes={{
                      label: classes.label,
                      root: classes.labelRoot
                    }}
                    label={<span style={{ color: 'black' }}>縦横断図</span>}
                  />
                </div>
              </GridContainer>
              <GridContainer justify="center">
                <GridItem xs={12} sm={8}>
                  <GridContainer>
                    <GridItem xs={12} sm={6}>
                      <CustomInput
                        id=""
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          placeholder: "1~200",
                          onChange: event => {
                            if (verifyHaValue(event.target.value)) {
                              setInputErrorState4("success");
                            } else {
                              setInputErrorState4("error");
                            }
                            setInputData4(event.target.value <= 200 ? event.target.value : 200);

                          },
                          type: "number",
                          disabled: checked.indexOf(4) < 0,
                          value: inputdata4
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={2}>
                      <div style={{ paddingTop: '30px', color: 'black'}}>本</div>
                    </GridItem>
                    <GridItem xs={12} sm={4}>
                    <FormControl
                    fullWidth
                    className={classes.selectFormControl}
                    >
                      <InputLabel
                        htmlFor="simple-select"
                        className={classes.selectLabel}
                      >
                        出力形式を選択
                      </InputLabel>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        classes={{
                          select: classes.select
                        }}
                        value={simpleSelect4}
                        inputProps={{
                          onChange: event => {
                            if (verifyLength(event.target.value, 1)) {
                              setSelectErrorState4("success");
                              setErrorContent4("");
                            } else {
                              setSelectErrorState4("error");
                            }
                            setSimpleSelect4(event.target.value);
                          },
                          name: "simpleSelect4",
                          id: "simple-select4",
                          disabled: checked.indexOf(4) < 0
                        }}
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem
                          }}
                        >
                          出力形式を選択
                        </MenuItem>
                        {
                          selectdata3.map((format) => {
                            return ( 
                              <MenuItem
                                key={format}
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value={format}
                              >
                                {format}
                              </MenuItem>
                            )
                          })
                        } 
                      </Select> 
                    </FormControl>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={4}>
                  {errorContent4}
                </GridItem>
              </GridContainer>

              {/* 土量計算（メッシュ法） */}
              <GridContainer>
                <div
                  className={
                    classes.checkboxAndRadio +
                    " " +
                    classes.checkboxAndRadioHorizontal
                  }
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        tabIndex={-1}
                        onClick={() => handleToggle(5)}
                        checkedIcon={
                          <Check className={classes.checkedIcon} />
                        }
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                          checked: classes.checked,
                          root: classes.checkRoot
                        }}
                      />
                    }
                    classes={{
                      label: classes.label,
                      root: classes.labelRoot
                    }}
                    label={<span style={{ color: 'black' }}>土量計算（メッシュ法）</span>}                    
                  />
                </div>
              </GridContainer>
              <GridContainer justify="center">
                <GridItem xs={12} sm={8}>
                  <GridContainer>
                    <GridItem xs={12} sm={6}>
                      {/* <CustomInput
                        id=""
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: event => {
                            setInputData5(event.target.value);
                          },
                          placeholder: "1~200",
                          disabled: checked.indexOf(5) < 0
                        }}
                      /> */}
                    </GridItem>
                    <GridItem xs={12} sm={2}></GridItem>
                    <GridItem xs={12} sm={4}>
                    <FormControl
                    fullWidth
                    className={classes.selectFormControl}
                    >
                      <InputLabel
                        htmlFor="simple-select"
                        className={classes.selectLabel}
                      >
                        出力形式を選択
                      </InputLabel>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        classes={{
                          select: classes.select
                        }}
                        value={simpleSelect5}
                        inputProps={{
                          onChange: event => {
                            if (verifyLength(event.target.value, 1)) {
                              setSelectErrorState5("success");
                              setErrorContent5("");
                            } else {
                              setSelectErrorState5("error");
                            }
                            setSimpleSelect5(event.target.value);
                          },
                          name: "simpleSelect5",
                          id: "simple-select5",
                          disabled: checked.indexOf(5) < 0
                        }}
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem
                          }}
                        >
                          出力形式を選択
                        </MenuItem>
                        {
                          selectdata4.map((format) => {
                            return ( 
                              <MenuItem
                                key={format}
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value={format}
                              >
                                {format}
                              </MenuItem>
                            )
                          })
                        } 
                      </Select> 
                    </FormControl>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={4}>
                  {errorContent5}
                </GridItem>
              </GridContainer>

              {/* オルソ画像 */}
              <GridContainer>
                <div
                  className={
                    classes.checkboxAndRadio +
                    " " +
                    classes.checkboxAndRadioHorizontal
                  }
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        tabIndex={-1}
                        onClick={() => handleToggle(6)}
                        checkedIcon={
                          <Check className={classes.checkedIcon} />
                        }
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                          checked: classes.checked,
                          root: classes.checkRoot
                        }}
                      />
                    }
                    classes={{
                      label: classes.label,
                      root: classes.labelRoot
                    }}
                    label={<span style={{ color: 'black' }}>オルソ画像</span>}
                  />
                </div>
              </GridContainer>
              <GridContainer justify="center">
                <GridItem xs={12} sm={8}>
                  <GridContainer>
                    <GridItem xs={12} sm={6}>
                      {/* <CustomInput
                        id=""
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: event => {
                            setInputData6(event.target.value);
                          },
                          placeholder: "1~200",
                          disabled: checked.indexOf(6) < 0
                        }}
                      /> */}
                    </GridItem>
                    <GridItem xs={12} sm={2}></GridItem>
                    <GridItem xs={12} sm={4}>
                    <FormControl
                    fullWidth
                    className={classes.selectFormControl}
                    >
                      <InputLabel
                        htmlFor="simple-select"
                        className={classes.selectLabel}
                      >
                        出力形式を選択
                      </InputLabel>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        classes={{
                          select: classes.select
                        }}
                        value={simpleSelect6}
                        inputProps={{
                          onChange: event => {
                            if (verifyLength(event.target.value, 1)) {
                              setSelectErrorState6("success");
                              setErrorContent6("");
                            } else {
                              setSelectErrorState6("error");
                            }
                            setSimpleSelect6(event.target.value);
                          },
                          name: "simpleSelect6",
                          id: "simple-select6",
                          disabled: checked.indexOf(6) < 0
                        }}
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem
                          }}
                        >
                          出力形式を選択
                        </MenuItem>
                        {
                          selectdata5.map((format) => {
                            return ( 
                              <MenuItem
                                key={format}
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value={format}
                              >
                                {format}
                              </MenuItem>
                            )
                          })
                        } 
                      </Select> 
                    </FormControl>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={4}>
                  {errorContent6}
                </GridItem>
              </GridContainer>

              {/* 簡易精度管理表 */}
              <GridContainer>
                <div
                  className={
                    classes.checkboxAndRadio +
                    " " +
                    classes.checkboxAndRadioHorizontal
                  }
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        tabIndex={-1}
                        onClick={() => handleToggle(7)}
                        checkedIcon={
                          <Check className={classes.checkedIcon} />
                        }
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                          checked: classes.checked,
                          root: classes.checkRoot
                        }}
                      />
                    }
                    classes={{
                      label: classes.label,
                      root: classes.labelRoot
                    }}
                    label={<span style={{ color: 'black' }}>簡易精度管理表</span>}
                  />
                </div>
              </GridContainer>
              <GridContainer justify="center">
                <GridItem xs={12} sm={8}>
                  <GridContainer>
                    <GridItem xs={12} sm={6}>
                      {/* <CustomInput
                        id=""
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: event => {
                            setInputData7(event.target.value);
                          },
                          placeholder: "1~200",
                          disabled: checked.indexOf(7) < 0
                        }}
                      /> */}
                    </GridItem>
                    <GridItem xs={12} sm={2}></GridItem>
                    <GridItem xs={12} sm={4}>
                    <FormControl
                    fullWidth
                    className={classes.selectFormControl}
                    >
                      <InputLabel
                        htmlFor="simple-select"
                        className={classes.selectLabel}
                      >
                        出力形式を選択
                      </InputLabel>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        classes={{
                          select: classes.select
                        }}
                        value={simpleSelect7}
                        inputProps={{
                          onChange: event => {
                            if (verifyLength(event.target.value, 1)) {
                              setSelectErrorState7("success");
                              setErrorContent7("");
                            } else {
                              setSelectErrorState7("error");
                            }
                            setSimpleSelect7(event.target.value);
                          },
                          name: "simpleSelect7",
                          id: "simple-select7",
                          disabled: checked.indexOf(7) < 0
                        }}
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem
                          }}
                        >
                          出力形式を選択
                        </MenuItem>
                        {
                          selectdata6.map((format) => {
                            return ( 
                              <MenuItem
                                key={format}
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value={format}
                              >
                                {format}
                              </MenuItem>
                            )
                          })
                        } 
                      </Select> 
                    </FormControl>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={4}>
                  {errorContent7}
                </GridItem>
              </GridContainer>

              {/* 公共精度管理表 */}
              <GridContainer>
                <div
                  className={
                    classes.checkboxAndRadio +
                    " " +
                    classes.checkboxAndRadioHorizontal
                  }
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        tabIndex={-1}
                        onClick={() => handleToggle(8)}
                        checkedIcon={
                          <Check className={classes.checkedIcon} />
                        }
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                          checked: classes.checked,
                          root: classes.checkRoot
                        }}
                      />
                    }
                    classes={{
                      label: classes.label,
                      root: classes.labelRoot
                    }}
                    label={<span style={{ color: 'black' }}>公共精度管理表</span>}
                  />
                </div>
              </GridContainer>
              <GridContainer justify="center">
                <GridItem xs={12} sm={8}>
                  <GridContainer>
                    <GridItem xs={12} sm={6}>
                      {/* <CustomInput
                        id=""
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: event => {
                            setInputData8(event.target.value);
                          },
                          placeholder: "1~200",
                          disabled: checked.indexOf(8) < 0
                        }}
                      /> */}
                    </GridItem>
                    <GridItem xs={12} sm={2}></GridItem>
                    <GridItem xs={12} sm={4}>
                      <FormControl
                      fullWidth
                      className={classes.selectFormControl}
                      >
                        <InputLabel
                          htmlFor="simple-select"
                          className={classes.selectLabel}
                        >
                          出力形式を選択
                        </InputLabel>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          classes={{
                            select: classes.select
                          }}
                          value={simpleSelect8}
                          inputProps={{
                            onChange: event => {
                              if (verifyLength(event.target.value, 1)) {
                                setSelectErrorState8("success");
                                setErrorContent8("");
                              } else {
                                setSelectErrorState8("error");
                              }
                              setSimpleSelect8(event.target.value);
                            },
                            name: "simpleSelect8",
                            id: "simple-select8",
                            disabled: checked.indexOf(8) < 0
                          }}
                        >
                          <MenuItem
                            disabled
                            classes={{
                              root: classes.selectMenuItem
                            }}
                          >
                            出力形式を選択
                          </MenuItem>
                          {
                            selectdata7.map((format) => {
                              return ( 
                                <MenuItem
                                  key={format}
                                  classes={{
                                    root: classes.selectMenuItem,
                                    selected: classes.selectMenuItemSelected
                                  }}
                                  value={format}
                                >
                                  {format}
                                </MenuItem>
                              )
                            })
                          } 
                        </Select> 
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                  <div className={classes.greyline}></div>
                </GridItem>
                <GridItem xs={12} sm={4}>
                  {errorContent8}
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={12} sm={8}>
                  <GridContainer>
                    <GridItem xs={12} sm={6}>
                      <div className={classes.fullWidthContent}>
                        <div className={classes.leftContent}>小計</div>
                        {/* <div className={classes.rightContent}>{subtotal()} 円</div> */}
                        <div className={classes.rightContent} style={{fontSize: "20px"}}>{currencyPrettyPrint(subtotal())} 円</div>
                      </div>
                      <div className={classes.fullWidthContent}>
                        <div className={classes.leftContent}>消費税</div>
                        <div className={classes.rightContent} style={{fontSize: "20px"}}>{currencyPrettyPrint(tax())} 円</div>
                      </div>
                      <div className={classes.bitunderline}></div>
                      <div className={classes.fullWidthContent}>
                        <div className={classes.leftContent}>合計</div>
                        <div className={classes.rightContent} style={{fontSize: "20px"}}>{currencyPrettyPrint(total())} 円</div>
                      </div>
                    </GridItem>
                    <GridItem xs={12} sm={2}></GridItem>
                    <GridItem xs={12} sm={4}>
                      <p><b>目安納品日</b></p>
                      <p><b>{calcDeliveryDate()}</b></p>
                      {/* <div className={classes.leftContent}>{calcDeliveryDate()}</div> */}
                      <br />
                      <Button onClick={() => setCreateProjectModal(true)} style={{ backgroundColor: "#e12e3e", padding: "12px 50px" }}
                          disabled={inProgress}
                          >
                        発注する
                      </Button>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={4}>
                </GridItem>
              </GridContainer>

              <GridContainer justify="center">
                {/* <GridItem xs={12} sm={4}>
                  <div style={{ paddingTop: "150px" }}>
                    <SnackbarContent
                      message={
                        'ご登録いただいたメールアドレスを入力してください'
                      }
                      icon={AnnouncementIcon}
                      color="rose"
                    />
                  </div>
                </GridItem> */}
              </GridContainer>
            </div>
          </CardBody>
          <Snackbar
              place={place}
              color="danger"
              icon={AddAlert}
              message={message}
              open={show}
              closeNotification={() => setShow(false)}
              close
            />
        </Card>
      </div>
  );
}


const mapStateToProps = (state, ownProps) => ({
    user: state.auth.user
})
  
const mapDispatchToProps = ({})
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProposalCreate))