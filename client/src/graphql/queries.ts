import { gql } from '@apollo/client';
import { USER_INFO } from './fragments';

export const PROFILE = gql`
   query {
      profile {
         ...userInfo
      }
   }
   ${USER_INFO}
`;

export const GET_ALL_POSTS = gql`
   {
      allPosts {
         id
         title
         description
      }
   }
`;

export const GET_ALL_USERS = gql`
   query {
      allUsers {
         ...userInfo
      }
   }
   ${USER_INFO}
`;

export const PUBLIC_PROFILE = gql`
   query publicProfile($username: String!) {
      publicProfile(username: $username) {
         _id
         username
         name
         email
         images {
            url
            public_id
         }
         about
      }
   }
`;
