import { gql } from '@apollo/client';
import { USER_INFO, POST_DATA } from './fragments';

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
         ...postData
      }
   }
   ${POST_DATA}
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

export const POSTS_BY_USER = gql`
   query {
      postsByUser {
         ...postData
      }
   }
   ${POST_DATA}
`;
