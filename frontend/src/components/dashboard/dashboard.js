import React, { Component } from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import numeral from 'numeral';
import { Modal, Form } from 'react-bootstrap';
// import { Row, Col, Container, Jumbotron } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import Select from 'react-select';
import Navheader from '../navbar/navbar';
import Sidebarcomp from '../navbar/sidebar';
import '../navbar/navbar.css';
import './dashboard.css';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: '',
      useremail: '',
      popup: false,
      settleupwith: {},
      totalsummary: [],
      payeebalances: [],
      payerbalances: [],
      totalpayeeuser: [],
      totalpayeruser: [],
      settleuplist: [],
    };
    this.settleuphandler = this.settleuphandler.bind(this);
    this.settleupchnagehandler = this.settleupchnagehandler.bind(this);
  }

  componentWillMount() {
    const userid1 = sessionStorage.getItem('userid');
    const useremail1 = sessionStorage.getItem('useremail');
    this.gettotalbalances(userid1);
    this.setState({
      userid: userid1,
      useremail: useremail1,
    });
  }

  showHandler = () => {
    this.setState({ popup: true });
  };

  closeHandler = () => {
    this.setState({ popup: false, settleuplist: [] });
  };

  settleupchnagehandler = (e) => {
    const newarr = e.value;
    console.log(e.value);
    this.setState({ settleupwith: newarr });
  };

  settleuphandler = (settleupwith1, e) => {
    e.preventDefault();
    this.setState({ popup: false, settleuplist: [], settleupwith: '' });
    const { settleupwith, userid, useremail } = this.state;
    console.log(settleupwith);
    const data = {
      settleupwith,
      userid,
      useremail,
    };
    axios
      .post('http://localhost:3001/settleup', data)
      .then((response) => {
        console.log('Status Code : ', response.status);
        console.log('response ', response.data);
        if (response.status === 200) {
          console.log(response.data);
          this.gettotalbalances(userid);
        } else {
          console.log(response.data);
          alert(response.data);
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        alert(err.response.data);
      });
  };

  gettotalbalances = (userid) => {
    axios
      .get(`http://localhost:3001/gettotalbalances/${userid}`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((response) => {
        const data = response.data[1];
        const username = sessionStorage.getItem('username');
        const useremail = sessionStorage.getItem('useremail');
        const defaultcurr = sessionStorage.getItem('defaultcurrency');
        console.log(defaultcurr, useremail);
        const regExp = /\(([^)]+)\)/;
        const getvalue = regExp.exec(defaultcurr);
        const symbolvalue = getvalue[1];
        const arraytotalsummary = data.map((el) => ({
          totalblc: symbolvalue + numeral(el.Total_balance).format('0,0.00'),
          youowe: symbolvalue + numeral(el.You_owe).format('0,0.00'),
          youareowed: symbolvalue + numeral(el.You_are_owed).format('0,0.00'),
        }));
        // Total Summary details
        console.log(arraytotalsummary);
        this.setState({
          totalsummary: arraytotalsummary,
        });

        const data1 = response.data[0];
        const arrayindisummaries = data1.map((el) => ({
          payername: el.payer_username,
          payeremail: el.payer,
          payeename: el.payee_username,
          payeeemail: el.payee,
          balance: el.balance,
          grpname: el.gpname,
        }));
        console.log(arraytotalsummary);
        this.setState({
          totalsummary: arraytotalsummary,
        });

        console.log(arrayindisummaries);

        // payee details for the logged in user
        const payeearr = [];
        const payeegrouparr = [];
        const payeebalancearr = [];
        const payerarr = [];

        // payer details for the logged in user
        const payeepaysarr = [];
        const payeepaysbalancearr = [];
        const payergetsarr = [];
        const payergrouparr = [];

        // total payee for the logged in user
        const totalpayeename = [];
        const totalpayername = [];
        const totalamaount = [];

        // total payer for the logged in user
        const totalpayeename1 = [];
        const totalpayername1 = [];
        const totalamaount1 = [];

        const settleupemaillist = [];
        const settleupnamelist = [];

        let x;
        let y;
        // let balancetotal = 0;
        // const balancetotal2 = 0;

        for (let i = 0; i < arrayindisummaries.length; i += 1) {
          x = -1;
          if (
            username === arrayindisummaries[i].payeename &&
            arrayindisummaries[i].balance !== 0
          ) {
            payeearr.push(username);
            payeegrouparr.push(arrayindisummaries[i].grpname);
            payeebalancearr.push(arrayindisummaries[i].balance);
            payerarr.push(arrayindisummaries[i].payername);
            if (!isEmpty(totalpayername)) {
              x = totalpayername.findIndex(
                (el) => el === arrayindisummaries[i].payername
              );
            }
            if (x > -1) {
              totalamaount[x] += arrayindisummaries[i].balance;
              // totalamaount.push(balancetotal);
              // totalpayername.push(arrayindisummaries[i].payername);
              // totalpayeename.push(username);
              console.log(totalamaount);
              console.log(totalpayername);
              console.log(totalpayeename);
            } else {
              totalpayername.push(arrayindisummaries[i].payername);
              totalamaount.push(arrayindisummaries[i].balance);
              totalpayeename.push(username);
            }
            console.log(x, totalpayername);
          } else if (
            username === arrayindisummaries[i].payername &&
            arrayindisummaries[i].balance !== 0
          ) {
            payeepaysbalancearr.push(arrayindisummaries[i].balance);
            payeepaysarr.push(arrayindisummaries[i].payeename);
            payergrouparr.push(arrayindisummaries[i].grpname);
            payergetsarr.push(username);
            // x = -1;
            if (!isEmpty(totalpayeename1)) {
              x = totalpayeename1.findIndex(
                (el) => el === arrayindisummaries[i].payeename
              );
            }
            if (x > -1) {
              totalamaount1[x] += arrayindisummaries[i].balance;
              // totalamaount1.push(balancetotal2);
              // totalpayeename1.push(arrayindisummaries[i].payeename);
              // totalpayername1.push(username);
              console.log(totalamaount1);
              console.log(totalpayername1);
              console.log(totalpayeename1);
            } else {
              totalpayeename1.push(arrayindisummaries[i].payeename);
              totalamaount1.push(arrayindisummaries[i].balance);
              totalpayername1.push(username);
              // console.log();
            }
          }
        }

        const payeearray = Object.keys(payeearr);
        const arrayofindipayee = payeearray.map((indx) => ({
          payee: payeearr[indx],
          grpname: payeegrouparr[indx],
          indiamt: payeebalancearr[indx],
          formatindiamt:
            symbolvalue + numeral(payeebalancearr[indx]).format('0,0.00'),
          payer: payerarr[indx],
        }));
        console.log(arrayofindipayee);
        this.setState({
          payeebalances: [...arrayofindipayee],
        });

        const payerarray = Object.keys(payergetsarr);
        const arrayofindipayer = payerarray.map((indx) => ({
          payee1: payeepaysarr[indx],
          grpname1: payergrouparr[indx],
          indiamt1: payeepaysbalancearr[indx],
          formatindiamt1:
            symbolvalue + numeral(payeepaysbalancearr[indx]).format('0,0.00'),
          payer1: payergetsarr[indx],
        }));
        console.log(arrayofindipayer);
        this.setState({
          payerbalances: [...arrayofindipayer],
        });

        const payeetotalblnc = Object.keys(totalpayeename);
        const arrayofpayeetotalblnc = payeetotalblnc.map((indx) => ({
          payee2: totalpayeename[indx],
          indiamt2: totalamaount[indx],
          formatindiamt2:
            symbolvalue + numeral(totalamaount[indx]).format('0,0.00'),
          payer2: totalpayername[indx],
        }));
        console.log(arrayofpayeetotalblnc);
        this.setState({
          totalpayeeuser: [...arrayofpayeetotalblnc],
        });

        const payertotalblnc = Object.keys(totalpayeename1);
        const arrayofpayertotalblnc = payertotalblnc.map((indx) => ({
          payee3: totalpayeename1[indx],
          indiamt3: totalamaount1[indx],
          formatindiamt3:
            symbolvalue + numeral(totalamaount1[indx]).format('0,0.00'),
          payer3: totalpayername1[indx],
        }));
        console.log(arrayofpayertotalblnc);
        this.setState({
          totalpayeruser: [...arrayofpayertotalblnc],
        });

        // list of users for settle up
        for (let j = 0; j < arrayindisummaries.length; j += 1) {
          y = -1;
          if (
            useremail !== arrayindisummaries[j].payeeemail &&
            arrayindisummaries[j].balance !== 0
          ) {
            if (!isEmpty(settleupemaillist)) {
              y = settleupemaillist.findIndex(
                (el) => el === arrayindisummaries[j].payeeemail
              );
            }
            /* if (y > -1) {
              settleupemaillist.push(arrayindisummaries[j].payeeemail);
            } else {
              settleupnamelist.push(arrayindisummaries[j].payeename);
              settleupemaillist.push(arrayindisummaries[j].payeeemail);
            } */
            if (y === -1) {
              settleupnamelist.push(arrayindisummaries[j].payeename);
              settleupemaillist.push(arrayindisummaries[j].payeeemail);
            }
          } else if (
            JSON.stringify(useremail) !==
              JSON.stringify(arrayindisummaries[j].payeremail) &&
            arrayindisummaries[j].balance !== 0
          ) {
            if (!isEmpty(settleupemaillist)) {
              y = settleupemaillist.findIndex(
                (el) => el === arrayindisummaries[j].payeremail
              );
            }
            /* if (y > -1) {
              settleupemaillist.push(arrayindisummaries[j].payeremail);
            } else {
              settleupnamelist.push(arrayindisummaries[j].payername);
              settleupemaillist.push(arrayindisummaries[j].payeremail);
            } */
            if (y === -1) {
              settleupnamelist.push(arrayindisummaries[j].payername);
              settleupemaillist.push(arrayindisummaries[j].payeremail);
            }
          }
        }
        const setteluplist = Object.keys(settleupemaillist);
        const arrayforselect = setteluplist.map((indx) => ({
          value: settleupemaillist[indx],
          label: settleupnamelist[indx],
        }));
        console.log(arrayforselect);
        this.setState({
          settleuplist: [...arrayforselect],
        });
      })
      .catch((err) => console.log(err));
  };

  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      redirectVar = <Redirect to="/" />;
    }
    const {
      totalsummary,
      payeebalances,
      payerbalances,
      totalpayeeuser,
      totalpayeruser,
      popup,
      settleuplist,
      settleupwith,
      userid,
      useremail,
    } = this.state;
    console.log(userid, useremail);
    let checkifyouowenull = false;
    if (isEmpty(totalpayeeuser)) {
      checkifyouowenull = true;
    }
    let checkifyouowednull = false;
    if (isEmpty(totalpayeruser)) {
      checkifyouowednull = true;
    }
    return (
      <div>
        {redirectVar}
        <Navheader />
        <div className="dashboard-flex">
          <div>
            <Sidebarcomp />
          </div>

          <div className="dashboard-box">
            <section className="dashboard-heading-buttons">
              <section className="dashboard-heading">
                <h1>Dashboard</h1>

                <ul className="button-right">
                  <li>
                    <Button className="Signup-default">
                      <Link to="/addbill">Add Bill</Link>
                    </Button>{' '}
                    <Button
                      className="login-default"
                      onClick={this.showHandler}
                    >
                      {' '}
                      Settle Up{' '}
                    </Button>
                    <Modal show={popup} onHide={this.closeHandler}>
                      <Modal.Header closeButton>
                        <Modal.Title>Settle Up</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form.Group>
                          <Form.Label>
                            Whom do you want to settle up with:{' '}
                          </Form.Label>
                          <Select
                            options={settleuplist}
                            placeholder="Username"
                            className="div-select"
                            menuPlacement="auto"
                            menuPosition="fixed"
                            onChange={(e) => this.settleupchnagehandler(e)}
                          />
                        </Form.Group>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          className="mygroups-default"
                          onClick={(e) => this.settleuphandler(settleupwith, e)}
                        >
                          √ GO
                        </Button>
                        <Button
                          className="Signup-default"
                          onClick={this.closeHandler}
                        >
                          Cancel
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </li>
                </ul>
              </section>

              <section className="dashboard-center-sec">
                <div className="dashboard-center-section-block">
                  <div className="title">Total Balance</div>
                  {totalsummary.map((expense) => (
                    <ul className="group-expenses">
                      <p>
                        <span>{expense.totalblc}</span>
                      </p>
                    </ul>
                  ))}
                </div>

                <div className="dashboard-center-section-block">
                  <div className="dashboard-block-border">
                    <div className="title">You Owe</div>
                    {totalsummary.map((expense) => (
                      <ul className="group-expenses">
                        <p>
                          <span>{expense.youowe}</span>
                        </p>
                      </ul>
                    ))}
                  </div>
                </div>

                <div className="dashboard-center-section-block">
                  <div className="title">You Are Owed</div>
                  {totalsummary.map((expense) => (
                    <ul className="group-expenses">
                      <p>
                        <span>{expense.youareowed}</span>
                      </p>
                    </ul>
                  ))}
                </div>
              </section>
            </section>

            <section className="transcations-sec">
              <div className="tranactions-heading">
                <div>You Owe</div>
                <div>You are owed</div>
              </div>
              <div className="transactions-owe">
                you owe test
                {checkifyouowenull ? (
                  <h2>YOU OWE NOTHING</h2>
                ) : (
                  <div>
                    {' '}
                    {totalpayeeuser.map((expense2) => (
                      <ul className="group-expenses">
                        <li>
                          <p>
                            <span>
                              {' '}
                              You Owe {expense2.formatindiamt2} to{' '}
                              {expense2.payer2}
                              {payeebalances.map((expense) => (
                                <ul className="group-expenses">
                                  <p>
                                    {(() => {
                                      if (expense2.payer2 === expense.payer) {
                                        return (
                                          <div>
                                            <span>
                                              {' '}
                                              You Owe {
                                                expense.formatindiamt
                                              } to {expense.payer} for{' '}
                                              {expense.grpname}{' '}
                                            </span>
                                          </div>
                                        );
                                      }
                                      return <p> </p>;
                                    })()}
                                  </p>
                                </ul>
                              ))}
                            </span>
                          </p>
                        </li>
                      </ul>
                    ))}
                  </div>
                )}
              </div>
              <div className="transactions-owed">
                you are owed test
                {checkifyouowednull ? (
                  <h2>YOU ARE OWED NOTHING</h2>
                ) : (
                  <div>
                    {' '}
                    {totalpayeruser.map((expense3) => (
                      <ul className="group-expenses">
                        <li>
                          <p>
                            <span>
                              {' '}
                              {expense3.payee3} owes you{' '}
                              {expense3.formatindiamt3}
                              {payerbalances.map((expense1) => (
                                <ul className="group-expenses">
                                  <li>
                                    <p>
                                      <span>
                                        {' '}
                                        {expense1.payee1} owes you{' '}
                                        {expense1.formatindiamt1} for{' '}
                                        {expense1.grpname1}{' '}
                                      </span>
                                    </p>
                                  </li>
                                </ul>
                              ))}
                            </span>
                          </p>
                        </li>
                      </ul>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="dashboard-right" />
        </div>
      </div>
    );
  }
}

export default Dashboard;
