
const { productImageSize } = require('../../../../../swift.config');

const productDetail = `
    id
    name
    sku
    stock_status
    url_key
    __typename
    attribute_set_id
    small_image{
      url(width: ${productImageSize.width}, height: ${productImageSize.height}),
      label
    }
    image{
      url
    }

    `;
const priceRange = `
    price_range {
      minimum_price {
        discount {
          amount_off
          percent_off
        }
        final_price {
          currency
          value
        }
        fixed_product_taxes {
          amount {
            currency
            value
          }
          label
        }
        regular_price {
          currency
          value
        }
      }
      maximum_price {
         discount {
          amount_off
          percent_off
        }
        final_price {
          currency
          value
        }
        fixed_product_taxes {
          amount {
            currency
            value
          }
          label
        }
        regular_price {
          currency
          value
        }
      }
    }
    `;

const priceTiers = `
    price_tiers {
      discount {
        amount_off
        percent_off
      }
      final_price {
        currency
        value
      }
      quantity
    }
    `;

const customerOutput = `
    id
    firstname
    middlename
    suffix
    prefix
    lastname
    email
    is_subscribed
    addresses {
      id
      city
      default_billing
      default_shipping
      custom_attributes {
          attribute_code
          value
      }
      extension_attributes {
          attribute_code
          value
      }
      firstname
      lastname
      postcode
      country_code
      region {
          region
          region_code
      }
      street
      telephone
    }
    wishlist {
        id
        items {
            id
            product {
                ${productDetail}
                ${priceRange}
                ${priceTiers}
            }
        }
    }
    store_credit {
      current_balance {
          value
      }
      enabled
    }
`;

module.exports = customerOutput;
