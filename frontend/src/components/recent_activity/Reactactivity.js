import React, { Component } from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import { Redirect } from 'react-router';
// import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import numeral from 'numeral';
import { Dropdown } from 'react-bootstrap';
import Select from 'react-select';
// import { Row, Col, Container, Jumbotron } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import Sidebarcomp from '../navbar/sidebar';
import Navheader from '../navbar/navbar';
import '../navbar/navbar.css';
import '../dashboard/dashboard.css';

class Recentactivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: '',
      recent: [],
      groupslist: [],
      gpselectoptions: [],
      selectedvalue: [],
      asc: false,
      desc: true,
    };
    this.sorthandlerasc = this.sorthandlerasc.bind(this);
    this.sorthandlerdesc = this.sorthandlerdesc.bind(this);
    // this.getrecentacitvities = this.getrecentacitvities.bind(this);
  }

  componentWillMount() {
    const userid1 = sessionStorage.getItem('userid');
    const recentacitvity1 = this.getrecentacitvities(userid1);
    const getuserpgroups = this.getuserpgroups(userid1);
    this.setState({
      userid: userid1,
      recent: recentacitvity1,
      groupslist: getuserpgroups,
    });
  }

  getuserpgroups = (userid) => {
    axios
      .get(`http://localhost:3001/getuserpgroups/${userid}`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response.data);
        console.log(typeof response.data);
        const newaar = response.data.map((el) => el.gpname);
        console.log(newaar);
        const { data } = response;
        const arrayforselect = data.map((el) => ({
          value: el.gpname,
          label: el.gpname,
        }));
        console.log(arrayforselect);
        this.setState({
          groupslist: newaar,
          gpselectoptions: arrayforselect,
        });
        const { gpselectoptions } = this.state;
        const obj = { value: 'All Groups', label: 'All Groups' };
        this.setState({
          gpselectoptions: [...gpselectoptions, obj],
        });
        console.log(gpselectoptions);
      })
      .catch((err) => console.log(err));
  };

  sorthandlerasc = () => {
    const { recent, asc, desc } = this.state;
    console.log(recent);
    if (asc === false && desc === true) {
      const sortasc = (recent1) => (key) =>
        [...recent1]
          .sort((intitial, next) => intitial[key] > next[key])
          .reverse();

      const ascsort = sortasc(recent)('date1');
      this.setState({
        recent: ascsort,
        asc: true,
        desc: false,
      });
    }
  };

  sorthandlerdesc = () => {
    const { recent, asc, desc } = this.state;
    console.log(recent);
    if (asc === true && desc === false) {
      const sortadesc = (recent1) => (key) =>
        [...recent1]
          .sort((intitial, next) => intitial[key] > next[key])
          .reverse();

      const descsort = sortadesc(recent)('date1');
      this.setState({
        recent: descsort,
        asc: false,
        desc: true,
      });
    }
  };

  gpselectoptionshandler = (e) => {
    // const { selectvalue } = this.state;
    const newarr = e.value;
    console.log(e.value);
    this.setState({ selectedvalue: newarr });
  };

  displayresults = (groupname) => {
    const { recent } = this.state;
    console.log(recent);
    console.log(groupname);
    const filtergrp = (recent1) => (key) =>
      [...recent1].filter((grp1) => grp1[key] === groupname);

    const filtergrps = filtergrp(recent)('gpname');
    console.log(filtergrps);
    this.setState({
      recent: filtergrps,
    });
  };

  getrecentacitvities = (gpname) => {
    axios
      .get(`http://localhost:3001/getrecentacitvities/${gpname}`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response.data);
        console.log(typeof response.data);
        const { data } = response;
        console.log(data);
        const date = new Date('2013-03-10T02:00:00Z');
        console.log(
          `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        );
        console.log(
          `${new Date('2013-03-10T02:00:00Z').getFullYear()}-${
            new Date('2013-03-10T02:00:00Z').getMonth() + 1
          }-${new Date('2013-03-10T02:00:00Z').getDate()}`
        );
        const defaultcurr = sessionStorage.getItem('defaultcurrency');
        console.log(defaultcurr);
        const regExp = /\(([^)]+)\)/;
        const getvalue = regExp.exec(defaultcurr);
        const symbolvalue = getvalue[1];
        const arrayofrecentactivities = data.map((el) => ({
          paid: el.usersname,
          gpname: el.gpname,
          descp: el.tdescription,
          amnt: symbolvalue + numeral(el.tamount).format('0,0.00'),
          date1: el.tdate,
          formatedmonth: new Date(el.tdate).toLocaleString('default', {
            month: 'short',
          }),
          formatedday: new Date(el.tdate).getUTCDate(),
        }));
        console.log(arrayofrecentactivities);
        this.setState({
          recent: arrayofrecentactivities,
        });
      })
      .catch((err) => console.log(err));
  };

  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      redirectVar = <Redirect to="/" />;
    }
    const currusername = sessionStorage.getItem('username');
    const {
      recent,
      userid,
      groupslist,
      gpselectoptions,
      selectedvalue,
    } = this.state;
    console.log(recent, userid, groupslist, gpselectoptions, selectedvalue);
    let checkifactivitynull = false;
    if (isEmpty(recent)) {
      checkifactivitynull = true;
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
                <h1>Recent Activity </h1>

                <ul className="button-right">
                  <li />
                </ul>
              </section>

              <section className="dashboard-center-sec">
                <div className="dashboard-center-section-block">
                  <div className="title">
                    <h2>Recent activity</h2>
                  </div>
                </div>

                <div className="dashboard-center-section-block">
                  <div className="dashboard-block-border">
                    <div className="title">Recent activity </div>
                    <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Sort
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          onSelect={() => {
                            this.sorthandlerasc();
                          }}
                        >
                          Ascending{' '}
                        </Dropdown.Item>
                        <Dropdown.Item
                          onSelect={() => {
                            this.sorthandlerdesc();
                          }}
                        >
                          Descending
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>

                <div className="dashboard-center-section-block">
                  <div className="title">Recent activity </div>
                  <div className="mygroups-right" style={{ width: '50px' }} />

                  <Select
                    options={gpselectoptions}
                    placeholder="GroupName"
                    className="div-select"
                    onChange={(e) => this.gpselectoptionshandler(e)}
                  />
                  <span>
                    <Button
                      className="mygroups-default"
                      onClick={(e) => this.displayresults(selectedvalue, e)}
                    >
                      GO
                    </Button>
                  </span>
                </div>
              </section>
            </section>

            <section className="transcations-sec">
              <div className="tranactions-heading">
                {checkifactivitynull ? (
                  <h2>YOU HAVE NO ACTIVTIES TO DISPLAY ! </h2>
                ) : (
                  <div>
                    {' '}
                    {recent.map((activities) => (
                      <ul className="recent-expenses">
                        <li>
                          <p>
                            {(() => {
                              if (
                                JSON.stringify(activities.paid) ===
                                JSON.stringify(currusername)
                              ) {
                                return <div>YOU </div>;
                              }

                              return <div>{activities.paid} </div>;
                            })()}
                            <span>
                              {' '}
                              paid {activities.amnt} &quot;{activities.descp}
                              &quot; in &quot;
                              {activities.gpname}&quot;
                            </span>
                            <div>
                              <span> {activities.date1} </span>
                            </div>
                          </p>
                        </li>
                      </ul>
                    ))}
                  </div>
                )}
              </div>
              <div className="transactions-owe" />
              <div className="transactions-owed" />
            </section>
          </div>

          <div className="dashboard-right" />
        </div>
      </div>
    );
  }
}
export default Recentactivity;
