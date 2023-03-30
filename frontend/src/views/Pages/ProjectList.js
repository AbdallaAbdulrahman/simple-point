import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { withRouter, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import AttachFileOutlinedIcon from '@material-ui/icons/AttachFileOutlined';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import * as userService from 'services/userService';
import * as projectService from 'services/projectService';

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Table from "components/Table/Table.js";
import Button from "components/CustomButtons/Button.js";
import Button1 from "components/CustomButtons/Button1.js";
import Button2 from "components/CustomButtons/Button2.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import styles from "../Components/style/mainStyle";

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ProjectList = ({user}) => {

    const [assignProjectModal, setAssignProjectModal] = React.useState(false);
    const [deleteProjectModal, setDeleteProjectModal] = React.useState(false);
    const [businessData, setBusinessData] = React.useState([]);
    const [projectId, setProjectId] = React.useState(0);
    const history = useHistory();

    const orderButtons = (id) => [
        { color: "rose", icon: AttachFileOutlinedIcon },
      ].map((prop, key) => {
        return (
          <Button2
            color={prop.color}
            simple
            key={key}
            onClick={(e) => {
              e.stopPropagation()
              downloadOrder(id)
            }}
          >
            <prop.icon />
          </Button2>
        );
      });

      const invoiceButtons = (id, status) => [
        { color: "rose", icon: AttachFileOutlinedIcon },
      ].map((prop, key) => {
        return (
          <Button2
            color={prop.color}
            simple
            key={key}
            onClick={(e) => {
              e.stopPropagation()
              downloadInvoice(id)
            }}
            disabled = {status != "完了"}
          >
            <prop.icon />
          </Button2>
        );
      });

<<<<<<< HEAD
      const assignButtons = (id, bizId) => [
        { color: "rose"},
      ].map((prop, key) => {
        return (
          <Button2
            color={prop.color}
            simple
            key={key}
            onClick={(e) => {
              e.stopPropagation()
              clickOpenAssignModal(id)
            }}
            disabled = {bizId != null}
          >
           割当
          </Button2>
        );
=======
      const assignButtons = (id, bizId, projectStatus) => [
        { color: "rose"},
      ].map((prop, key) => {
        if (bizId != null){
          return (
            <Button2
              color={prop.color}
              simple
              key={key}
              onClick={(e) => {
                e.stopPropagation()
                clickOpenAssignModal(id)
              }}
              disabled = {bizId != null && projectStatus != '作業前'}
            >
             再割当
            </Button2>
          );
        }else {
          return (
            <Button2
              color={prop.color}
              simple
              key={key}
              onClick={(e) => {
                e.stopPropagation()
                clickOpenAssignModal(id)
              }}
              disabled = {bizId != null}
            >
             割当
            </Button2>
          );
        }
        
>>>>>>> 8a42e00a9af7f07e86a02141368fed3b67471b95
      });
    
      const removeButtons = (id) => [
        { color: "rose", icon: DeleteForeverIcon},
      ].map((prop, key) => {
        return (
          <Button2
            color={prop.color}
            simple
            key={key}
            style={{ padding: "none" }}
            onClick={(e) => {
              e.stopPropagation()
              clickOpenDeleteModal(id)
            }}
          >
            <prop.icon />
          </Button2>
        );
      });
   
    const [projectsTableData, setProjectsTableData] = React.useState([]);

    const clickOpenDeleteModal = (id) => {
      setProjectId(id);

      setDeleteProjectModal(true);
    }

    const clickOpenAssignModal = (id) => {
      setProjectId(id);
<<<<<<< HEAD

=======
      
>>>>>>> 8a42e00a9af7f07e86a02141368fed3b67471b95
      setAssignProjectModal(true);
    }

    const downloadFile = (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file.pdf'); //or any other extension
      document.body.appendChild(link);
      link.click();
    }

    const downloadOrder = (projectId) => {
      projectService.downloadOrder(projectId).then(({ status, data }) => {
        if (status === 200) {
          downloadFile(data);
        }
      }).catch((err) => {
        console.log(err);
      })
    }
  
    const downloadInvoice = (projectId) => {
      projectService.downloadInvoice(projectId).then(({ status, data }) => {
  
        if (status === 200) {
          downloadFile(data);
        }
      }).catch((err) => {
        console.log(err);
      })
    }

    const clickSubmitDelete = () => {
      projectService.deleteProject({ id: projectId }).then(res => {
        if (res.data.message == 'success') {
          console.log('Success to remove');
          fetchProjects();
        }
      }).catch((err)=>{
        console.log(err);
      });

      setDeleteProjectModal(false);
    }

    const clickSubmitAssign = (userId) => {
      projectService.assignProject({ project_id: projectId, business_id: userId }).then(res => {
        if (res.data.message == 'success') {
          console.log('Success to assign');
        }
      }).catch((err)=>{
        console.log(err);
      });

      setAssignProjectModal(false);
    }    
    
    function currencyPrettyPrint(yen) {
      return '¥' + yen.toLocaleString("en");
    }
    const fetchProjects = () => {
      projectService.getProjects().then(res => {
        console.log('------- role: ', res.data.projects, user.roles[0].id)
        if (res.data.message == 'success' && res.data.projects){
            setProjectsTableData(res.data.projects.map((project, index) => {
                switch (user.roles[0].id) {
                    case 1:   // Admin
<<<<<<< HEAD
                        return [index+1, project.title, project.company, currencyPrettyPrint(project.amount),  project.created_date, project.delivery_date, project.status, assignButtons(project.id, project.business_id), removeButtons(project.id),
=======
                        return [index+1, project.title, project.company, currencyPrettyPrint(project.amount),  project.created_date, project.delivery_date, project.status, assignButtons(project.id, project.business_id, project.status), removeButtons(project.id),
>>>>>>> 8a42e00a9af7f07e86a02141368fed3b67471b95
                        <Button2
                        color="rose"
                        simple
                          onClick={() => {
                            let obj = res.data.projects.find(o => o.id === project.id);
                            // history.push("/admin/projectdetail/" + obj.id + "");
                            history.push({
                              pathname: "/admin/projectdetail/" + obj.id,
                              state: obj.id
                            });
                          }}
                        >詳細</Button2>,
                        project.id
                      ]
                    case 2:   // Client
<<<<<<< HEAD
                        return [index+1, project.title, currencyPrettyPrint(project.amount), project.created_date, project.delivery_date, orderButtons(project.id), invoiceButtons(project.id, project.status), project.status,
                        <Button2
                        color="rose"
                        simple
                          onClick={() => {
                            let obj = res.data.projects.find(o => o.id === project.id);
                            // history.push("/admin/projectdetail/" + obj.id + "");
                            history.push({
                              pathname: "/admin/projectdetail/" + obj.id,
                              state: obj.id
                            });
                          }}
                        >詳細</Button2>,
                        project.id
=======
                        return [
                          index+1, 
                          project.title, 
                          currencyPrettyPrint(project.amount), 
                          project.created_date, 
                          project.delivery_date, 
                          orderButtons(project.id), 
                          invoiceButtons(project.id, project.status), 
                          project.status,
                          <Button2
                            color="rose"
                            simple
                              onClick={() => {
                                let obj = res.data.projects.find(o => o.id === project.id);
                                // history.push("/admin/projectdetail/" + obj.id + "");
                                history.push({
                                  pathname: "/admin/projectdetail/" + obj.id,
                                  state: obj.id
                                });
                              }}
                            >詳細
                          </Button2>,
                          project.id
>>>>>>> 8a42e00a9af7f07e86a02141368fed3b67471b95
                      ]
                    case 3:   // Business
                        return [index+1, project.title, project.created_date, project.delivery_date, project.status,
                        <Button2
                        color="rose"
                        simple
                          onClick={() => {
                            let obj = res.data.projects.find(o => o.id === project.id);
                            // history.push("/admin/projectdetail/" + obj.id + "");
                            history.push({
                              pathname: "/admin/projectdetail/" + obj.id,
                              state: obj.id
                            });
                          }}
                        >詳細</Button2>,
                        project.id
                      ]
                    default:
                        break;
                }
            }))
        }
        else {
          console.log('error');
        }
      }).catch((err)=>{
        console.log(err);
      })
    }

    useEffect(() => {
      fetchProjects();

      user.roles[0].id == 1 && userService.getBusinesspeople().then(res => {
        console.log(res.data, 'businesses')
        if (res.data.message == 'success' && res.data.businesses){
          setBusinessData(res.data.businesses.map((businessman, key) => {
            return[key+1, businessman.id, businessman.company]
          }))
        }
        else {
          console.log('error');
        }
      }).catch((err)=>{
        console.log(err);
      })
    }, [])

    const classes = useStyles();

    return (
        <div>
<<<<<<< HEAD
=======
            {/* modal when click 割当 / Allocation */}
>>>>>>> 8a42e00a9af7f07e86a02141368fed3b67471b95
            <Dialog
              classes={{
                root: classes.center + " " + classes.modalRoot,
                paper: classes.modal
              }}
              open={assignProjectModal}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => setAssignProjectModal(false)}
              aria-labelledby="classic-modal-slide-title"
              aria-describedby="classic-modal-slide-description"
            >
              <DialogTitle
                id="classic-modal-slide-title"
                disableTypography
                className={classes.modalHeader}
                style={{ borderBottom: "1px solid lightgrey" }}
              >
                <h4><b>割当アカウントを選択してください</b></h4>
              </DialogTitle>
              <DialogContent
                id="classic-modal-slide-description"
                className={classes.modalBody}
                style={{ padding: "0 24px 15px 24px" }}
              >
                {/* {businessData} */}
                {businessData.map((arr, key) => {
                  return (
                  <GridContainer key={key} style={{ borderBottom: "1px solid lightgrey" }}>
                    <GridItem xs={12} sm={6} style={{ display: "flex", alignItems: "center" }}>{arr[2]}</GridItem>
                    <GridItem xs={12} sm={6}>
                      <Button1 style={{ backgroundColor: "#e12e3e", margin: "12px 0", padding: "10px 30px" }} 
                        onClick={() => clickSubmitAssign(arr[1])}
                      >
                        選択
                      </Button1>
                    </GridItem>
                  </GridContainer>  
                )}
                )}
              </DialogContent>
            </Dialog>

<<<<<<< HEAD
=======
            {/* modal when click Delete Modal */}
>>>>>>> 8a42e00a9af7f07e86a02141368fed3b67471b95
            <Dialog
              open={deleteProjectModal}
              TransitionComponent={Transition}
              onClose={() => setDeleteProjectModal(false)}
            >
              <DialogContent>
              <DialogTitle
                disableTypography
                style={{ textAlign: "center" }}
              >
                <h4><b>本当に削除しますか？</b></h4>
              </DialogTitle>
              <DialogActions
                className={
                  classes.modalFooter + " " + classes.modalFooterCenter
                }
              >
                <Button
                  onClick={() => setDeleteProjectModal(false)}
                  color="transparent"
                  style={{ backgroundColor: "lightgrey", color: "black" }}
                >
                  キャンセル
                </Button>
                <Button
                  onClick={() => clickSubmitDelete()}
                  style={{ backgroundColor: "#e12e3e" }}
                >
                  削除する
                </Button>
              </DialogActions> 
              </DialogContent>
            </Dialog>
                  
            <Card>
                <CardBody>
                    {user.roles[0].id == 3 && 
                        <Table
                            className={ classes.fontSize }
                            tableHeaderColor="primary"
                            tableHead={["No.", "案件名", "発注日", "目安納品日", "ステータス"]}
                            tableData={projectsTableData}
                            coloredColls={[4]}
                            onRowClick={(rowData) => {
                              history.push({
                                pathname: "/admin/projectdetail/" + rowData[6],
                                state: rowData[6]
                              });       
                            }}
                            colorsColls={["primary"]}
                        />
                    }
                    {user.roles[0].id == 2 && 
                         <Table
                            className={ classes.fontSize }
                            tableHeaderColor="primary"
                            tableHead={["No.", "案件名", "発注金額", "発注日", "目安納品日", "発注請書", "請求書", "ステータス", "操作"]}
                            tableData={projectsTableData}
                            coloredColls={[7]}
                            onRowClick={(rowData) => {
                              history.push({
                                pathname: "/admin/projectdetail/" + rowData[9],
                                state: rowData[9]
                              });
                            }}
                            colorsColls={["primary"]}
                       />
                    }
                    {user.roles[0].id == 1 && 
                         <Table
                            className={ classes.fontSize }
                            tableHeaderColor="primary"
                            tableHead={["No.", "案件名", "発注企業", "発注金額", "発注日", "目安納品日", "ステータス", "割当", "操作"]}
                            tableData={projectsTableData}
                            coloredColls={[6]}
                            onRowClick={(rowData) => {
                              history.push({
                                pathname: "/admin/projectdetail/" + rowData[10],
                                state: rowData[10]
                              });              
                            }}
                            colorsColls={["primary"]}
                       />
                    }
                </CardBody>
            </Card>
        </div>
    );
}

const mapStateToProps = (state, ownProps) => ({
    user: state.auth.user
})
  
const mapDispatchToProps = ({})
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProjectList))