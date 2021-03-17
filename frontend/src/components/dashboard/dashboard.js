import React, { Component } from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import numeral from 'numeral';
// import { Row, Col, Container, Jumbotron } from 'react-bootstrap';
import { isEmpty } from 'lodash';
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
      totalbalance: [],
      totalsummary: [],
      payeebalances: [],
      payerbalances: [],
      totalpayeeuser: [],
      totalpayeruser: [],
    };
  }

  componentWillMount() {
    const userid1 = sessionStorage.getItem('userid');
    const useremail1 = sessionStorage.getItem('useremail');
    const balances1 = this.gettotalbalances(userid1);
    this.setState({
      userid: userid1,
      useremail: useremail1,
      totalbalance: balances1,
    });
  }

  gettotalbalances = (userid) => {
    axios
      .get(`http://localhost:3001/gettotalbalances/${userid}`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response.data);
        console.log(typeof response.data);
        console.log(response.data[1]);
        const data = response.data[1];
        const username = sessionStorage.getItem('username');
        const defaultcurr = sessionStorage.getItem('defaultcurrency');
        console.log(defaultcurr);
        const regExp = /\(([^)]+)\)/;
        const getvalue = regExp.exec(defaultcurr);
        const symbolvalue = getvalue[1];
        const arraytotalsummary = data.map((el) => ({
          totalblc: symbolvalue + numeral(el.Total_balance).format('0,0.00'),
          youowe: symbolvalue + numeral(el.You_owe).format('0,0.00'),
          youareowed: symbolvalue + numeral(el.You_are_owed).format('0,0.00'),
        }));
        console.log(arraytotalsummary);
        this.setState({
          totalsummary: arraytotalsummary,
        });

        const data1 = response.data[0];
        const arrayindisummaries = data1.map((el) => ({
          payername: el.payer_username,
          payeename: el.payee_username,
          balance: el.balance,
          grpname: el.gpname,
        }));
        console.log(arraytotalsummary);
        this.setState({
          totalsummary: arraytotalsummary,
        });

        console.log(arrayindisummaries);

        const payeearr = [];
        const payeegrouparr = [];
        const payeebalancearr = [];
        const payerarr = [];

        const payeepaysarr = [];
        const payeepaysbalancearr = [];
        const payergetsarr = [];
        const payergrouparr = [];

        const totalpayeename = [];
        const totalpayername = [];
        const totalamaount = [];

        const totalpayeename1 = [];
        const totalpayername1 = [];
        const totalamaount1 = [];

        let x;
        let balancetotal = 0;
        let balancetotal2 = 0;

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
              balancetotal = totalamaount[x] + arrayindisummaries[i].balance;
              totalamaount.push(balancetotal);
              totalpayername.push(arrayindisummaries[i].payername);
              totalpayeename.push(username);
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
              balancetotal2 = totalamaount1[x] + arrayindisummaries[i].balance;
              totalamaount1.push(balancetotal2);
              totalpayeename1.push(arrayindisummaries[i].payeename);
              totalpayername1.push(username);
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
      })
      .catch((err) => console.log(err));
  };

  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      redirectVar = <Redirect to="/" />;
    }
    const {
      totalbalance,
      totalsummary,
      payeebalances,
      payerbalances,
      totalpayeeuser,
      totalpayeruser,
    } = this.state;
    const { userid, useremail } = this.state;
    console.log(
      totalbalance,
      userid,
      useremail,
      totalsummary,
      payeebalances,
      payerbalances,
      totalpayeeuser,
      totalpayeruser
    );
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
                    <Button className="login-default">
                      <Link to="/signup">Settle Up</Link>
                    </Button>
                  </li>
                </ul>
              </section>

              <section className="dashboard-center-sec">
                <div className="dashboard-center-section-block">
                  <div className="title">Total Balance</div>
                  {totalsummary.map((expense) => (
                    <ul className="group-expenses">
                      <li>
                        <p>
                          <span> {expense.totalblc}</span>
                        </p>
                      </li>
                    </ul>
                  ))}
                </div>

                <div className="dashboard-center-section-block">
                  <div className="dashboard-block-border">
                    <div className="title">You Owe</div>
                    {totalsummary.map((expense) => (
                      <ul className="group-expenses">
                        <li>
                          <p>
                            <span> {expense.youowe}</span>
                          </p>
                        </li>
                      </ul>
                    ))}
                  </div>
                </div>

                <div className="dashboard-center-section-block">
                  <div className="title">You Are Owed</div>
                  {totalsummary.map((expense) => (
                    <ul className="group-expenses">
                      <li>
                        <p>
                          <span> {expense.youareowed}</span>
                        </p>
                      </li>
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
                {totalpayeeuser.map((expense2) => (
                  <ul className="group-expenses">
                    <li>
                      <p>
                        <span>
                          {' '}
                          You Owe {expense2.formatindiamt2} to {expense2.payer2}
                          {payeebalances.map((expense) => (
                            <ul className="group-expenses">
                              <li>
                                <p>
                                  <span>
                                    {' '}
                                    You Owe {expense.formatindiamt} to{' '}
                                    {expense.payer} for {expense.grpname}{' '}
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
                {payeebalances.map((expense) => (
                  <ul className="group-expenses">
                    <li>
                      <p>
                        <span>
                          {' '}
                          You Owe {expense.formatindiamt} to {expense.payer} for{' '}
                          {expense.grpname}{' '}
                        </span>
                      </p>
                    </li>
                  </ul>
                ))}
              </div>
              <div className="transactions-owed">
                you are owed test totalpayeruser
                {totalpayeruser.map((expense3) => (
                  <ul className="group-expenses">
                    <li>
                      <p>
                        <span>
                          {' '}
                          {expense3.payee3} owes you {expense3.formatindiamt3}
                          {payerbalances.map((expense) => (
                            <ul className="group-expenses">
                              <li>
                                <p>
                                  <span>
                                    {' '}
                                    {expense.payee1} owes you{' '}
                                    {expense.formatindiamt1} for{' '}
                                    {expense.grpname1}{' '}
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
                {payerbalances.map((expense) => (
                  <ul className="group-expenses">
                    <li>
                      <p>
                        <span>
                          {' '}
                          {expense.payee1} owes you {expense.formatindiamt1} for{' '}
                          {expense.grpname1}{' '}
                        </span>
                      </p>
                    </li>
                  </ul>
                ))}
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
