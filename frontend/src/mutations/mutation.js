import { gql } from 'apollo-boost';

const signupMutation = gql`
  mutation ($username: String, $email: String, $password: String) {
    signup(username: $username, email: $email, password: $password) {
      email
      username
      user_id
      status
      currencydef
      profilepic
      message
    }
  }
`;

const loginMutation = gql`
  mutation ($email: String, $password: String) {
    login(email: $email, password: $password) {
      email
      username
      user_id
      status
      currencydef
      profilepic
      message
    }
  }
`;

const updateprofileMutation = gql`
  mutation updateprofile(
    $user_id: ID
    $username: String
    $email: String
    $phonenumber: String
    $currencydef: String
    $timezone: String
    $language: String
    $profilepic: String
  ) {
    updateprofile(
      user_id: $user_id
      username: $username
      email: $email
      phonenumber: $phonenumber
      currencydef: $currencydef
      timezone: $timezone
      language: $language
      profilepic: $profilepic
    ) {
      email
      username
      status
      currencydef
      profilepic
      phonenumber
      timezone
      language
      message
    }
  }
`;

const creategroupMutation = gql`
  mutation creategroup(
    $user_id: ID
    $groupname: String
    $groupcreatedbyemail: String
    $groupmemebers: [String]
    $grouppic: String
  ) {
    creategroup(
      user_id: $user_id
      groupname: $groupname
      groupcreatedbyemail: $groupcreatedbyemail
      groupmemebers: $groupmemebers
      grouppic: $grouppic
    ) {
      status
      groupname
      message
    }
  }
`;

const acceptinviteMutation = gql`
  mutation acceptinvite($user_id: ID, $currentgrp: String, $email: String) {
    acceptinvite(user_id: $user_id, currentgrp: $currentgrp, email: $email) {
      status
      message
    }
  }
`;

const denyinviteMutation = gql`
  mutation denyinvite($user_id: ID, $currentgrp: String, $email: String) {
    denyinvite(user_id: $user_id, currentgrp: $currentgrp, email: $email) {
      status
      message
    }
  }
`;
const addbillMutation = gql`
  mutation addbill(
    $groupname: String
    $email: String
    $descript: String
    $amountvalue: Float
  ) {
    addbill(
      groupname: $groupname
      email: $email
      descript: $descript
      amountvalue: $amountvalue
    ) {
      status
      message
    }
  }
`;

const settleupMutation = gql`
  mutation settleup($user_id: ID, $email: String, $settleupwith: String) {
    settleup(user_id: $user_id, email: $email, settleupwith: $settleupwith) {
      status
      message
    }
  }
`;

const leavegroupMutation = gql`
  mutation leavegroup($user_id: ID, $email: String, $groupname: String) {
    leavegroup(user_id: $user_id, email: $email, groupname: $groupname) {
      status
      message
    }
  }
`;

export {
  signupMutation,
  loginMutation,
  updateprofileMutation,
  creategroupMutation,
  acceptinviteMutation,
  denyinviteMutation,
  addbillMutation,
  settleupMutation,
  leavegroupMutation,
};
