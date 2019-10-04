<p align="center">
    <img src="https://raw.githubusercontent.com/nialloc9/sold-price-map-technical-challenge/master/assets/main.png" alt='application running' width="400">
</p>

# sold-price-map-technical-challenge

An example of decoupling processing using a serverless architecture while following an ETL pattern to handling data. The site is hosted at [http://data-visualisation.s3-website-eu-west-1.amazonaws.com/?fbclid=IwAR3qGmugfFngJBHFjrATx1G1nqfcKzewT1qLEM2rW3phcFL2A3ZyxyCZcbw](http://data-visualisation.s3-website-eu-west-1.amazonaws.com/?fbclid=IwAR3qGmugfFngJBHFjrATx1G1nqfcKzewT1qLEM2rW3phcFL2A3ZyxyCZcbw)

### Prerequisites

- install npm and node: [https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

- install serverless

        $ npm i -g serverless
        

### Usage

- lambdas can run locally using packages such as [lambda-local](https://www.npmjs.com/package/lambda-local).

- cd into project root directory

        $ cd ./client && yarn install && yarn start

- Screenshots of project are available in the screenshot folder

### Testing

- cd into project root directory

        $ cd ./server && npm test

### Original Technical Task

You have been given a [set of data points](/assets/sold-price-data.txt), with each item taking the following form:

```
X Y P
```

Where:

- `0 <= X < 100`
- `0 <= Y < 100`
- `10000 < P < 10000000`

`X` and `Y` represent the coordinates of a house which has been sold, and `P` is the price in which it was sold. For example, the point "`5 10 100000`" would be interpreted as a house sold for £100,000 at the point `(5, 10)`.

Using this data plot each point on a grid. The points should be filled with a colour representing how expensive a house was in relation to other houses. The choice of colour is up to you, however, you should use a different colour for each of the following groups:

- 0% - 5%
- 5% - 25%
- 25% - 75%
- 75% - 95%
- 95% - 100%

#### Technical specification

Your system architecture should be split between a back-end and a web front-end, for instance, providing a JSON in/out RESTful API. Feel free to use any other technologies provided that the general client/service architecture is respected.

There is no restriction on the technology stack you should use.

### Technologies used

- Node.js 8.x

- React

- Serverless

- Lambda with notification event

- S3

# Approach

Below you will find a combination of assumptions made, notes, intended client approach, and intended server approach.

### Assumptions

- Data transfer can be accomplished be accomplished using any technology. (rest api, sockets, or using other technologies such as graphQL)

- All numbers will be integers and not floats or any other data type.

- The data will not be stored on either the client or the server after request has been made.

- File with data can be updated.

- No specifications on browser support have been made so I will make the assumption to support the latest 2 versions of each browser.

- There are no restrictions on where data can be stored. (on premise/cloud)

- Supported devices not in specification. Going to assume a mobile first approach.

- Front end application is publicly available

### Notes

- Create react app is used as a boilerplate to get going as fast as possible. It will handle pollyfills using browserlist and babel-env. If needed I would create a webpack config to build the client with hot reloading, code splitting, pollyfills etc.

- Examples of some webpack configs done in other projects: <a href="https://github.com/nialloc9/currying">https://github.com/nialloc9/currying</a> and <a href="https://github.com/nialloc9/reactReduxJestBoilerplate">https://github.com/nialloc9/reactReduxJestBoilerplate</a>

### Architecture

<p align="center">
    <img src="https://raw.githubusercontent.com/nialloc9/sold-price-map-technical-challenge/master/assets/architecture.png" alt='architecture diagram' width="400">
</p>

### Intended approach Client

- As the project will only have one view I will use local state and pass that down instead of using a data store such as redux. This would be overkill for something like this. I will split the logic and view into 2. A container and a view. While inheritance could be used here I will use object composition instead as react favors it.

- Data from endpoint will already be grouped and assigned a group so mapping over the data to create the UI will be simplified.

- The static site will be hosted using a S3 bucket. It will be publicly available.

### Intended approach Server

- Store file in S3.

- Create an event notification hook that fires a lambda when file is changed.

- A transformer parses the data and put it's into the following data structure:

    `
        {
            cooridnates: { x: string, y: string },
            price: { currency: string, value: string },
            meta: { group: string }
        }
    `

If in the future the size of this file increases and becomes to big to be handled by a single 
lambda distributed processing can be added to handle the transformations.

- The transformer functions for manipulating the data will be abstracted into a utility file to keep code clean and make it easier to test.

- After data is transformed it will be placed inside a new S3 file. If transformations were to occur each time the client requests data it would have a negative impact on perfomance. Taking the approach here this is mitigated by the data being already transformed prior to reading. Also defining an application data structure ensures that if the ingressed data structure differs in the future it will only effect the ingress and not the rest of the application isolating the issue.

- This new file will be read directly from. If in the future the size of this file increases a s3 file may not be optimal. Instead it could be seperated into multiple files or data could be stored in a database. Both solutions would allow the implementation of pagination.

### Intended API endpoits

- Serverless architecture relying on events fired in the uploading of data to S3 endpoint.
- Client reads transformed data from JSON file in S3.

### Improvements

- Testing can be increased to 100% coverage for both client and server.
- End to end testing can be integrated to test application from the viewpoint of the user.
- Visual regression testing can be integrated using tools such as cypress or applitools.
- CDN (such as cloudfront) could be placed in front of s3 bucket. If this was implented a job would need to be created to invalidate the cache on upload of new files. I have created an example of this on my website [here](https://twentyfirstcenturycode.com/cloud-computing/circle-ci-with-s3-and-cloudfront).
- Distributed processing (such as hadoop) could be used to handle data transformations but this is currently overkill and expensive.
- If routing to differant data was required an api gateway could be used.
- A CI/CD (such as circle ci) to update lambda based on whether master has changed. Example of this can be found on my website [here](https://twentyfirstcenturycode.com/cloud-computing/circle-ci-with-s3-and-cloudfront). 