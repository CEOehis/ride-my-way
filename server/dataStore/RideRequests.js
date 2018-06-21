/* eslint import/prefer-default-export: "off"  */
/* eslint import/no-extraneous-dependencies: "off" */
import faker from 'faker';

// empty collection for ride offers
export const RideRequests = [];

// use faker to generate random data
for (let i = 1; i < 10; i += 1) {
  RideRequests.push({
    id: i,
    userId: faker.random.number(10),
    rideId: faker.random.number(3),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}
