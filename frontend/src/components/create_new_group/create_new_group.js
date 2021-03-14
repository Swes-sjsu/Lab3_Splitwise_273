import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { Form, Image } from 'react-bootstrap';
import { Redirect } from 'react-router';
import Navheader from '../navbar/navbar';
import '../navbar/navbar.css';
// import TextField from '@material-ui/core/TextField';
// import Autocomplete from '@material-ui/lab/Autocomplete';
class Createnewgroup extends Component {
  constructor(props) {
    super(props);
    this.groupform = React.createRef();
    this.state = {
      groupname: '',
      groupmembers: [{ gmusername: '', gmemail: '' }],
      userid: '',
      grouphoto: null,
      updatedpic: false,
    };
    // Bind the handlers to this class
    this.groupnameChangeHandler = this.groupnameChangeHandler.bind(this);
    this.groupmembersnameChangeHandler = this.groupmembersnameChangeHandler.bind(
      this
    );
    this.groupmembersemailChangeHandler = this.groupmembersemailChangeHandler.bind(
      this
    );
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

  getuseroptions = (userid) => {
    axios
      .get(`http://localhost:3001/getuseroptions/${userid}`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => console.log(err));
  };

  usrchangeHandler = (e) => {
    this.setState({
      username: e.target.value,
    });
  };

  groupnameChangeHandler = (e) => {
    this.setState({
      groupname: e.target.value,
    });
  };

  groupmembersnameChangeHandler = (id, e) => {
    //  const { groupmembers } = this.state;
    // eslint-disable-next-line react/destructuring-assignment
    // const updatedList = [...this.state.groupmembers];
    // const gmusername1= {...updatedList[id], {updatedList[id].gmusername: e.target.value}};
    const { groupmembers } = this.state;
    const updatedList = [...groupmembers];
    updatedList[id].gmusername = e.target.value;
    console.log(updatedList);
    this.setState(updatedList);
    /* const newgroupmembers = groupmembers.map((groupmember, gmid) => {
      if (id !== gmid) return groupmember;
      return [...groupmember, e.target.value];
    });
    this.setState({
      groupmembers: newgroupmembers,
    });
    // eslint-disable-next-line react/destructuring-assignment
    console.log(groupmembers); */
  };

  groupmembersemailChangeHandler = (id, e) => {
    const { groupmembers } = this.state;
    const updatedList = [...groupmembers];
    // const gmusername1= {...updatedList[id], {updatedList[id].gmusername: e.target.value}};
    updatedList[id].gmemail = e.target.value;
    console.log(updatedList);
    this.setState(updatedList);
  };

  groupphtochangeHandler = (e) => {
    this.setState({
      grouphoto: e.target.files[0],
      updatedpic: true,
    });
    console.log(e.target.files[0]);
    console.log(e.target.files[0].name);
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
    /* const updatedList = [...groupmembers];
    updatedList.splice(id, 1);
    console.log(updatedList);
    this.setState({
      groupmembers: updatedList,
    }); */
    this.setState({
      groupmembers: groupmembers.filter((s) => s !== id),
    });
  };

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
    if (groupname === '') {
      alert('Please enter a group name');
    }
    for (let i = 0; i < groupmembers.length; i += 1) {
      if (groupmembers[i].gmusername === '' || groupmembers[i].gmemail === '') {
        alert('Please fill the username and email id');
      } else {
        gplist.push(groupmembers[i].gmemail);
      }
    }
    console.log(gplist);
    const formdata = new FormData(this.groupform.current);
    if (updatedpic) {
      formdata.append('group_avatar', grouphoto, grouphoto.name);
    }
    formdata.append('idusers', userid);
    formdata.append('groupcreatedby', username);
    formdata.append('groupcreatedbyemail', email);
    formdata.append('groupcreatedbyemail[]', gplist);
    axios({
      method: 'post',
      url: 'http://localhost:3001/createnewgroup',
      data: formdata,
      headers: {
        // eslint-disable-next-line no-underscore-dangle
        'content-type': `multipart/form-data; boundary=${formdata._boundary}`,
      },
    })
      .then((response) => {
        console.log('Status Code : ', response.status);
        console.log('response ', response.data);
        if (response.status === 200) {
          const redirectVar1 = <Redirect to="/group" />;
          this.setState({
            redirecttogroup: redirectVar1,
          });
        } else {
          console.log(response.data);
          alert(response.data);
          this.setState({
            redirecttogroup: null,
          });
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        alert(err.response.data);
        this.setState({
          errorMessage: err.response.data,
        });
      });
  };

  render() {
    const { email, username } = this.state;
    const { groupmembers } = this.state;
    const { errorMessage } = this.state;
    const { redirecttogroup } = this.state;
    console.log(username, email);
    const grouppic = '/Group_photos/default_avatar.png';
    return (
      <div>
        <Navheader />
        <div id="group_avatar">
          <Image src={grouppic} className="avatar" alt="group pic" />
          <label htmlFor="group_avatar">
            Change your group avatar
            <input
              type="file"
              name="group_avatar"
              id="group_avatar"
              onChange={this.groupphtochangeHandler}
            />
          </label>
        </div>
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
            <div className="group_members">
              <div className="users">
                <h2>Group members</h2>
                <div className="group-member">
                  <div className="grpnameemail">
                    {username}(<em>{email}</em>)
                  </div>
                  {groupmembers.map((groupmember, id) => (
                    <div className="grpnameemail">
                      <input
                        placeholder="Name"
                        className="name ui-autocomplete-input"
                        type="text"
                        value={groupmember.gmusersname}
                        name={`group_members_${id + 1}_username`}
                        id={`group_members_${id + 1}_username`}
                        onChange={(e) =>
                          this.groupmembersnameChangeHandler(id, e)
                        }
                        // autoComplete="off"
                        required
                      />
                      <input
                        placeholder="Email address "
                        className="email"
                        type="email"
                        value={groupmember.gmemail}
                        name={`group_members_${id + 1}_email`}
                        id={`group_members_${id + 1}_email`}
                        onChange={(e) =>
                          this.groupmembersemailChangeHandler(id, e)
                        }
                        required
                      />
                      <button
                        type="button"
                        name="removegm"
                        onClick={() => this.removegroupmember(groupmember)}
                        className="removegm"
                      >
                        X
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={this.addgroupmember}
                    className="addgm"
                  >
                    + Add Person
                  </button>
                </div>
              </div>
              <div id="invite_link_container">
                <h2>Invite group members by link</h2>
                <div className="invitelink">
                  Send this link to your friends, and when they click it,they
                  will automatically be added to this group.
                  <div />
                </div>
                <div className="save">
                  <button
                    type="button"
                    className="Signup-default"
                    onClick={this.submitgroupcreate}
                    formNoValidate
                  >
                    Save
                  </button>
                  <p className="errmsg" style={{ color: 'maroon' }}>
                    {' '}
                    {errorMessage}{' '}
                  </p>
                  {redirecttogroup}
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}
export default Createnewgroup;
