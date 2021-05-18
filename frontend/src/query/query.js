import { gql } from 'apollo-boost';
// import gql from 'graphql-tag';

const userdetailsQuery = gql`
  query userdetails($user_id: ID) {
    userdetails(user_id: $user_id) {
      email
      username
      user_id
      status
      currencydef
      profilepic
      message
      timezone
      language
      phonenumber
    }
  }
`;

const useroptionsQuery = gql`
  query useroptions($user_id: ID) {
    useroptions(user_id: $user_id) {
      email
      username
      user_id
    }
  }
`;

const usergroupsQuery = gql`
  query usergroups($user_id: ID) {
    usergroups(user_id: $user_id) {
      groupname
    }
  }
`;

const usergroupinvitesQuery = gql`
  query usergroupsinvites($user_id: ID) {
    usergroupsinvites(user_id: $user_id) {
      groupname
    }
  }
`;

const getgroupexpensesQuery = gql`
  query groupexpenses($groupname: String) {
    groupexpenses(groupname: $groupname) {
      tid
      tamount
      tdescription
      tdate
      payedBy
    }
  }
`;
const getgroupsummaryexpensesQuery = gql`
  query groupsummaryexpenses($groupname: String) {
    groupsummaryexpenses(groupname: $groupname) {
      bid
      payer
      payee
      payer_username
      payee_username
      balance
      settled
    }
  }
`;

const gettotalsummaryQuery = gql`
  query totalsummary($user_id: ID) {
    totalsummary(user_id: $user_id) {
      payer
      payee
      payer_username
      payee_username
      balance
      settled
      Total_balance
      You_owe
      You_are_owed
      gpname
    }
  }
`;
export {
  userdetailsQuery,
  useroptionsQuery,
  usergroupsQuery,
  usergroupinvitesQuery,
  getgroupexpensesQuery,
  getgroupsummaryexpensesQuery,
  gettotalsummaryQuery,
};
