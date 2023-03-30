import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import {httpService} from 'services/httpService';

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import FormLabel from "@material-ui/core/FormLabel";
import Button1 from "components/CustomButtons/Button1.js";
import CustomInput1 from "components/CustomInput/CustomInput1.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import AddAlert from "@material-ui/icons/AddAlert";
import Snackbar from "components/Snackbar/Snackbar.js";

import styles from "../Components/style/mainStyle";

const useStyles = makeStyles(styles);

const PriceList = () => {
  
  const classes = useStyles();
  
  const defPrice = {
    main_amount: 0,
    add_amount: 0,
    main_period: 0,
    add_period: 0
  };
  
  const [mainAmount1, setMainAmount1] = useState("");
  const [addAmount1, setAddAmount1] = useState("");
  const [mainPeriod1, setMainPeriod1] = useState("");
  const [addPeriod1, setAddPeriod1] = useState("");

  const [mainAmount2, setMainAmount2] = useState("");
  const [mainPeriod2, setMainPeriod2] = useState("");
  const [rankAmountA, setRankAmountA] = useState("");
  const [rankAmountB, setRankAmountB] = useState("");
  const [rankAmountC, setRankAmountC] = useState("");
  const [levelAmountA, setLevelAmountA] = useState("");
  const [levelAmountB, setLevelAmountB] = useState("");

  const [mainAmount3, setMainAmount3] = useState("");
  const [addAmount3, setAddAmount3] = useState("");
  const [mainPeriod3, setMainPeriod3] = useState("");
  const [addPeriod3, setAddPeriod3] = useState("");

  const [mainAmount4, setMainAmount4] = useState("");
  const [addAmount4, setAddAmount4] = useState("");
  const [mainPeriod4, setMainPeriod4] = useState("");

  const [mainAmount5, setMainAmount5] = useState("");
  const [mainPeriod5, setMainPeriod5] = useState("");

  const [mainAmount6, setMainAmount6] = useState("");
  const [mainPeriod6, setMainPeriod6] = useState("");

  const [mainAmount7, setMainAmount7] = useState("");
  const [mainPeriod7, setMainPeriod7] = useState("");

  const [mainAmount8, setMainAmount8] = useState("");
  const [mainPeriod8, setMainPeriod8] = useState("");

  const [errorState1, setErrorState1] = React.useState(false);

  const [errorContent1, setErrorContent1] = React.useState("");
  const [errorContent2, setErrorContent2] = React.useState("");
  const [errorContent3, setErrorContent3] = React.useState("");
  const [errorContent4, setErrorContent4] = React.useState("");
  const [errorContent5, setErrorContent5] = React.useState("");
  const [errorContent6, setErrorContent6] = React.useState("");
  const [errorContent7, setErrorContent7] = React.useState("");
  const [errorContent8, setErrorContent8] = React.useState("");

  useEffect(() => {
    httpService.get('api/admin/prices').then(result => {
      if (result.data.message == 'success' && result.data.prices) {
        setMainAmount1(result.data.prices[0].main_amount);
        setAddAmount1(result.data.prices[0].add_amount);
        setMainPeriod1(result.data.prices[0].main_period);
        setAddPeriod1(result.data.prices[0].add_period);

        setMainAmount2(result.data.prices[1].main_amount);
        setMainPeriod2(result.data.prices[1].main_period);
        setRankAmountA(result.data.prices[8].main_amount);
        setRankAmountB(result.data.prices[9].main_amount);
        setRankAmountC(result.data.prices[10].main_amount);
        setLevelAmountA(result.data.prices[8].add_amount);
        setLevelAmountB(result.data.prices[9].add_amount);

        setMainAmount3(result.data.prices[2].main_amount);
        setAddAmount3(result.data.prices[2].add_amount);
        setMainPeriod3(result.data.prices[2].main_period);
        setAddPeriod3(result.data.prices[2].add_period);

        setMainAmount4(result.data.prices[3].main_amount);
        setAddAmount4(result.data.prices[3].add_amount);
        setMainPeriod4(result.data.prices[3].main_period);

        setMainAmount5(result.data.prices[4].main_amount);
        setMainPeriod5(result.data.prices[4].main_period);

        setMainAmount6(result.data.prices[5].main_amount);
        setMainPeriod6(result.data.prices[5].main_period);

        setMainAmount7(result.data.prices[6].main_amount);
        setMainPeriod7(result.data.prices[6].main_period);

        setMainAmount8(result.data.prices[7].main_amount);
        setMainPeriod8(result.data.prices[7].main_period);
      }
      else {
      console.log('error');
      }
      }).catch((err)=>{
        console.log(err);
    })
  }, [])

  const errorText = () => {
    return (
        // <div style={{ backgroundColor: "#FBF2F3", marginTop: "25px", paddingLeft: "20px", color: "#e12e3e", borderRadius: "5px" }}>
        <div style={{ backgroundColor: "#FBF2F3", marginTop: "5px", paddingLeft: "3px", color: "#e12e3e", borderRadius: "5px" }}>
            <span>入力された値が正しくありません。</span>
        </div>
    );
  }

  const updateServer = (data) => {
    httpService.put('api/admin/price/update', data).then(result => {
      if (result.data.message == 'success') {
        // console.log('-----------', result);
      } else {
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  const clickChangeAmount1 = () => {
    if (mainAmount1 === "" || mainAmount1 === "0" ||
      addAmount1 === "" || addAmount1 === "0" ||
      mainPeriod1 === "" || mainPeriod1 === "0" ||
      addPeriod1 === "" || addPeriod1 === "0"
    ) {
      setErrorState1(true);
      setErrorContent1(errorText);
      return;
    }

    const data = {
      work_id: 1,
      main_amount: mainAmount1,
      main_period: mainPeriod1,
      add_amount: addAmount1,
      add_period: addPeriod1
    };
    updateServer(data);
  }

  const clickChangeAmount2 = () => {
    if (mainAmount2 === "" || mainAmount2 === "0" ||
      mainPeriod2 === "" || mainPeriod2 === "0" ||
      rankAmountA === "" || rankAmountA === "0" ||
      rankAmountB === "" || rankAmountB === "0" ||
      rankAmountC === "" || rankAmountC === "0" ||
      levelAmountA === "" || levelAmountA === "0" ||
      levelAmountB === "" || levelAmountB === "0"
    ) {
      setErrorContent2(errorText);
      return;
    }

    const data = {
      work_id: 2,
      main_amount: mainAmount2,
      main_period: mainPeriod2,
      rank_amount_a: rankAmountA,
      rank_amount_b: rankAmountB,
      rank_amount_c: rankAmountC,
      level_amount_a: levelAmountA,
      level_amount_b: levelAmountB,
    };
    updateServer(data);
  }

  const clickChangeAmount3 = () => {
    if (mainAmount3 === "" || mainAmount3 === "0" ||
      addAmount3 === "" || addAmount3 === "0" ||
      mainPeriod3 === "" || mainPeriod3 === "0" ||
      addPeriod3 === "" || addPeriod3 === "0"
    ) {
      setErrorContent3(errorText);
      return;
    }

    const data = {
      work_id: 3,
      main_amount: mainAmount3,
      main_period: mainPeriod3,
      add_amount: addAmount3,
      add_period: addPeriod3
    };
    updateServer(data);
  }

  const clickChangeAmount4 = () => {
    if (mainAmount4 === "" || mainAmount4 === "0" ||
      addAmount4 === "" || addAmount4 === "0" ||
      mainPeriod4 === "" || mainPeriod4 === "0"
    ) {
      setErrorContent4(errorText);
      return;
    }

    const data = {
      work_id: 4,
      main_amount: mainAmount4,
      main_period: mainPeriod4,
      add_amount: addAmount4,
    };
    updateServer(data);
  }

  const clickChangeAmount5 = () => {
    if (mainAmount5 === "" || mainAmount5 === "0" ||
      mainPeriod5 === "" || mainPeriod5 === "0"
    ) {
      setErrorContent5(errorText);
      return;
    }

    const data = {
      work_id: 6,
      main_amount: mainAmount5,
      main_period: mainPeriod5,
    };
    updateServer(data);
  }

  const clickChangeAmount6 = () => {
    if (mainAmount6 === "" || mainAmount6 === "0" ||
      mainPeriod6 === "" || mainPeriod6 === "0"
    ) {
      setErrorContent6(errorText);
      return;
    }

    const data = {
      work_id: 5,
      main_amount: mainAmount6,
      main_period: mainPeriod6,
    };
    updateServer(data);
  }

  const clickChangeAmount7 = () => {
    if (mainAmount7 === "" || mainAmount7 === "0" ||
      mainPeriod7 === "" || mainPeriod7 === "0"
    ) {
      setErrorContent7(errorText);
      return;
    }

    const data = {
      work_id: 7,
      main_amount: mainAmount7,
      main_period: mainPeriod7,
    };
    updateServer(data);
  }

  const clickChangeAmount8 = () => {
    if (mainAmount8 === "" || mainAmount8 === "0" ||
      mainPeriod8 === "" || mainPeriod8 === "0"
    ) {
      setErrorContent8(errorText);
      return;
    }

    const data = {
      work_id: 8,
      main_amount: mainAmount8,
      main_period: mainPeriod8,
    };
    updateServer(data);
  }

  return (
      <div>
          <Card>
              <CardHeader
                style={{borderBottom: "1px solid lightgrey"}}
              >
              <GridContainer justify="center">
                <GridItem xs={12} sm={3} className={classes.textAlign}>項目名</GridItem>
                <GridItem xs={12} sm={4} className={classes.textAlign}>金額</GridItem>
                <GridItem xs={12} sm={5} className={classes.textAlign}>作業期間</GridItem>
              </GridContainer>
              </CardHeader>
              <CardBody>
              <GridContainer justify="center" style={{borderBottom: "1px solid lightgrey", margin: "0 0 20px -15px"}}>
                <GridItem xs={12} sm={2} className={classes.textAlign}>グラウンドデータ(DTM)</GridItem>
                <GridItem xs={12} sm={5}>
                  <GridContainer>
                    <GridItem xs={12} sm={3}></GridItem>
                    <GridItem xs={12} sm={5}>
                      <CustomInput1
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: addAmount1,
                          // value: priceData0.add_amount,
                          onChange: event => {
                            // setPriceData0({...priceData0.add_amount, add_amount: event.target.value});
                            setAddAmount1(event.target.value);
                            setErrorContent1("");
                          },
                          type: "number",
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={4}>
                      <FormLabel className={classes.labelHorizontal1}>
                        円/ha
                      </FormLabel>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={3}></GridItem>
                    <GridItem xs={12} sm={5}>
                      <CustomInput1
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: mainAmount1,
                          onChange: event => {
                            setMainAmount1(event.target.value);
                            setErrorContent1("");
                          },
                          type: "number",
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={4}>
                      <FormLabel className={classes.labelHorizontal1}>
                        円(基本料金)
                      </FormLabel>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={5}>
                  <GridContainer>
                    <GridItem xs={12} sm={9}>
                      <GridContainer>
                        <GridItem xs={12} sm={7}>
                          <CustomInput1
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: mainPeriod1,
                              onChange: event => {
                                setMainPeriod1(event.target.value);
                                setErrorContent1("");
                              },
                              type: "number",
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={5}>
                          <FormLabel className={classes.labelHorizontal1}>
                            営業日/〜20ha
                          </FormLabel>
                        </GridItem>
                      </GridContainer>
                      <GridContainer>
                        <GridItem xs={12} sm={7}>
                        <CustomInput1
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: addPeriod1,
                              onChange: event => {
                                setAddPeriod1(event.target.value);
                                setErrorContent1("");
                              },
                              type: "number",
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={5}>
                          <FormLabel className={classes.labelHorizontal1}>
                            営業日/10ha
                          </FormLabel>
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                    <GridItem xs={12} sm={3}>
                      <Button1 style={{ backgroundColor: "#e12e3e" }} onClick={clickChangeAmount1}>
                        変更
                      </Button1>
                    </GridItem>
                  </GridContainer>
                  {errorContent1}
                </GridItem>
              </GridContainer>
              <GridContainer justify="center" style={{borderBottom: "1px solid lightgrey", margin: "0 0 20px -15px"}}>
                <GridItem xs={12} sm={2} className={classes.textAlign}>簡易図化(一般図)</GridItem>
                <GridItem xs={12} sm={5}>
                  <GridContainer>
                    <GridItem xs={12} sm={3}>
                      <FormLabel className={classes.labelHorizontal1}>
                        図化対象
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={5}>
                      <CustomInput1
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: rankAmountA,
                          onChange: event => {
                            setRankAmountA(event.target.value);
                            setErrorContent2("");
                          },
                          type: "number",
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={4}>
                      <FormLabel className={classes.labelHorizontal1}>
                        円/ha(Aランク)
                      </FormLabel>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={3}></GridItem>
                    <GridItem xs={12} sm={5}>
                      <CustomInput1
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: rankAmountB,
                          onChange: event => {
                            setRankAmountB(event.target.value);
                            setErrorContent2("");
                          },
                          type: "number",
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={4}>
                      <FormLabel className={classes.labelHorizontal1}>
                        円/ha(Bランク)
                      </FormLabel>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={3}></GridItem>
                    <GridItem xs={12} sm={5}>
                      <CustomInput1
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: rankAmountC,
                          onChange: event => {
                            setRankAmountC(event.target.value);
                            setErrorContent2("");
                          },
                          type: "number",
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={4}>
                      <FormLabel className={classes.labelHorizontal1}>
                        円/ha(Cランク)
                      </FormLabel>
                    </GridItem>
                  </GridContainer>		
                  <GridContainer>
                    <GridItem xs={12} sm={3}>
                      <FormLabel className={classes.labelHorizontal1}>
                        縮尺
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={5}>
                      <CustomInput1
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: levelAmountA,
                          onChange: event => {
                            setLevelAmountA(event.target.value);
                            setErrorContent2("");
                          },
                          type: "number",
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={4}>
                      <FormLabel className={classes.labelHorizontal1}>
                        円/ha(レベル500)
                      </FormLabel>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={3}></GridItem>
                    <GridItem xs={12} sm={5}>
                      <CustomInput1
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: levelAmountB,
                          onChange: event => {
                            setLevelAmountB(event.target.value);
                            setErrorContent2("");
                          },
                          type: "number",
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={4}>
                      <FormLabel className={classes.labelHorizontal1}>
                        円/ha(レベル1000)
                      </FormLabel>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={3}>
                      <FormLabel className={classes.labelHorizontal1}>
                        基本料金
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={12} sm={5}>
                      <CustomInput1
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: mainAmount2,
                          onChange: event => {
                            setMainAmount2(event.target.value);
                            setErrorContent2("");
                          },
                          type: "number",
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={4}>
                      <FormLabel className={classes.labelHorizontal1}>
                        円(基本料金)
                      </FormLabel>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={5}>
                  <GridContainer>
                    <GridItem xs={12} sm={9}>
                      <GridContainer>
                        <GridItem xs={12} sm={7}>
                          <CustomInput1
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: mainPeriod2,
                              onChange: event => {
                                setMainPeriod2(event.target.value);
                                setErrorContent2("");
                              },
                              type: "number",
                                }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={5}>
                          <FormLabel className={classes.labelHorizontal1}>
                            営業日/50ha
                          </FormLabel>
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                    <GridItem xs={12} sm={3}>
                    <Button1 style={{ backgroundColor: "#e12e3e" }} onClick={clickChangeAmount2}>
                        変更
                      </Button1>
                    </GridItem>
                  </GridContainer>
                  {errorContent2}
                </GridItem>
              </GridContainer>
              <GridContainer justify="center" style={{borderBottom: "1px solid lightgrey", margin: "0 0 20px -15px"}}>
                <GridItem xs={12} sm={2} className={classes.textAlign}>等高線</GridItem>
                <GridItem xs={12} sm={5}>
                  <GridContainer>
                    <GridItem xs={12} sm={3}></GridItem>
                    <GridItem xs={12} sm={5}>
                      <CustomInput1
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: addAmount3,
                          onChange: event => {
                            setAddAmount3(event.target.value);
                            setErrorContent3("");
                          },
                          type: "number",
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={4}>
                      <FormLabel className={classes.labelHorizontal1}>
                        円/ha
                      </FormLabel>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={3}></GridItem>
                    <GridItem xs={12} sm={5}>
                      <CustomInput1
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: mainAmount3,
                          onChange: event => {
                            setMainAmount3(event.target.value);
                            setErrorContent3("");
                          },
                          type: "number",
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={4}>
                      <FormLabel className={classes.labelHorizontal1}>
                        円(基本料金)
                      </FormLabel>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={5}>
                  <GridContainer>
                    <GridItem xs={12} sm={9}>
                      <GridContainer>
                        <GridItem xs={12} sm={7}>
                          <CustomInput1
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: mainPeriod3,
                              onChange: event => {
                                setMainPeriod3(event.target.value);
                                setErrorContent3("");
                              },
                              type: "number",
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={5}>
                          <FormLabel className={classes.labelHorizontal1}>
                            営業日/〜20ha
                          </FormLabel>
                        </GridItem>
                      </GridContainer>
                      <GridContainer>
                        <GridItem xs={12} sm={7}>
                          <CustomInput1
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: addPeriod3,
                              onChange: event => {
                                setAddPeriod3(event.target.value);
                                setErrorContent3("");
                              },
                              type: "number",
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={5}>
                          <FormLabel className={classes.labelHorizontal1}>
                            営業日/10ha
                          </FormLabel>
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                    <GridItem xs={12} sm={3}>
                    <Button1 style={{ backgroundColor: "#e12e3e" }} onClick={clickChangeAmount3}>
                        変更
                      </Button1>
                    </GridItem>
                  </GridContainer>
                  {errorContent3}
                </GridItem>
              </GridContainer> 
              <GridContainer justify="center" style={{borderBottom: "1px solid lightgrey", margin: "0 0 20px -15px"}}>
                <GridItem xs={12} sm={2} className={classes.textAlign}>縦横断図</GridItem>
                <GridItem xs={12} sm={5}>
                  <GridContainer>
                    <GridItem xs={12} sm={3}></GridItem>
                    <GridItem xs={12} sm={5}>
                      <CustomInput1
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: addAmount4,
                          onChange: event => {
                            setAddAmount4(event.target.value);
                            setErrorContent4("");
                          },
                          type: "number",
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={4}>
                      <FormLabel className={classes.labelHorizontal1}>
                        円/本
                      </FormLabel>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={3}></GridItem>
                    <GridItem xs={12} sm={5}>
                      <CustomInput1
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: mainAmount4,
                          onChange: event => {
                            setMainAmount4(event.target.value);
                            setErrorContent4("");
                          },
                          type: "number",
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={4}>
                      <FormLabel className={classes.labelHorizontal1}>
                        円(基本料金)
                      </FormLabel>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={5}>
                  <GridContainer>
                    <GridItem xs={12} sm={9}>
                      <GridContainer>
                        <GridItem xs={12} sm={7}>
                          <CustomInput1
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: mainPeriod4,
                              onChange: event => {
                                setMainPeriod4(event.target.value);
                                setErrorContent4("");
                              },
                              type: "number",
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={5}>
                          <FormLabel className={classes.labelHorizontal1}>
                            営業日/40本
                          </FormLabel>
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                    <GridItem xs={12} sm={3}>
                    <Button1 style={{ backgroundColor: "#e12e3e" }} onClick={clickChangeAmount4}>
                        変更
                      </Button1>
                    </GridItem>
                  </GridContainer>
                  {errorContent4}
                </GridItem>
              </GridContainer> 
              <GridContainer justify="center" style={{borderBottom: "1px solid lightgrey", margin: "0 0 20px -15px"}}>
                <GridItem xs={12} sm={2} className={classes.textAlign}>土量計算（メッシュ法）</GridItem>
                <GridItem xs={12} sm={5}>
                  <GridContainer>
                    <GridItem xs={12} sm={3}></GridItem>
                    <GridItem xs={12} sm={5}>
                      <CustomInput1
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: mainAmount5,
                          onChange: event => {
                            setMainAmount5(event.target.value);
                            setErrorContent5("");
                          },
                          type: "number",
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={4}>
                      <FormLabel className={classes.labelHorizontal1}>
                        円
                      </FormLabel>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={5}>
                  <GridContainer>
                    <GridItem xs={12} sm={9}>
                      <GridContainer>
                        <GridItem xs={12} sm={7}>
                          <CustomInput1
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: mainPeriod5,
                              onChange: event => {
                                setMainPeriod5(event.target.value);
                                setErrorContent5("");
                              },
                              type: "number",
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={5}>
                          <FormLabel className={classes.labelHorizontal1}>
                            営業日/式
                          </FormLabel>
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                    <GridItem xs={12} sm={3}>
                    <Button1 style={{ backgroundColor: "#e12e3e" }} onClick={clickChangeAmount5}>
                        変更
                      </Button1>
                    </GridItem>
                  </GridContainer>
                  {errorContent5}
                </GridItem>
              </GridContainer>
              <GridContainer justify="center" style={{borderBottom: "1px solid lightgrey", margin: "0 0 20px -15px"}}>
                <GridItem xs={12} sm={2} className={classes.textAlign}>オルソ画像</GridItem>
                <GridItem xs={12} sm={5}>
                  <GridContainer>
                    <GridItem xs={12} sm={3}></GridItem>
                    <GridItem xs={12} sm={5}>
                      <CustomInput1
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: mainAmount6,
                          onChange: event => {
                            setMainAmount6(event.target.value);
                            setErrorContent6("");
                          },
                          type: "number",
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={4}>
                      <FormLabel className={classes.labelHorizontal1}>
                        円
                      </FormLabel>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={5}>
                  <GridContainer>
                    <GridItem xs={12} sm={9}>
                      <GridContainer>
                        <GridItem xs={12} sm={7}>
                          <CustomInput1
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: mainPeriod6,
                              onChange: event => {
                                setMainPeriod6(event.target.value);
                                setErrorContent6("");
                              },
                              type: "number",
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={5}>
                          <FormLabel className={classes.labelHorizontal1}>
                            営業日/式
                          </FormLabel>
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                    <GridItem xs={12} sm={3}>
                    <Button1 style={{ backgroundColor: "#e12e3e" }} onClick={clickChangeAmount6}>
                        変更
                      </Button1>
                    </GridItem>
                  </GridContainer>
                  {errorContent6}
                </GridItem>
              </GridContainer>
              <GridContainer justify="center" style={{borderBottom: "1px solid lightgrey", margin: "0 0 20px -15px"}}>
                <GridItem xs={12} sm={2} className={classes.textAlign}>簡易精度管理表</GridItem>
                <GridItem xs={12} sm={5}>
                  <GridContainer>
                    <GridItem xs={12} sm={3}></GridItem>
                    <GridItem xs={12} sm={5}>
                      <CustomInput1
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: mainAmount7,
                          onChange: event => {
                            setMainAmount7(event.target.value);
                            setErrorContent7("");
                          },
                          type: "number",
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={4}>
                      <FormLabel className={classes.labelHorizontal1}>
                        円
                      </FormLabel>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={5}>
                  <GridContainer>
                    <GridItem xs={12} sm={9}>
                      <GridContainer>
                        <GridItem xs={12} sm={7}>
                          <CustomInput1
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: mainPeriod7,
                              onChange: event => {
                                setMainPeriod7(event.target.value);
                                setErrorContent7("");
                              },
                              type: "number",
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={5}>
                          <FormLabel className={classes.labelHorizontal1}>
                            営業日/式
                          </FormLabel>
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                    <GridItem xs={12} sm={3}>
                    <Button1 style={{ backgroundColor: "#e12e3e" }} onClick={clickChangeAmount7}>
                        変更
                      </Button1>
                    </GridItem>
                  </GridContainer>
                  {errorContent7}
                </GridItem>
              </GridContainer>
              <GridContainer justify="center" style={{borderBottom: "1px solid lightgrey", margin: "0 0 20px -15px"}}>
                <GridItem xs={12} sm={2} className={classes.textAlign}>公共精度管理表</GridItem>
                <GridItem xs={12} sm={5}>
                  <GridContainer>
                    <GridItem xs={12} sm={3}></GridItem>
                    <GridItem xs={12} sm={5}>
                      <CustomInput1
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: mainAmount8,
                          onChange: event => {
                            setMainAmount8(event.target.value);
                            setErrorContent8("");
                          },
                          type: "number",
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={4}>
                      <FormLabel className={classes.labelHorizontal1}>
                        円
                      </FormLabel>
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={5}>
                  <GridContainer>
                    <GridItem xs={12} sm={9}>
                      <GridContainer>
                        <GridItem xs={12} sm={7}>
                          <CustomInput1
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              value: mainPeriod8,
                              onChange: event => {
                                setMainPeriod8(event.target.value);
                                setErrorContent8("");
                              },
                              type: "number",
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={5}>
                          <FormLabel className={classes.labelHorizontal1}>
                            営業日/式
                          </FormLabel>
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                    <GridItem xs={12} sm={3}>
                    <Button1 style={{ backgroundColor: "#e12e3e" }} onClick={clickChangeAmount8}>
                        変更
                      </Button1>
                    </GridItem>
                  </GridContainer>
                  {errorContent8}
                </GridItem>
              </GridContainer>                               
            </CardBody>
          </Card>
      </div>
  );
}


const mapStateToProps = (state, ownProps) => ({
    user: state.auth.user
})
  
const mapDispatchToProps = ({})
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PriceList))