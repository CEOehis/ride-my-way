# ride-my-way

[![Build Status](https://travis-ci.org/CEOehis/ride-my-way.svg?branch=develop)](https://travis-ci.org/CEOehis/ride-my-way)
[![Coverage Status](https://coveralls.io/repos/github/CEOehis/ride-my-way/badge.svg?branch=develop)](https://coveralls.io/github/CEOehis/ride-my-way?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/12f9a9932f3944857e2c/maintainability)](https://codeclimate.com/github/CEOehis/ride-my-way/maintainability)
[![codecov](https://codecov.io/gh/CEOehis/ride-my-way/branch/develop/graph/badge.svg)](https://codecov.io/gh/CEOehis/ride-my-way)

Ride-my-way App is a carpooling application that provides drivers with the ability to create ride offers
and passengers to join available ride offers.

## MVP Features:

* [x] Users can create an account and log in.
* [X] Drivers can add ride offers..
* [X] Passengers can view all available ride offers.
* [x] Passengers can see the details of a ride offer and request to join the ride. E.g What time
the ride leaves, where it is headed e.t.c
* [x] Drivers can view the requests to the ride offer they created.
* [x] Drivers can either accept or reject a ride request.


## API

API is live at https://ridemywaycore.herokuapp.com/api/v1/

## API Documentation
API documentation: https://ridemywaycore.herokuapp.com/docs

## Technologies Used

* [NodeJS](https://nodejs.org/en/)
* [ExpressJs](https://expressjs.com/)
* [PostgreSQL](https://www.postgresql.org/)

## Installation

1. Install [`node`](https://nodejs.org/en/download/), version 8 or greater

2. Install [`PostgreSQL`](https://www.postgresql.org/)

3. Clone the repository

    ```
    git clone git@github.com:CEOehis/ride-my-way.git
    ```

4. Navigate to the project directory

    ```
    cd ~/path/to/ride-my-way
    ```

5. Install all dependencies

    ```
    npm install
    ```
6. Start the app

    ```
    npm run watch:serve-dev
    ```

## UI templates

UI is hosted on https://ceoehis.github.io/ride-my-way/UI

* [x] User signup and signin pages.

* [x] A page/pages where a user can do the following:
  * [x] View all available ride offers.
  * [x] See the details of a ride offer and respond to it.
  * [x] Offer a ride.
  * [x] View and accept requests for the ride offer he/she created
* [x] A page/pages for a user’s profile which, at minimum displays:
  * [x] The number of rides a user has given.
  * [x] The number of rides a user has taken.
  * [x] List of rides taken and given.