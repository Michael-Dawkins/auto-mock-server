# auto-mock-server
A simple mock server that reads and exposes resources with minimal config

## How to setup the project :
* configure config.json located at the project root (enter the path to the folder containing your mocks)

Type the following command :
* bower install
* node install

## How to launch the server :
Type the following command :
* node auto_mock_server.js
* or use npm standard command : npm start (in project directory)

## How to configure the port :
By default, the server runs on port 8000, you may pass an argument to the app to change the used port :
* node auto_mock_server.js 8001

## Files that can be used to describe a mocked resource :
* config.json : informations about the mock (mandatory)
* mock.json : mock content
* schema-mock.json : mock content JSON schema
* schema-payload.json : payload content JSON schema
* http-codes.json : forecast http codes
* README.md : description of the in markdown
* images : useful if a particular web service is associated with a specific screen in your app

## How to organize your mocks :
```
/mocks/{version}/{methodName1}/{methodName2}/.../{methodNameX}/{httpMethod}
/mocks/{version}/{methodName1}/{methodName2}/.../{methodNameX}/{httpMethod}/config.json
/mocks/{version}/{methodName1}/{methodName2}/.../{methodNameX}/{httpMethod}/mock.json
/mocks/{version}/{methodName1}/{methodName2}/.../{methodNameX}/{httpMethod}/schema-mock.json
/mocks/{version}/{methodName1}/{methodName2}/.../{methodNameX}/{httpMethod}/schema-payload.json
/mocks/{version}/{methodName1}/{methodName2}/.../{methodNameX}/{httpMethod}/http-codes.json
/mocks/{version}/{methodName1}/{methodName2}/.../{methodNameX}/{httpMethod}/README.md
/mocks/{version}/{methodName1}/{methodName2}/.../{methodNameX}/{httpMethod}/{image}.["png", "jpeg", "jpeg", "gif"]
```
## How to send a POST request with a payload
* Using curl or a tool like Postman, you can send POST requests to a WS in the mock server.
* Specify a payload in the body and it will be checked against the associated schema-payload.json
* Check your Node.js console to see if the request is valid or not

*Note :
You may use a directory tree structure to express a RESTful API. For example, if you create the folder "user" under the "mocks/1.0/" folder,
any resource inside the "user" folder will be exposed at localhost:8000/1.0/user
This works recursively, so you can expose resources like this :
localhost:8000/1.0/user/login/admin/...*
