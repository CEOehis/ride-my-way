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

API is live on https://api-ridemyway-staging.herokuapp.com/api/v1/

## Endpoints and Actions
| Verb     | Endpoint                  | Action                         |
| :------- | :------------------------ | :----------------------------- |
| POST     | /auth/signup              | Registers a new user           |
| POST     | /auth/login               | Logs in a registered user      |
| GET      | /rides                    | Fetch available ride offers    |
| GET      | /rides/\<rideId>          | Fetch a single ride offer      |
| POST     | /rides/\<rideId>/requests | Make a request to join a ride  |
| POST     | /users/rides/             | Creates a ride offer           |
| GET      | /users/rides/\<rideId>/requests | Fetch all ride requests           |
| PUT      | /rides/\<rideId>/requests/\<requestId>   | Creates a ride offer           |

## Technologies Used

* [NodeJS](https://nodejs.org/en/)
* [ExpressJs](https://expressjs.com/)
* [PostgreSQL](https://www.postgresql.org/)

## API Usage

### Users
#### Signup
To create a user account make a `POST` request to `/auth/signup`. The request body should contain:
```json
{
    "email": "johndoe@mail.com",
    "fullName": "John Doe",
    "password": "somepassword",
    "passwordConfirm": "somepassword"
}
```
The server responds with a status and an access token:
```json
{
	"status": "success",
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNTMwODY1NjgyLCJleHAiOjE1MzA5NTIwODJ9.TBCD0rXVGEM5Yez5hnWGUc0VFSot3kP5eVRXdqg1PGA"
}
```
#### Sign-in
To sign in a previously registered account make a `POST` request to `/auth/login`. The request body should contain:
```json
{
    "email": "johndoe@mail.com",
    "password": "somepassword"
}
```
The server responds with a status and an access token:
```json
{
	"status": "success",
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNTMwODY1NjgyLCJleHAiOjE1MzA5NTIwODJ9.TBCD0rXVGEM5Yez5hnWGUc0VFSot3kP5eVRXdqg1PGA"
}
```

The token obtained from authentication above must be sent to all other protected routes in the request `Authorization` header in the form along with whatever payload:
```json
"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNTMwODY1NjgyLCJleHAiOjE1MzA5NTIwODJ9.TBCD0rXVGEM5Yez5hnWGUc0VFSot3kP5eVRXdqg1PGA"
```

### Rides
#### Get all ride offers
To get all ride offers send a `GET` request to `/rides`. The response is in this format:
```json
{
	"status": "success",
	"rides": [
		{
			"id": 1,
			"origin": "Iyana paja",
			"destination": "yaba",
			"date": "2018-07-02T00:00:00.000Z",
			"time": "11:20:00+00",
			"seats": 3,
			"userid": 6,
			"created_at": "2018-07-05T13:48:34.134Z",
			"updated_at": "2018-07-05T13:48:34.134Z"
		},
		{
			"id": 2,
			"origin": "some random place",
			"destination": "some other random place",
			"date": "2018-07-04T00:00:00.000Z",
			"time": "06:00:00+00",
			"seats": 2,
			"userid": 3,
			"created_at": "2018-07-06T01:16:35.734Z",
			"updated_at": "2018-07-06T01:16:35.734Z"
		}
	]
}
```
#### Get a ride offer details
To get all ride offers send a `GET` request to `/rides/:rideId`. The response is in this format:
```json
{
	"status": "success",
	"ride": {
		"id": 2,
		"origin": "Iyana paja",
		"destination": "yaba",
		"date": "2018-07-02T00:00:00.000Z",
		"time": "11:20:00+00",
		"seats": 2,
		"userid": 6,
		"created_at": "2018-07-05T13:48:34.134Z",
		"updated_at": "2018-07-05T13:48:34.134Z"
	}
}
```


## Installation

1. Install [`node`](https://nodejs.org/en/download/), version 8 or greater

2. Clone the repository

    ```
    git clone git@github.com:CEOehis/ride-my-way.git
    ```

3. Navigate to the project directory

    ```
    cd ~/path/to/ride-my-way
    ```

4. Install all dependencies

    ```
    npm install
    ```
5. Start the app

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
