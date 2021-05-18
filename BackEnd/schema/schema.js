const graphql = require('graphql');
const dbconnection = require('../config/conn');
const bcrypt = require('bcryptjs');
var multer = require('multer');
var cookieParser = require('cookie-parser');
const mysql = require('mysql');
const loginQuery = require('../routes/login');
const signupQuery = require('../routes/signup');
const {
  userdetailsQuery,
  useroptionsQuery,
  getuserpgroupsQuery,
  getpgroupinvitesQuery,
  getgrpexpensesQuery,
  getsummaryexpensesQuery,
  gettotalbalancesQuery,
} = require('../routes/getqueries');
const { acceptinvitationQuery, denyinvitationQuery } = require('../routes/acceptdenyinvite');
const { addbillQuery, settleupQuery } = require('../routes/addbill');
const { creategroupQuery, leavegroupQuery } = require('../routes/create&leavegroup');
const updateprofileQuery = require('../routes/updateprofile');
const saltRounds = 10;

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
  GraphQLTime,
  GraphQLNonNull,
  GraphQLInputObjectType,
} = graphql;

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    username: { type: GraphQLString },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
    user_id: { type: GraphQLInt },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    username: { type: GraphQLString },
    currencydef: { type: GraphQLString },
    phonenumber: { type: GraphQLString },
    timezone: { type: GraphQLString },
    language: { type: GraphQLString },
    profilepic: { type: GraphQLString },
  }),
});

const GroupType = new GraphQLObjectType({
  name: 'Group',
  fields: () => ({
    groupname: { type: GraphQLString },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
    groupmemebers: { type: new GraphQLList(GraphQLString) },
    grouppic: { type: GraphQLString },
  }),
});

const TransactionsType = new GraphQLObjectType({
  name: 'Transactions',
  fields: () => ({
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
    tid: { type: GraphQLID },
    tdate: { type: GraphQLFloat },
    tdescription: { type: GraphQLString },
    payedBy: { type: GraphQLString },
    tamount: { type: GraphQLFloat },
    groupname : { type: GraphQLString },
  }),
});

const BalancesType = new GraphQLObjectType({
  name: 'Balances',
  fields: () => ({
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
    bid: { type: GraphQLID },
    payer: { type: GraphQLString }, // payer email
    payee: { type: GraphQLString }, // payee email
    payer_username: { type: GraphQLString },
    payee_username: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    settled: { type: GraphQLInt },
    Total_balance: { type: GraphQLFloat },
    You_owe: { type: GraphQLFloat },
    You_are_owed: { type: GraphQLFloat },
    gpname: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Root Query',
  fields: {
    userdetails: {
      type: UserType,
      args: {
        user_id: { type: GraphQLID },
      },
      async resolve(parent, args, context) {
        let result = await userdetailsQuery(args);
        console.log("result from query backend", result); 
        return result;
      },
    },
    useroptions: {
      type: new GraphQLList(UserType),
      args: {
        user_id: { type: GraphQLID },
      },
      async resolve(parent, args, context) {
        let result = await useroptionsQuery(args);
        console.log(result);
        return result;
      },
    },
    usergroups: {
      type: new GraphQLList(GroupType),
      args: {
        user_id: { type: GraphQLID },
      },
      async resolve(parent, args, context) {
        let result = await getuserpgroupsQuery(args);
        console.log(result);
        return result;
      },
    },
    usergroupsinvites: {
      type: new GraphQLList(GroupType),
      args: {
        user_id: { type: GraphQLID },
      },
      async resolve(parent, args, context) {
        let result = await getpgroupinvitesQuery(args);
        console.log(result);
        return result;
      },
    },
    groupexpenses: {
      type: new GraphQLList(TransactionsType),
      args: {
        groupname: { type: GraphQLString },
      },
      async resolve(parent, args, context) {
        let result = await getgrpexpensesQuery(args);
        console.log(result);
        return result;
      },
    },
    groupsummaryexpenses: {
      type: new GraphQLList(BalancesType),
      args: {
        groupname: { type: GraphQLString },
      },
      async resolve(parent, args, context) {
        let result = await getsummaryexpensesQuery(args);
        console.log(result);
        return result;
      },
    },
    totalsummary: {
      type: new GraphQLList(BalancesType),
      args: {
        user_id: { type: GraphQLID },
      },
      async resolve(parent, args, context) {
        let result = await gettotalbalancesQuery(args);
        console.log(result);
        return result;
      },
    },
  },
});
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, args, context) {
        let result = await signupQuery(args);
        context.res.cookie('cookie', result.email, {
          maxAge: 900000,
          httpOnly: false,
          path: '/',
          sameSite: 'lax',
        });
        context.req.session.user = result.username;
        context.req.session.email = result.email;
        return result;
      },
    },
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, args, context) {
        let result = await loginQuery(args);
        console.log(result);
        context.res.cookie('cookie', result.email, { maxAge: 900000, httpOnly: false, path: '/' });
        context.req.session.user = result.username;
        context.req.session.email = result.email;
        return result;
      },
    },
    updateprofile: {
      type: UserType,
      args: {
        user_id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        phonenumber: { type: GraphQLString },
        currencydef: { type: GraphQLString },
        timezone: { type: GraphQLString },
        language: { type: GraphQLString },
        profilepic: { type: GraphQLString },
      },
      async resolve(parent, args, context) {
        let result = await updateprofileQuery(args);
        console.log("Result from mutation backend ", result);
        context.req.session.user = result.username;
        context.req.session.email = result.email;
        return result;
      },
    },
    creategroup: {
      type: GroupType,
      args: {
        groupname: { type: GraphQLString },
        user_id: { type: GraphQLID },
        groupcreatedbyemail: { type: GraphQLString },
        groupmemebers: { type: new GraphQLList(GraphQLString) },
        grouppic: { type: GraphQLString },
      },
      async resolve(parent, args, context) {
        let result = await creategroupQuery(args);
        console.log(result);
        return result;
      },
    },
    acceptinvite: {
      type: GroupType,
      args: {
        currentgrp: { type: GraphQLString },
        user_id: { type: GraphQLID },
        email: { type: GraphQLString },
      },
      async resolve(parent, args, context) {
        let result = await acceptinvitationQuery(args);
        console.log(result);
        return result;
      },
    },
    denyinvite: {
      type: GroupType,
      args: {
        currentgrp: { type: GraphQLString },
        user_id: { type: GraphQLID },
        email: { type: GraphQLString },
      },
      async resolve(parent, args, context) {
        let result = await denyinvitationQuery(args);
        console.log(result);
        return result;
      },
    },
    addbill: {
      type: TransactionsType,
      args: {
        groupname: { type: GraphQLString },
        email: { type: GraphQLString },
        descript: { type: GraphQLString },
        amountvalue: { type: GraphQLFloat },
      },
      async resolve(parent, args, context) {
        let result = await addbillQuery(args);
        console.log(result);
        return result;
      },
    },
    settleup: {
      type: TransactionsType,
      args: {
        user_id: { type: GraphQLID },
        email: { type: GraphQLString },
        settleupwith: { type: GraphQLString },
      },
      async resolve(parent, args, context) {
        let result = await settleupQuery(args);
        console.log(result);
        return result;
      },
    },
    leavegroup: {
      type: GroupType,
      args: {
        user_id: { type: GraphQLID },
        email: { type: GraphQLString },
        groupname: { type: GraphQLString },
      },
      async resolve(parent, args, context) {
        let result = await leavegroupQuery(args);
        console.log(result);
        return result;
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
module.exports = schema;
