import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
// import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Modal, Form, Image } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import numeral from 'numeral';
import Sidebarcomp from '../navbar/sidebar';
import Navheader from '../navbar/navbar';
import '../navbar/navbar.css';
import '../dashboard/dashboard.css';
import './group.css';

class Groupdetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: '',
      useremail: '',
      grpname: '',
      popup: false,
      popup1: false,
      description: '',
      amount: '',
      activties: [{}],
      individuals: [{}],
      summaries: [{}],
      // objofpayees: { payee: '', totalblnc: 0 },
      // arrayofsummaries: [],
      redirecttomygroup: null,
    };
    this.showHandler = this.showHandler.bind(this);
    this.closeHandler = this.closeHandler.bind(this);
    this.decschangehandler = this.decschangehandler.bind(this);
    this.amtchangehandler = this.amtchangehandler.bind(this);
    this.addhandler = this.addhandler.bind(this);
    this.leavegrouphandler = this.leavegrouphandler.bind(this);
  }

  componentWillMount() {
    const userid1 = sessionStorage.getItem('userid');
    const useremail1 = sessionStorage.getItem('useremail');
    const grpname1 = sessionStorage.getItem('groupname');
    const activities1 = this.getgrpexpenses(grpname1);
    const individuals1 = this.getsummaryexpenses(grpname1);
    this.setState({
      userid: userid1,
      useremail: useremail1,
      grpname: grpname1,
      activties: activities1,
      individuals: individuals1,
    });
  }

  getgrpexpenses = (gpname) => {
    axios
      .get(`http://localhost:3001/getgrpexpenses/${gpname}`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response.data);
        console.log(typeof response.data);
        const { data } = response;
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
          formatedmonth: new Date(el.tdate).toLocaleString('default', {
            month: 'short',
          }),
          formatedday: new Date(el.tdate).getUTCDate(),
        }));
        console.log(arrayofactivities);
        this.setState({
          activties: arrayofactivities,
        });
      })
      .catch((err) => console.log(err));
  };

  getsummaryexpenses = (gpname) => {
    axios
      .get(`http://localhost:3001/getsummaryexpenses/${gpname}`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response.data);
        console.log(typeof response.data);
        const { data } = response;
        // const { summaries } = this.state;
        const defaultcurr = sessionStorage.getItem('defaultcurrency');
        console.log(defaultcurr);
        const regExp = /\(([^)]+)\)/;
        const getvalue = regExp.exec(defaultcurr);
        const symbolvalue = getvalue[1];
        const arrayofindividuals = data.map((el) => ({
          id: el.id,
          payer: el.payer,
          payee: el.payee,
          payername: el.payer_name,
          payeename: el.payee_name,
          balance: el.balance,
          formatedbalance: symbolvalue + numeral(el.balance).format('0,0.00'),
        }));

        let x;
        const payeeperson = [];
        const payeebalance = [];
        const payeename = [];
        // const objofpayees = { payee: '', totalblnc: 0 };

        for (let i = 0; i < arrayofindividuals.length; i += 1) {
          x = -1;
          if (!isEmpty(payeeperson)) {
            x = payeeperson.findIndex(
              (el) => el === arrayofindividuals[i].payee
            );
          }

          if (x === -1) {
            console.log('inside if x=-1');
            payeeperson.push(arrayofindividuals[i].payee);
            payeename.push(arrayofindividuals[i].payeename);
            payeebalance.push(arrayofindividuals[i].balance);
          } else {
            payeebalance[x] += arrayofindividuals[i].balance;
          }
        }
        const pp = Object.keys(payeeperson);
        const arrayofsummaries = pp.map((indx) => ({
          payee: payeename[indx],
          totalamt: payeebalance[indx],
          formattotalamt:
            symbolvalue + numeral(payeebalance[indx]).format('0,0.00'),
        }));
        console.log(arrayofsummaries);
        this.setState({
          summaries: [...arrayofsummaries],
        });

        this.setState({
          individuals: arrayofindividuals,
        });
      })
      .catch((err) => console.log(err));
  };

  showHandler = () => {
    this.setState({ popup: true });
  };

  closeHandler = () => {
    this.setState({ popup: false, description: '', amount: '' });
  };

  showHandler1 = () => {
    const { summaries } = this.state;
    const currentusrname = sessionStorage.getItem('username');
    console.log(summaries.length);
    for (let i = 0; i < summaries.length; i += 1) {
      if (
        currentusrname === summaries[i].payee &&
        summaries[i].totalamt === 0
      ) {
        this.setState({ popup1: true });
        return;
      }
    }
    alert('Please Clear all the debts to leave the group!');
  };

  closeHandler1 = () => {
    this.setState({ popup1: false });
  };

  decschangehandler = (e) => {
    this.setState({ description: e.target.value });
  };

  amtchangehandler = (e) => {
    this.setState({ amount: e.target.value });
  };

  addhandler = (des, amt, e) => {
    e.preventDefault();
    const descript = des;
    const amountvalue = amt;
    this.setState({ popup: false, description: '', amount: '' });
    const { grpname } = this.state;
    const { useremail } = this.state;
    // const useremail = sessionStorage.getItem('useremail');
    const bill = {
      descript,
      amountvalue,
      useremail,
      grpname,
    };
    console.log(bill);
    axios
      .post('http://localhost:3001/addabill', bill)
      .then((response) => {
        console.log('Status Code : ', response.status);
        console.log('response ', response.data);
        if (response.status === 200) {
          console.log(response.data);
          this.getgrpexpenses(grpname);
          this.getsummaryexpenses(grpname);
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

  leavegrouphandler = (e) => {
    e.preventDefault();
    this.setState({ popup: false });
    const { useremail, grpname, userid } = this.state;
    const leavegrp = {
      userid,
      useremail,
      grpname,
    };
    console.log(leavegrp);
    axios
      .post('http://localhost:3001/leavegroup', leavegrp)
      .then((response) => {
        console.log('Status Code : ', response.status);
        console.log('response ', response.data);
        if (response.status === 200) {
          console.log(response.data);
          const redirectVar1 = <Redirect to="/mygroups" />;
          this.setState({
            redirecttomygroup: redirectVar1,
          });
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

  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      redirectVar = <Redirect to="/" />;
    }
    const {
      grpname,
      activties,
      individuals,
      summaries,
      redirecttomygroup,
    } = this.state;
    const { popup, popup1 } = this.state;
    const { description, amount } = this.state;
    const expensepic = '/Group_photos/expense.png';
    let checkifactivitiesnull = false;
    if (isEmpty(activties)) {
      checkifactivitiesnull = true;
    }
    let checkifsummiesnull = false;
    if (isEmpty(individuals)) {
      checkifsummiesnull = true;
    }
    console.log(activties);
    return (
      <div>
        {redirectVar}
        {redirecttomygroup}
        <Navheader />
        <div className="grouppage-flex">
          <div>
            <Sidebarcomp />
          </div>
        </div>
        <div className="grouppage-box">
          <section className="grouppage-heading-buttons">
            <section className="grouppage-heading">
              <h1>Group Name {grpname}</h1>
              <ul className="grouppage-button">
                <li>
                  <Button className="login-default" onClick={this.showHandler}>
                    Add an Expense
                  </Button>{' '}
                  <Modal show={popup} onHide={this.closeHandler}>
                    <Modal.Header closeButton>
                      <Modal.Title>
                        Add an Expense
                        <div>With you and everyone</div>
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form.Group>
                        <Image
                          src={expensepic}
                          className="avatarfordesc"
                          alt="expense pic"
                        />
                        <br />
                        <Form.Label>Description: </Form.Label>
                        <Form.Control
                          type="text"
                          onChange={this.decschangehandler}
                          value={description}
                          placeholder="Decsription"
                        />
                        <Form.Label>Amount: </Form.Label>
                        <Form.Control
                          type="text"
                          onChange={this.amtchangehandler}
                          value={amount}
                          placeholder="Amount"
                        />
                      </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        className="login-default"
                        type="submit"
                        onClick={(e) => this.addhandler(description, amount, e)}
                      >
                        Add
                      </Button>
                      <Button
                        className="Signup-default"
                        onClick={this.closeHandler}
                      >
                        Cancel
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  <Button
                    className="Signup-default"
                    onClick={this.showHandler1}
                  >
                    Leave Group
                  </Button>
                  <Modal show={popup1} onHide={this.closeHandler1}>
                    <Modal.Header closeButton>
                      <Modal.Title>Leave Group</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Do you wish to Leave the group?</Modal.Body>
                    <Modal.Footer>
                      <Button
                        className="login-default"
                        onClick={(e) => this.leavegrouphandler(e)}
                      >
                        √ Yes
                      </Button>
                      <Button
                        className="Signup-default"
                        onClick={this.closeHandler1}
                      >
                        x No
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </li>
              </ul>
            </section>

            <section className="grouppage-center-sec">
              <div className="grouppage-center-section-block" />

              <div className="grouppage-center-section-block">
                <div className="grouppage-block-border">
                  {checkifactivitiesnull ? (
                    <h2>No transactions to display!</h2>
                  ) : (
                    <div>
                      {' '}
                      {activties.map((expense) => (
                        <ul className="group-expenses_1">
                          <li>
                            <p>
                              <div className="Row">
                                <div className="Column">
                                  {expense.formatedmonth} <br />{' '}
                                  {expense.formatedday}{' '}
                                </div>
                                <div className="Column">
                                  {' '}
                                  <Image
                                    src={expensepic}
                                    className="avatarfordisplay"
                                    alt="expense pic"
                                  />
                                </div>

                                <div className="Column">{expense.descp}</div>
                                <div className="Column"> </div>
                                <div className="Column"> </div>
                                <div className="Column"> </div>
                                <div className="Column"> </div>
                                <div className="Column"> </div>
                                <div className="Column"> </div>
                                <div className="Column">
                                  {expense.paid} <br /> {expense.amnt}
                                </div>
                              </div>
                              <hr
                                style={{
                                  height: '2px',
                                  border: 'none',
                                  color: 'black',
                                  'background-color': 'Grey',
                                }}
                              />
                            </p>
                          </li>
                        </ul>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </section>
        </div>

        <div className="grouppage-right" />
        <div className="title">You Owe</div>
        {checkifsummiesnull ? (
          <h2>Will be displayed after invites are accepted !</h2>
        ) : (
          <div>
            {' '}
            <h2>Groups Summary</h2>
            {summaries.map((expense) => (
              <ul className="group-expenses">
                <li>
                  <p>
                    {expense.payee} owes {expense.formattotalamt} in Total{' '}
                  </p>
                </li>
              </ul>
            ))}
            <h2>Who Owes how much</h2>
            {individuals.map((expense) => (
              <ul className="group-expenses">
                <li>
                  <p>
                    {expense.payeename} owes {expense.payername} :{' '}
                    {expense.formatedbalance}
                  </p>
                </li>
              </ul>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Groupdetails;
