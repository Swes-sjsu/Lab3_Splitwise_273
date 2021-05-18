/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import Select from 'react-select';
import '../../App.css';
import { Form, Image } from 'react-bootstrap';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { uploadFile } from 'react-s3';
import Navheader from '../navbar/navbar';
import { creategroupMutation } from '../../mutations/mutation';
import { useroptionsQuery } from '../../query/query';
import '../navbar/navbar.css';

class Createnewgroup extends Component {
  constructor(props) {
    super(props);
    this.groupform = React.createRef();
    this.state = {
      selectUsername: [],
      groupname: '',
      groupmembers: [{ gmusername: '', gmemail: '' }],
      userid: '',
      grouphoto: null,
      updatedpic: false,
    };
    // Bind the handlers to this class
    this.groupnameChangeHandler = this.groupnameChangeHandler.bind(this);
    this.groupmembersChangeHandler = this.groupmembersChangeHandler.bind(this);
    this.groupphtochangeHandler = this.groupphtochangeHandler.bind(this);
    this.addgroupmember = this.addgroupmember.bind(this);
    this.removegroupmember = this.removegroupmember.bind(this);
    this.submitgroupcreate = this.submitgroupcreate.bind(this);
  }

  componentWillMount() {
    const userid1 = sessionStorage.getItem('userid');
    this.setState({
      userid: userid1,
      email: sessionStorage.getItem('useremail'),
      username: sessionStorage.getItem('username'),
      redirecttogroup: null,
    });
    this.getuseroptions(userid1);
  }

  // get the list of all users part of application to be used for the dropdown selection except the current users
  getuseroptions = async (userid) => {
    try {
      const response = await this.props.client.query({
        query: useroptionsQuery,
        variables: { user_id: userid },
      });
      const { useroptions } = response.data;
      const usernametext = useroptions.map((txt) => ({
        value: txt.email,
        label: `${txt.username}(${txt.email})`,
      }));
      console.log(usernametext);
      this.setState({ selectUsername: usernametext });
    } catch (err) {
      console.log(err);
      alert(err);
      this.setState({
        errorMessage: JSON.stringify(err),
      });
    }
  };

  groupnameChangeHandler = (e) => {
    this.setState({
      groupname: e.target.value,
    });
  };

  groupmembersChangeHandler = (id, e) => {
    const { groupmembers } = this.state;
    const updatedList = [...groupmembers];
    updatedList[id].gmemail = e.value;
    updatedList[id].gmusername = e.label;
    console.log(updatedList);
    this.setState(updatedList);
  };

  groupphtochangeHandler = (e) => {
    const S3_BUCKET = 'splitwise-profilepictures';
    const REGION = 'us-east-1';
    const ACCESS_KEY = 'AKIAJSP2ZFMVUPCPOXLA';
    const SECRET_ACCESS_KEY = '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';

    const config = {
      bucketName: S3_BUCKET,
      region: REGION,
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_ACCESS_KEY,
    };

    console.log(e.target.files[0]);
    console.log(e.target.files[0].name);
    this.setState({
      // profilephoto: e.target.files[0],
      setSelectedfile: e.target.files[0],
      updatedpic: true,
    });
    const { setSelectedfile } = this.state;
    console.log(setSelectedfile);
    uploadFile(e.target.files[0], config)
      .then((data) => {
        const loc = data.location;
        console.log(loc);
        this.setState({
          grouphoto: loc,
        });
      })
      .catch((err) => console.error(err));
  };

  addgroupmember = () => {
    this.setState((prevstate) => ({
      groupmembers: [
        ...prevstate.groupmembers,
        { gmusername: '', gmemail: '' },
      ],
    }));
  };

  removegroupmember = (id) => {
    const { groupmembers } = this.state;
    this.setState({
      groupmembers: groupmembers.filter((s) => s.gmemail !== id.gmemail),
    });
  };

