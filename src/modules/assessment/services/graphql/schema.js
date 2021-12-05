/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client';
import { modules } from '@config';

export const reOrder = gql`
  mutation reOrder($order_id: String!) {
    reorder(input: {order_id: $order_id}) {
      cart_id
    }
  }
`;

export const getCmsBlocks = gql`
  query($identifiers: [String]) {
      cmsBlocks(identifiers: $identifiers) {
          items {
              identifier
              title
              content
          }
      }
  }
`;

export const getCategories = gql`
  query {
    categoryList (filters: {}) {
      uid
      name
      image
      url_key
    }
  }
`;

export const subscribeToNewsLetter = gql`
  mutation ($email: String!) {
    subscribeEmailToNewsletter(email: $email) {
      status
    }
  }
`;