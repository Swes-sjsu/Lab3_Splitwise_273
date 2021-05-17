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

const updateprofileMutation = gql`
  mutation (
    $id: ID
    $username: String
    $email: String
    $phonenumber: String
    $currencydef: String
    $timezone: String
    $language: String
  ) {
    updateprofile(
      id: $id
      username: $username
      email: $email
      phonenumber: $phonenumber
      currencydef: $currencydef
      timezone: $timezone
      language: $language
    ) {
      email
      username
      status
      currencydef
      profilepic
      message
    }
  }
`;

export { signupMutation, updateprofileMutation };
