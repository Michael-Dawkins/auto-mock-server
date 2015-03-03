# auto-mock-server
A simple mock server that reads and exposes resources with minimal config

How to launch the server :
type the following command :
* node auto_mock_server.js

How to expose a mocked resource :
A mock is currently composed of two files :
* config.json --> a resource config file, currently only containing the http method to expose the resource on
* mock.json --> the content to be served

How to configure the port :
By default, the server runs on port 8000, you may pass an argument to the app to change the used port :
* node auto_mock_server.js 8001

Note : 
You may use a directory tree structure to express a RESTFULL API, for example, if you create the folder "user" under the "mocks" folder,
any resource inside the "user" folder will be exposed at localhost:8000/1.0/user
This works recursively, so you can expose resources like this :
localhost:8000/1.0/user/login/admin
