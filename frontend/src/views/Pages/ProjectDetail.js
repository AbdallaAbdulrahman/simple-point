import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { withRouter, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Link, animateScroll as scroll } from "react-scroll";

import * as projectService from 'services/projectService';
import * as storageService from '../../services/storageService';

import Statusline from "views/Components/Statusline.js";
import TimelineContent from "views/Components/TimelineContent.js";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import styles from "views/Components/style/mainStyle.js";

const useStyles = makeStyles(styles);

const ProjectDetail = ({user, history}) => {
  const classes = useStyles();
  // const location = useLocation();
  const [projStatus, setProjStatus] = React.useState('');
  const [project, setProject] = React.useState([]);


  let path = window.location.pathname;
  let id = path.slice(21);
  let projectId = path.slice(21);

  // console.log('---------- type: ', typeof projectId);
  if (typeof projectId === 'object')
    projectId = projectId.id;

  useEffect(() => {
    // console.log('======= ProjectDetail prj id:', projectId)
    scroll.scrollToTop();
    storageService.setStorage('referrer', path);

    projectService.getProjects().then(res => {
      let prj = res.data.projects.find(o => o.id == id);
      if (prj) {
        projectId = prj.id;   // verify id 
      } else {
        storageService.removeStorage('referrer');
        history.push("/admin/dashboard/");
      }
    });

    projectService.getProject(projectId).then(res => {
      if (res.data.message == 'success') {
        const prj = res.data.project;
        setProjStatus(prj.status);
        setProject(prj);
      }
    }).catch((err)=>{
      console.log(err);
      history.push("/auth/login");
      return ( <div /> );
    });
  }, [])

  return (
    <div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={9}>
          <a href="/admin/dashboard/" className={classes.tiltleRedText} rel={"noindex nofollow"}>
            <i className="fas fa-angle-left"></i>
            <b>&nbsp;&nbsp;案件一覧に戻る</b>
          </a>
        </GridItem>
      </GridContainer>
      <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={9}>
            { project != null && <Statusline status={projStatus} /> }
            {/* { project != null && <TimelineContent user={user} project={project} /> } */}
            { project != null && <TimelineContent user={user} projectId={projectId} /> }
          </GridItem>
      </GridContainer>
    </div>
  );
}


// const mapStateToProps = () => ({})
const mapStateToProps = (state) => ({
  user: state.auth.user,
})
const mapDispatchToProps = ({})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProjectDetail))