import React, { useEffect, useState, useRef } from "react";
import { connect } from 'react-redux';
import { withRouter, useHistory, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import ChatContent from "views/Components/ChatContent.js";
import * as projectService from 'services/projectService';

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import Button from "components/CustomButtons/Button.js";
import AdornedButton from "components/CustomButtons/AdornedButton.js";

import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import styles from "./style/mainStyle.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";
import Success from "components/Typography/Success.js";

import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";

const useStyles = makeStyles(styles);

const s3Client = new S3Client({
  region: process.env.REACT_APP_AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
  }
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

let uploadButtons = [];
let downloadButtons = [];
let percentageButtons = [];

const TimelineContent = ( props) => {
  const { projectId, user } = props;
  const history = useHistory();

  // console.log('-------prj:', projectId, ',', user)
  const [projectTitle, setProjectTitle] = React.useState("");
  const [projectOrderFilename, setProjectOrderFilename] = React.useState("");
  const [projectInvoiceFilename, setProjectInvoiceFilename] = React.useState("");
  const [deliveryDate, setDeliveryDate ] = React.useState("");
  const [chatting, setChatting ] = React.useState(false); 
  var status = "";
  const [completeProjectModal, setCompleteProjectModal] = React.useState(false);
  const [projStatus, setProjStatus] = React.useState('');
  
  const [requestDataLink, setRequestDataLink] = React.useState([]);
  const [deliveryDataLink, setDeliveryDataLink] = React.useState([]);
  const [projDetail, setProjDetail] = React.useState([]);
  const [clientId, setClientId] = React.useState("");
  const [businessId, setBusinessId] = React.useState("");

  const [inProgress, setInProgress] = React.useState(false);

  const [show, setShow] = useState(false);
  const [place, setPlace] = useState('br');
  const [message, setMessage] = useState('');
  const [alertStatus, setStatus] = useState('success');
  const [indexUploadButton, setIndexUploadButton] = useState([]);
  const [percentUploadButton, setPercentUploadButton] = useState([]);
  const [indexDownloadButton, setIndexDownloadButton] = useState([]);
  const location = useLocation();
  const msg = location.msg;

  const showNotification = (place, message, alertStatus = 'success') => {
    setPlace(place);
    setMessage(message);
    setShow(true);
    setStatus(alertStatus);
    setTimeout(() => {
      setShow(false);
    }, 6000);
  };


  // const projectId = project.id;
  // let projectstitle = "";
  // let deliverydate = "";
  
  // let path = window.location.pathname;
  // let id = path.slice(21);
  // projectService.getProjects().then(res => {
  //   let obj = res.data.projects.find(o => o.id == id);
  //   setProjectTitle(obj.title);
  //   setDeliveryDate(obj.delivery_date);

  //   status = obj.status;
  //   setProjStatus(status);
  //   if (status == "作業前" || status == "作業中" || status == "納品中" || status == "検収中")
  //     setChatting(true);
  // });

  // setProjectTitle(project.title);
  // setDeliveryDate(project.delivery_date);

  const refreshRequestData = () => {
    projectService.getProjectRequestData(projectId).then(res => {
      if (res.data.message == 'success') {
        const requestData = res.data.data;
        // setRequestDataCount(requestData.length);
        // setRequestDataLink(requestData.map(a => a.request_data_link));
        setRequestDataLink(requestData);
      }
    }).catch((err)=>{
      console.log(err);
      history.push("/auth/login");
      return ( <div /> );
    });    
  }

  const refreshDeliveryData = () => {
    projectService.getProjectDeliveryData(projectId).then(res => {
      if (res.data.message == 'success') {
        const deliveryData = res.data.data;
        // setDeliveryDataCount(DeliveryData.length);
        // setDeliveryDataLink(DeliveryData.map(a => a.Delivery_data_link));
        setDeliveryDataLink(deliveryData);
      }
    }).catch((err)=>{
      console.log(err);
      history.push("/auth/login");
      return ( <div /> );
    });    
  }

  const fillDetail = (detail) => {
    let projWork = [];

    if (detail.ground_data != null) {
      projWork.push('グラウンドデータ (' + detail.ground_data_output + ') ' + detail.ground_data + 'ha');
    }
    if (detail.simplified_drawing != null) {
      projWork.push('簡易図化 (' + detail.simplified_drawing_output + ') ' + detail.simplified_drawing + 'ha');
    }
    if (detail.contour_data != null) {
      projWork.push('等高線 (' + detail.contour_data_output + ') ' + detail.contour_data + 'ha');
    }
    if (detail.longitudinal_data != null) {
      projWork.push('縦横断図 (' + detail.longitudinal_data_output + ') ' + detail.longitudinal_data + '本');
    }

    if (detail.mesh_soil_volume_output != null) {
      projWork.push('土量計算 (' + detail.mesh_soil_volume_output + ')');
    }
    if (detail.simple_orthphoto_output != null) {
      projWork.push('オルソ画像 (' + detail.simple_orthphoto_output + ')');
    }
    if (detail.simple_accuracy_table_output != null) {
      projWork.push('簡易精度管理表 (' + detail.simple_accuracy_table_output + ')');
    }
    if (detail.public_accuracy_table_output != null) {
      projWork.push('公共精度管理表 (' + detail.public_accuracy_table_output + ')');
    }
    setProjDetail(projWork);
  }

  useEffect(() => {
    if (typeof user.roles === 'undefined') {
      history.push("/auth/login");
      return;
    }    
    projectService.getProject(projectId).then(res => {
      if (res.data.message == 'success') {
        const prj = res.data.project;
        // console.log('======= prj :', prj)
        // setProjStatus(prj.status);
        // setProject(prj);
        // projectstitle = prj.title;
        // deliverydate = prj.delivery_date;
        setProjectTitle(prj.title);
        setDeliveryDate(prj.delivery_date);
        fillDetail(prj.detail);
        setClientId(prj.client_id);
        setBusinessId(prj.business_id);
        setProjectOrderFilename(prj.purchase_order_link);
        setProjectInvoiceFilename(prj.invoice_link);

        status = prj.status;
        setProjStatus(status);
        if (status == "作業前" || status == "作業中" || status == "納品中" || status == "検収中")
          setChatting(true);   
      }
    }).catch((err)=>{
      console.log(err);
      history.push("/auth/login");
      return ( <div /> );
    });    

    refreshRequestData();
    refreshDeliveryData();

    // status = project.status;
    // setProjStatus(status);
    // console.log('--------status:', status);
    // if (status == "作業前" || status == "作業中" || status == "納品中" || status == "検収中")
    //   setChatting(true);
  }, [])

  const setStatusStart = () => {
    let setStatus = "作業中";
    setProjStatus(setStatus);
    projectService.setProjectStatus({ project_id: projectId, status: setStatus }).then(({status, data}) => {
      if (status === 200) {
        // window.location.reload();
      }
    })
  }
    
  const setStatusDelivery = () => {
    let setStatus = "納品中";
    setProjStatus(setStatus);
    projectService.setProjectStatus({ project_id: projectId, status: setStatus }).then(({ status, data }) => {
      if (status === 200) {
        // window.location.reload();
      }
    })
  }

  const setStatusRequest = () => {
    let setStatus = "検収中";
    setProjStatus(setStatus);
    projectService.setProjectStatus({ project_id: projectId, status: setStatus }).then(({ status, data }) => {
      if (status === 200) {
        // window.location.reload();
      }
    })
  }

  const setStatusComplete = () => {
    let setStatus = "完了";
    setProjStatus(setStatus);
    setInProgress(true);

    projectService.setProjectStatus({ project_id: projectId, status: setStatus }).then(({ status, data }) => {
      // console.log('--------', status, ',', data);
      if (status === 200) {
        // window.location.reload();
        history.push("/admin/dashboard");
      }
      setCompleteProjectModal(false);
      setInProgress(false);
    }).catch((err) => {
      console.log(err);
      setCompleteProjectModal(false);
      setInProgress(false);
    })
  }

  const downloadFile = (data, $filename) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', $filename); //or any other extension
    document.body.appendChild(link);
    link.click();
  }

  const downloadOrder = () => {
    projectService.downloadOrder(projectId).then(({ status, data }) => {
      if (status === 200) {
        downloadFile(data, projectOrderFilename);
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const downloadInvoice = () => {
    projectService.downloadInvoice(projectId).then(({ status, data }) => {

      if (status === 200) {
        downloadFile(data, projectInvoiceFilename);
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const downloadRequestData = (id, filename, number) => {
    // console.log('download:', id);
    downloadButtons.push(number);
    setIndexDownloadButton([...indexDownloadButton, number]);
    projectService.downloadRequestData(id).then(({ status, data }) => {
      if (status === 200) {
        downloadFile(data, filename);
      }
      clearDownloadUpload(number);
    }).catch((err) => {
      console.log(err);
      clearDownloadUpload(number);
    })
  }

  const downloadDeliveryData = (id, filename, number) => {
    // console.log('download:', id);
    downloadButtons.push(number);
    setIndexDownloadButton([...indexDownloadButton, number]);
    projectService.downloadDeliveryData(id).then(({ status, data }) => {
      if (status === 200) {
        downloadFile(data, filename);
      }
      clearDownloadUpload(number);
    }).catch((err) => {
      console.log(err);
      clearDownloadUpload(number);
    })
  }

  const submitRequestData = (e, indexButton) => {
    const file = e.target.files[0];
    submitUploadData(file, 0, indexButton);
  }

  const submitDeliveryData = (e, indexButton) => {
    const file = e.target.files[0];
    submitUploadData(file, 1, indexButton);
  }

  const submitUploadData = (file, type, indexButton) => {
    if (beforeUpload(file, type, indexButton)) {
      uploadButtons.push(indexButton);
      let fullNameFile = file.name;
      if (fullNameFile.length > 15) {
        let strNeedReplace = fullNameFile.substring(7, fullNameFile.length - 7);
        fullNameFile = fullNameFile.replace(strNeedReplace, '...');
      }
      percentageButtons.push({[indexButton]: 5, textButton: 'アップロード中 (' + fullNameFile + ')'});
      setPercentUploadButton(percentageButtons);
      setIndexUploadButton([...indexUploadButton, indexButton]);
      uploadFileToS3(file, type, indexButton);
    }
  }

  const beforeUpload = (file, indexButton) => {
    if (file === 'undefined') {
      showNotification('br', '登録失敗', 'danger');
      clearButtonUpload(indexButton);
      return false;
    } else if (file.size > process.env.REACT_APP_MAX_SIZE_FILE_UPLOAD) {
      showNotification('br', '一度にアップロードできるのは50GBまでです。', 'danger');
      clearButtonUpload(indexButton);
      return false;
    } else if (
      file.size > process.env.REACT_APP_RECOMMENT_FILE_SIZE_UPLOAD
      && !window.confirm('アップロードファイルが1GB以上です。アップロードに時間がかかる場合があります。続行する場合はOKを押してください。')
    ) {
      clearButtonUpload(indexButton);
      return false;
    }
    return true;
  }

  const uploadFileToS3 = (file, type, indexButton) => {
    const formFileData = new FormData();
    formFileData.append('fileSize', file.size);
    formFileData.append('type', type);
    projectService.checkTotalFileSizeOfUser(projectId, formFileData).then(({ status, data }) => {
      if (status === 200) {
        uploadProgress(file, type, indexButton);
      } else if (status === 422) {
        showNotification('br', data.message, 'danger');
        clearButtonUpload(indexButton);
      } else {
        showNotification('br', '登録失敗', 'danger');
        clearButtonUpload(indexButton);
      }
    }).catch((err) => {
      console.log(err);
      showNotification('br', '登録失敗', 'danger');
      clearButtonUpload(indexButton);
    })
  }

  const uploadProgress = (file, type, indexButton) => {
    const params = {
      Bucket: process.env.REACT_APP_AWS_BUCKET,
      Key: projectId + '/' + file.name,
      Body: file
    };
    const clientUploadS3 = new Upload({
      client: s3Client,
      leavePartOnError: false,
      params: params,
    });
    clientUploadS3.on("httpUploadProgress", (progress) => {
      let loaded = progress.loaded;
      let total = progress.total;
      let percent = Math.floor((loaded / total) * 100);
      if (percent > 5) {
        const objIndex = percentageButtons.findIndex(key => Object.keys(key).includes(indexButton));
        const object = [...percentageButtons];
        object[objIndex][indexButton] = percent;
        setPercentUploadButton(object);
      }
      if (percent === 100) {
        saveFileDataToDb(file, type, indexButton);
      }
    });
    clientUploadS3.done();
  }

  const saveFileDataToDb = (file, type, indexButton) => {
    const formData = new FormData();
    formData.append('fileName', file.name);
    formData.append('fileSize', file.size);
    if (type) {
      saveDeliveryDataToDb(formData, indexButton);
    } else {
      saveRequestDataToDb(formData, indexButton);
    }
  }

  const saveRequestDataToDb = (formData, indexButton) => {
    projectService.uploadRequestData(projectId, formData).then(({ status, data }) => {
      let alertMessage = '登録失敗';
      let alertStatus = 'danger';
      if (status === 200) {
        refreshRequestData();
        alertMessage = '登録完了';
        alertStatus = 'success';
      } else if (status === 405) {
        alertMessage = data.message;
      }
      showNotification('br', alertMessage, alertStatus);
    }).catch((err) => {
      console.log(err);
      showNotification('br', '登録失敗', 'danger');
    })
    clearButtonUpload(indexButton);
  }

  const saveDeliveryDataToDb = (formData, indexButton) => {
    projectService.uploadDeliveryData(projectId, formData).then(({ status, data }) => {
      let alertMessage = '登録失敗';
      let alertStatus = 'danger';
      if (status === 200) {
        refreshDeliveryData();
        alertMessage = '登録完了';
        alertStatus = 'success';
      } else if (status === 405) {
        alertMessage = data.message;
      }
      showNotification('br', alertMessage, alertStatus);
    }).catch((err) => {
      console.log(err);
      showNotification('br', '登録失敗', 'danger');
    })
    clearButtonUpload(indexButton);
  }

  const clearButtonUpload = (indexButton) => {
    uploadButtons = uploadButtons.filter((e) => e !== indexButton);
    setIndexUploadButton(uploadButtons);
    const clearObjects = percentageButtons.filter((e) => {
      return !Object.keys(e).includes(indexButton);
    });
    percentageButtons = clearObjects;
    setPercentUploadButton(clearObjects);
  }

  const clearDownloadUpload = (number) => {
    downloadButtons = downloadButtons.filter((e) => e !== number);
    setIndexDownloadButton(downloadButtons);
  }

  const deleteRequestData = (id) => {
    if (window.confirm('このファイルを削除しますか。')) {
      projectService.deleteRequestData(id).then(({ status, data }) => {
        let alertMessage = '削除が失敗しました。';
        let alertStatus = 'danger';
        if (status === 200) {
          alertMessage = '削除が成功しました。';
          alertStatus = 'success';
          refreshRequestData();
        }
        showNotification('br', alertMessage, alertStatus);
      }).catch((err) => {
        console.log(err);
        showNotification('br', '削除が失敗しました。', 'danger');
      })
    }
  }

  const deleteDeliveryData = (id) => {
    if (window.confirm('このファイルを削除しますか。')) {
      projectService.deleteDeliveryData(id).then(({ status, data }) => {
        let alertMessage = '削除が失敗しました。';
        let alertStatus = 'danger';
        if (status === 200) {
          alertMessage = '削除が成功しました。';
          alertStatus = 'success';
          refreshDeliveryData();
        }
        showNotification('br', alertMessage, alertStatus);
      }).catch((err) => {
        console.log(err);
        showNotification('br', '削除が失敗しました。', 'danger');
      })
    }
  }

  const allowRemoveFile = (userId) => {
    if (user.roles[0].id == 1 || user.id === userId) {
      return true;
    }
    return false;
  }

  const classes = useStyles();
 
  const UploadRequestButtons = () => {
    return requestDataLink.map((data, index) => {
      let number = 'downloadRequestData' + (index + 1);
      let fullNameFile = data.request_data_link;
      if (fullNameFile.length > 15) {
        let strNeedReplace = fullNameFile.substring(7, (fullNameFile.length - 7));
        fullNameFile = fullNameFile.replace(strNeedReplace, '...');
      }
      return (
        <div className={classes.flexContent} key={index}>
          <Button style={{ backgroundColor: "lightgrey", color: "blue", padding: "10px 25px", textTransform: "none"}}
                  onClick={() => downloadRequestData(data.id, data.request_data_link, number)}
                  disabled={indexDownloadButton.includes(number)}
          >
            <u>{indexDownloadButton.includes(number) ? "ダウンロード中" + "（" + fullNameFile + "）" : fullNameFile}</u>
          </Button>
          {allowRemoveFile(clientId) &&
            <Button className={classes.roundBtn} onClick={() => deleteRequestData(data.id)}>
              <DeleteForeverIcon />
            </Button>
          }
        </div>
      )
    });
  }

  const NewUploadRequestButtons = (props) => {
    const { count } = props;
    let max = 10 - count;
    let articles = [];

    for (let i = 0; i < max; i++) {
      articles.push(i);
    }
    return articles.map((article, index) => {
      let number = 'requestData' + (index + 1);
      let objIndex = percentUploadButton.findIndex(key => Object.keys(key).includes(number));
      return (
        <div className={classes.flexContent} key={index}>
          <Button
            style={{ backgroundColor: "lightgrey", color: "black", padding: "10px 25px" }}
            onClick={() => document.getElementById('uploadRequestButton' + number).click()}
            disabled={indexUploadButton.includes(number)}>
            {objIndex >= 0 && indexUploadButton.includes(number) ? percentUploadButton[objIndex].textButton : 'アップロード'}
            <span className={classes.percentage} style={{ width: (objIndex >= 0 && indexUploadButton.includes(number) ? percentUploadButton[objIndex][number] : 0) + "%" }}></span>
          </Button>
          <input id={'uploadRequestButton' + number} onChange={(e) => submitRequestData(e, number)} multiple={false} type='file' hidden disabled={indexUploadButton.includes(number)}/>
        </div>
      )
    });
  }
 
  const UploadDeliveryButtons = () => {
    return deliveryDataLink.map((data, index) => {
      let number = 'downloadDeliveryData' + (index + 1);
      let fullNameFile = data.deliverable_data_link;
      if (fullNameFile.length > 15) {
        let strNeedReplace = fullNameFile.substring(7, (fullNameFile.length - 7));
        fullNameFile = fullNameFile.replace(strNeedReplace, '...');
      }
      return (
        <div className={classes.flexContent} key={index}>
          <Button style={{ backgroundColor: "lightgrey", color: "blue", padding: "10px 25px", textTransform: "none" }}
                  onClick={() => downloadDeliveryData(data.id, data.deliverable_data_link, number)}
                  disabled={indexDownloadButton.includes(number)}
          >
            <u>{indexDownloadButton.includes(number) ? "ダウンロード中" + "（" + fullNameFile + "）" : fullNameFile}</u>
          </Button>
          {allowRemoveFile(businessId) &&
            <Button className={classes.roundBtn} onClick={() => deleteDeliveryData(data.id)}>
              <DeleteForeverIcon />
            </Button>
          }
        </div>
      )
    });
  }

  const NewUploadDeliveryButtons = (props) => {
    const { count } = props;
    let max = 10 - count;
    let deliveryArticles = [];

    for (let i = 0; i < max; i++) {
      deliveryArticles.push(i);
    }
    return deliveryArticles.map((article, index) => {
      let number = 'deliveryData' + (index + 1);
      let objIndex = percentUploadButton.findIndex(key => Object.keys(key).includes(number));
      return (
        <div className={classes.flexContent} key={index}>
          <Button
            style={{ backgroundColor: "lightgrey", color: "black", padding: "10px 25px" }}
            onClick={() => document.getElementById('uploadDeliveryButton' + number).click()}
            disabled={indexUploadButton.includes(number)}>
            {objIndex >= 0 && indexUploadButton.includes(number) ? percentUploadButton[objIndex].textButton : 'アップロード'}
            <span className={classes.percentage} style={{ width: (objIndex >= 0 && indexUploadButton.includes(number) ? percentUploadButton[objIndex][number] : 0) + "%" }}></span>
          </Button>
          <input id={'uploadDeliveryButton' + number} onChange={(e) => submitDeliveryData(e, number)} multiple={false} type='file' hidden disabled={indexUploadButton.includes(number)}/>
        </div>
      )
    });
  }

  return (
    user.roles == null ? <div /> :
    <div>
      <Dialog
       open={completeProjectModal}
        TransitionComponent={Transition}
        onClose={() => setCompleteProjectModal(false)}
      >
        <DialogContent>
        <DialogTitle
          disableTypography
          style={{ textAlign: "center" }}
        >
          <h4><b>検収を完了しますか ？</b></h4>
        </DialogTitle>
        <DialogActions
          className={
            classes.modalFooter + " " + classes.modalFooterCenter
          }
        >
          <Button
            onClick={() => setCompleteProjectModal(false)}
            style={{ backgroundColor: "lightgrey", color: "black" }}
          >
            キャンセル
          </Button>
          <AdornedButton
            loading={inProgress}
            style={{ backgroundColor: "#e12e3e" }}
            onClick={setStatusComplete}
            disabled={inProgress}
            >
            完了する
          </AdornedButton>
          {/* <Button
            style={{ backgroundColor: "#e12e3e" }}
            onClick={setStatusComplete}
          >
            完了する
          </Button> */}
        </DialogActions>     
        </DialogContent>       
      </Dialog>
      <Card>
          <Success>{msg}</Success>
          <div className={classes.timelinecontent}>
            <GridContainer justify="center">
                <GridItem xs={12} sm={7}>
                  <p>案件名</p>
                  <h4><b>{projectTitle}</b></h4>
                </GridItem>
                <GridItem xs={12} sm={3}>
                   <p>目安納品日</p>
                   <h4><b>{deliveryDate}</b></h4>
                </GridItem>
                <GridItem xs={12} sm={2}>
                    {user.roles[0].id == 2 &&
                    <Button style={{ backgroundColor: "#e12e3e" }} onClick={() => setCompleteProjectModal(true)}                    
                      disabled={projStatus != '検収中'}>
                      検収完了
                    </Button>
                    }
                    {user.roles[0].id == 1 &&
                    <Button style={{ backgroundColor: "#e12e3e", padding: "12px 15px"}} onClick={setStatusRequest}
                     disabled={projStatus != '納品中'}>
                      検収リクエスト
                    </Button>
                    }
                    {user.roles[0].id == 3 &&
                    <Button style={{ backgroundColor: "#e12e3e" }} onClick={setStatusDelivery}
                      disabled={projStatus != '作業中'}>
                      納品申請
                    </Button>
                    }
                </GridItem>
            </GridContainer>
            <div className={classes.underline}></div>
            <GridContainer justify="center">
                {user.roles[0].id !== 3  &&
                <GridItem xs={12} sm={3} md={3}>
                  <b>発注請書</b>
                  <div>
                    <Button style={{ backgroundColor: "lightgrey", color: "black" }} onClick={downloadOrder}>
                      ダウンロード
                    </Button>
                  </div>
                  <p style={{ margin: "30px 0 0 0" }}><b>請求書</b></p>
                  <div>
                    <Button style={{ backgroundColor: "lightgrey", color: "black" }} onClick={downloadInvoice}
                    disabled = {projStatus != "完了"}>
                      ダウンロード
                    </Button>
                  </div>
                </GridItem>
                }
                <GridItem xs={12} sm={3}>
                  <b>必要成果物</b>
                    {
                      projDetail.map((item, key) => {
                        return (
                          <div key={key}>
                            <Button style={{ backgroundColor: "lightgrey", color: "black", textTransform: "none", padding: "12px 15px" }} key={key}>
                              {item}
                            </Button>
                          </div>
                        )
                      })
                    }
                </GridItem>
                <GridItem xs={12} sm={3}>
                  <b>依頼データ</b>
                  <UploadRequestButtons />
                  {user.roles[0].id <= 2 && <NewUploadRequestButtons count={requestDataLink.length} />}
                </GridItem>
                <GridItem xs={12} sm={3}>
                  <b>成果物データ</b>
                  <UploadDeliveryButtons />
                  {user.roles[0].id !== 2 && <NewUploadDeliveryButtons count={deliveryDataLink.length} />}
                </GridItem>
                {user.roles[0].id == 3 &&
                <GridItem xs={12} sm={3}>
                  <div style={{ textAlign: "center", paddingTop: "50px" }}>
                    <Button style={{ backgroundColor: "white", color: "#e12e3e", border: "1px solid red" }} onClick={setStatusStart}
                      disabled={projStatus != '作業前'}>
                      作業開始
                    </Button>
                  </div>
                </GridItem>
                }
            </GridContainer>
            <div className={classes.description}>
              <p>※ ファイルは .zip や .rar などに圧縮するようにお願いします</p>
            </div>  
            <div className={classes.underline}></div>
            {/* {chatting ? (
              <GridContainer justify="center">
                <ChatContent projectId = {projectId} />
              </GridContainer>
            ) : (
             <div />
            )} */}
          </div>
          <Snackbar
            place={place}
            color={alertStatus}
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

const mapStateToProps = () => ({})

// const mapStateToProps = (state, ownProps) => ({
//   user: state.auth.user,
//   project: ownProps.project
// })

const mapDispatchToProps = ({})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TimelineContent))
