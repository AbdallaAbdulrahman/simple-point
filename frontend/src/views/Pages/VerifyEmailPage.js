import React, {useState, useEffect} from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import logo from "assets/img/auth_logo.png";

import * as authAction from "../../redux/actions/auth";
import * as authService from '../../services/authService';

import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";

const useStyles = makeStyles(styles);

const VerifyEmailPage = (props) => {

  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  React.useEffect(() => {
    let id = setTimeout(function() {
      setCardAnimation("");
    }, 700);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.clearTimeout(id);
    };
  });

  const classes = useStyles();

  const redirectToLogin = () => {
    setTimeout(function() {
      props.history.push({
        pathname: "/auth/login"
      });
    }, 3000);
  }
  
  useEffect(() =>  {
    const userId = props.match.params.userId;
    let query = props.location.search;
    let hash = new URLSearchParams(query).get('hash');
    authService.verifyEmail({userId: userId, hash: hash}).then(result => {
      if (result.status === 200) {
        setMessage(result.data.message);
        setStatus('success');
      } else {
        setMessage('メール認証は失敗します。');
        setStatus('error');
      }
      redirectToLogin();
    }).catch((err) => {
      setMessage('メール認証は失敗します。');
      setStatus('error');
      redirectToLogin();
    })
  }, [])


  return (
    <div className={classes.container}>
      <div style={{ textAlign: "center" }}>
        <img src={logo} alt="..." width="23%"/>
      </div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={5}>
            <Card className={classes[cardAnimaton]}>
              <CardHeader className={classes.cardHeader}>
                <div className={classes.bottomeLine}>
                  <span><b>メール認証</b></span>
                </div>
              </CardHeader>
              <CardBody>
                <div style={{ textAlign: "center", margin: "10px 0"}}>
                  <div style={{ color: status === 'success' ? "#4caf50" : "#e12e3e" }}>
                    <span>{message}</span>
                </div>
                </div>
              </CardBody>
            </Card>
        </GridItem>
      </GridContainer>
      <div style={{ textAlign: "center" }}>
        <p>	サービスのご利用には会員登録が必要です<br/>会員登録は <a href="/auth/register" style={{ color: "#e12e3e", fontWeight: "bold" }} rel={"noindex nofollow"}>こちら</a>
</p>
      </div>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => ({
  user: state.auth.user
})

const mapDispatchToProps = ({
  verifyemail: authAction.VerifyEmail
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(VerifyEmailPage))
