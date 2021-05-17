import { gql } from 'apollo-boost';

const loginQuery = gql`
  query ($email: String, $password: String) {
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

const userdetailsQuery = gql`
  query ($id: ID) {
    userdetails(id: $id {
      email
      username
      user_id
      status
      currencydef
      profilepic
      message
      timezone
      language
    }
  }
`;

// export default loginMutation;
export { loginQuery, userdetailsQuery };
