const graphql = require('graphql');
const dbconnection = require('../config/conn');
const bcrypt = require('bcryptjs');
var multer = require('multer');
var cookieParser = require('cookie-parser');
const mysql = require('mysql');
const loginQuery = require('../routes/login');
const signupQuery = require('../routes/signup');
const userdetailsQuery = require('../routes/userdetails');
const updateprofileQuery = require('../routes/updateprofile');
const saltRounds = 10;

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
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

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Root Query',
  fields: {
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
    userdetails: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
      },
      async resolve(parent, args, context) {
        let result = await userdetailsQuery(args);
        // console.log(result);
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
    updateprofile: {
      type: UserType,
      args: {
        id: { type: GraphQLID  },
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
        console.log(result);
        context.req.session.user = result.username;
        context.req.session.email = result.email;
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
