/* eslint import/prefer-default-export: "off"  */
/* eslint import/no-extraneous-dependencies: "off" */
import faker from 'faker';

// empty collection for ride offers
export const RideOffers = [];

// use faker to generate random data
for (let i = 1; i < 10; i += 1) {
  RideOffers.push({
    id: i,
    from: faker.address.city(),
    to: faker.address.city(),
    seats: faker.random.number(3),
    userId: faker.random.number(10),
    price_per_seat: +faker.commerce.price(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}
