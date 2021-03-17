import React, { Component } from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import numeral from 'numeral';
// import { Row, Col, Container, Jumbotron } from 'react-bootstrap';
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
        /* const { data } = response;
        const defaultcurr = sessionStorage.getItem('defaultcurrency');
        console.log(defaultcurr);
        const regExp = /\(([^)]+)\)/;
        const getvalue = regExp.exec(defaultcurr);
        const symbolvalue = getvalue[1];
        const arrayofactivities = data.map((el) => ({
          value: el.id,
          expdate: el.tdate,
          descp: el.tdescription,
          paid: el.usersname,
          amnt: symbolvalue + numeral(el.tamount).format('0,0.00'),
        }));
        console.log(arrayofactivities);
        this.setState({
          activties: arrayofactivities,
        }); */
      })
      .catch((err) => console.log(err));
  };

  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      redirectVar = <Redirect to="/" />;
    }
    const { totalbalance, totalsummary } = this.state;
    const { userid, useremail } = this.state;
    console.log(totalbalance, userid, useremail, totalsummary);
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
              <div className="transactions-owe">you owe test</div>

              <div className="transactions-owed">you are owed test</div>
            </section>
          </div>

          <div className="dashboard-right" />
        </div>
      </div>
    );
  }
}

export default Dashboard;