  // create group with the memebers added
  submitgroupcreate = async (e) => {
    e.preventDefault();
    const {
      groupname,
      username,
      email,
      userid,
      grouphoto,
      updatedpic,
      groupmembers,
    } = this.state;
    const gplist = [];
    console.log(username, updatedpic);
    if (groupname === '') {
      alert('Please enter a group name');
      this.setState({
        errorMessage1: 'Please enter a group name!',
      });
      return;
    }
    for (let i = 0; i < groupmembers.length; i += 1) {
      if (groupmembers[i].gmemail === '') {
        alert('Please fill the username or email id');
        return;
      }
      gplist.push(groupmembers[i].gmemail);
    }
    console.log(gplist);

    let duplicateExist = false;
    duplicateExist = gplist.some(
      (element, index) => gplist.indexOf(element) !== index
    );

    if (duplicateExist) {
      alert('Please select unique group memebers!');
      this.setState({
        errorMessage: 'Please select unique group members!',
      });
      return;
    }

    try {
      const response = await this.props.creategroupMutation({
        variables: {
          user_id: userid,
          groupname,
          groupcreatedbyemail: email,
          groupmemebers: gplist,
          grouppic: grouphoto,
        },
      });
      console.log(response.data.creategroup);
      console.log('Status Code : ', response.status);
      console.log('response ', response.data);
      if (response.data.creategroup.status === 200) {
        const redirectVar1 = (
          <Redirect to={{ pathname: '/group', state: { gName: groupname } }} />
        );
        this.setState({
          redirecttogroup: redirectVar1,
        });

        sessionStorage.setItem('groupname', response.data);
      }
    } catch (err) {
      console.log(err);
      alert(err);
      this.setState({
        errorMessage: JSON.stringify(err),
      });
    }
  };

  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      redirectVar = <Redirect to="/" />;
    }
    const { email, username } = this.state;
    const { groupmembers } = this.state;
    const { errorMessage, errorMessage1 } = this.state;
    const { redirecttogroup } = this.state;
    const { selectUsername } = this.state;
    console.log(username, email);
    const grouppic = '/Group_photos/default_avatar.png';
    return (
      <div>
        {redirectVar}
        <Navheader />

        <div className="profilepage-block">
          <section
            className=" createpage-blocksec"
            style={{
              float: 'left',
              width: '300px',
              height: '300px',
              'padding-left': '20px',
              'padding-top': '1px',
            }}
          >
            <div id="creategroup_avatar">
              <Image src={grouppic} className="grpavatar" alt="group pic" />
              <br />
              <label htmlFor="group_avatar">
                Change your group avatar <br />
                <input
                  type="file"
                  name="group_avatar"
                  id="group_avatar"
                  onChange={this.groupphtochangeHandler}
                />
              </label>
              <br />
            </div>
          </section>

          <section className="create-group-box">
            <section
              className="right-box"
              style={{
                float: 'right',
                width: '350px',
                'padding-left': '20px',
                'padding-top': '1px',
              }}
            >
              <Form ref={this.groupform} id="groupform" className="groupform">
                <div className="createnewgroup">
                  <h2>START A NEW GROUP</h2>
                  <div>
                    <h3>My group shall be called....</h3>
                    <input
                      type="text"
                      name="group_name"
                      id="group_name"
                      onChange={this.groupnameChangeHandler}
                      required
                    />
                  </div>
                  <p className="errmsg" style={{ color: 'maroon' }}>
                    {' '}
                    {errorMessage1}{' '}
                  </p>
                  <br />
                  <div className="group_members">
                    <div className="users">
                      <h2>Group members</h2>
                      <div className="group-member">
                        <div className="grpnameemail">
                          {username}(<em>{email}</em>)
                        </div>
                        {groupmembers.map((groupmember, id) => (
                          <div
                            className="grpnameemail"
                            style={{
                              width: '300px',
                              display: 'flex',
                              flexDirection: 'row',
                            }}
                          >
                            <div
                              className="grpnameemail"
                              style={{
                                width: '300px',
                              }}
                            >
                              <Select
                                options={selectUsername}
                                className="div-select"
                                type="text"
                                value={{
                                  label: groupmember.gmusername,
                                  value: groupmember.gmemail,
                                }}
                                name={`group_members_${id + 1}_username`}
                                id={`group_members_${id + 1}_username`}
                                onChange={(e) =>
                                  this.groupmembersChangeHandler(id, e)
                                }
                                // autoComplete="off"
                                required
                              />
                            </div>
                            <button
                              type="button"
                              name="removegm"
                              onClick={() =>
                                this.removegroupmember(groupmember)
                              }
                              className="removegm"
                              style={{
                                'background-color': 'white',
                                border: 'none',
                                color: '#ff652f',
                                'font-weight': 'bolder',
                              }}
                            >
                              X
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={this.addgroupmember}
                          className="addgm"
                          style={{
                            'background-color': 'white',
                            color: '#3ac3ab',
                            border: 'none',
                            'font-weight': 'bolder',
                          }}
                        >
                          + Add Person
                        </button>
                      </div>
                    </div>
                    <div id="invite_link_container">
                      <div className="invitelink">
                        <p className="errmsg" style={{ color: 'maroon' }}>
                          {' '}
                          {errorMessage}{' '}
                        </p>
                        <div />
                      </div>
                      <div className="savebtn">
                        <button
                          data-testid="Create"
                          type="button"
                          className="Signup-default"
                          onClick={this.submitgroupcreate}
                          formNoValidate
                        >
                          Save
                        </button>
                        {redirecttogroup}
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </section>
          </section>
        </div>
      </div>
    );
  }
}
// export default Createnewgroup;
export default compose(
  withApollo,
  graphql(creategroupMutation, { name: 'creategroupMutation' })
  // graphql(useroptionsQuery, { name: 'useroptionsQuery' })
)(Createnewgroup);
