import React, {useContext, useEffect, useState} from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import AddAlert from "@material-ui/icons/AddAlert";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import logo from "assets/img/auth_logo.png";

import * as authAction from "../../redux/actions/auth";
import * as authService from '../../services/authService';


import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";

const useStyles = makeStyles(styles);

const ResetPassPage = (props) => {

  const [show, setShow] = useState(false);
  const [place, setPlace] = useState('br');
  const [message, setMessage] = useState('');

  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const [recoverPassword, setrecoverPassword] = React.useState("");
  const [recoverPasswordState, setrecoverPasswordState] = React.useState("");
  const [recoverConfirmPassword, setrecoverConfirmPassword] = React.useState("");
  const [recoverConfirmPasswordState, setrecoverConfirmPasswordState] = React.useState("");

  const userId = props.match.params.userId;
  const hash = props.match.params.hash;
  const query = props.location.search;
  const token = new URLSearchParams(query).get('token');

  const verifyPasswd = (value, length) => {
    if (value.length >= 8 && value.length <= 16) {
      return true;
    }
    return false;
  };

  const redirectLogin = () => {
    props.history.push({
      pathname: "/auth/login"
    });
  }

  const resetClick = () => {
    if (recoverPasswordState !== "success") {
        showNotification('br', '入力されたパスワードが正しくありません。', 'danger');
    } else if (recoverConfirmPasswordState !== "success") {
        showNotification('br', '入力されたパスワードが一致しません。', 'danger');
    } else {
      authService.passwordReset({userId: userId, hash: hash, token: token, password: recoverPassword}).then(result => {
        if(result.status === 200) {
          setTimeout(() => {
            props.history.push({
              pathname: "/auth/login",
              msg: result.data.message
            });
          }, 1000);
        } else {
          redirectLogin();
        }
      }).catch((err)=>{
        showNotification('br', 'サーバーが応答しません。', 'danger');
      })
    }
  };

  React.useEffect(() => {
    let id = setTimeout(function() {
      setCardAnimation("");
    }, 700);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.clearTimeout(id);
    };
  });

  useEffect(() =>  {
    authService.verifyExpiresResetPassToken({userId: userId, token: token}).then(result => {
      if (result.status !== 200) {
        redirectLogin();
      }
    }).catch((err) => {
      redirectLogin();
    })
  }, [])

  const classes = useStyles();

  const showNotification = (place, message) => {
    setPlace(place);
    setMessage(message);
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 6000);
  };

  return (
    <div className={classes.container}>
      <div style={{ textAlign: "center" }}>
        <img src={logo} alt="..." width="23%"/>
      </div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={5}>
            <Card login className={classes[cardAnimaton]}>
              <CardHeader className={classes.cardHeader}>
                <div className={classes.bottomeLine}>
                  <span><b>パスワードの再設定</b></span>
                </div>
              </CardHeader>
              <CardBody>
                <form>
                    <br />
                    <span style={{ fontSize: "12px" }}>新たなパスワードを入力してください。</span>
                    <CustomInput
                        success={recoverPasswordState === "success"}
                        error={recoverPasswordState === "error"}
                        labelText="新しいパスワード *"
                        id="recoverpassword"
                        formControlProps={{
                        fullWidth: true
                        }}
                        inputProps={{
                        onChange: event => {
                            if (verifyPasswd(event.target.value, 1)) {
                            setrecoverPasswordState("success");
                            } else {
                            setrecoverPasswordState("error");
                            }
                            setrecoverPassword(event.target.value);
                        },
                        type: "password",
                        autoComplete: "off"
                        }}
                    />
                    <CustomInput
                        success={recoverConfirmPasswordState === "success"}
                        error={recoverConfirmPasswordState === "error"}
                        labelText="新しいパスワード (確認用) *"
                        id="recoverconfirmpassword"
                        formControlProps={{
                        fullWidth: true
                        }}
                        inputProps={{
                        onChange: event => {
                            if (recoverPassword === event.target.value) {
                            setrecoverConfirmPasswordState("success");
                            } else {
                            setrecoverConfirmPasswordState("error");
                            }
                            setrecoverConfirmPassword(event.target.value);
                        },
                        type: "password",
                        autoComplete: "off"
                        }}
                    />
                    <span style={{ fontSize: "10px" }}>※8〜16文字の半角英数字で入力してください.</span>
                    <div className={classes.greyline}></div>
                    <div>
                        <Button style={{ backgroundColor: "#e12e3e", float: "right" }} onClick={resetClick}>
                            <b>送信する</b>
                        </Button>
                    </div>
                </form>
              </CardBody>
            </Card>
            <Snackbar
              place={place}
              color="danger"
              icon={AddAlert}
              message={message}
              open={show}
              closeNotification={() => setShow(false)}
              close
            />
        </GridItem>
      </GridContainer>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => ({
  user: state.auth.user
})

const mapDispatchToProps = ({
  ressetPass: authAction.ResetPass,
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ResetPassPage))
