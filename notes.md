## 1.2 - Setup

All of the data is going to be stored in mongodb, database for node.
* MongoDB hosted version (saas)
* Host own version

MongoDB gui, log into the database and visualise it. Query string.

## 1.3 - Env
Express is a minimal framework so we need to pick our own bits and pieces to configure it.
Nothing really comes battery includes, pull different parts.

* Mongoose to work with mongodb interface

.env to store sensitive information. Passwords etc. keep private. Not go in GitHub repo.
Another .env can for example live on the server. So you access the variables not the actual values.

Nodemon; monitor files and watch for changes in JS files.
Assets; for compiling saas and bundle js.

computer = node box = webpack

## 2.1 - Routing
When people go to a URL you need to do stuff and then send it back to them.
You define the route and then the callback function is going to run when the user hits a response.
console.log inside express application logs it to the terminal not the browser.
Don't try to send data twice, no duplicate headers.

Push data with .json from the server and client-side request the data.
Before we even hit routers, express is going to check the url's. And check if anything posted something. That's middleware.

* req; information from client
* res; information to send data backS
* res.query; query parameters

## 2.2 - Templating
Get information from the database into the template? Pass it into the template. These are often called locals.
res.render renders a template. Pug is popular in node development.
You can add JS in template, but ideally you want to do it in there respective files.
Chunk website in different pieces. You can extend templates, leave holes.
You can easily replace the default header.

## 2.3 - Template Helpers
Sometimes you need data that is available to the entiere application. Data you need in every single template.
On every single request put the information in locals of every render.

## 2.4 - Controllers and MVC
mvc pattern; model, view, controller
Design pattern is a way that you architect your code.

* Views; are the templates
* Models; write in the data that is stored, access the database
* controller; traffic cop between models and views. Get data and puts it inside template.

The friend that messages everybody with the parts.
exports is kinda like a global variable. Everything wil be importable.

Routes file is just a list of all the available routers. What are URLS we hit? And it's going to shell it off to a separate file to do the actual work, to a controller.

## 2.5 - Middleware
Middleware is fundamental to express, almost all plugins work that way. 
Most of the time between the request and response stuff needs to happen.
Multiple pieces of middleware, the request goes through the middleware assembly line.
Next to middleware.
After request but before response.

* route specific middleware
* global middleware

The app.use are the global middleware. App is the global one.
Session stores data by the user that needs to be handled by multiple requests. Sessions are stored in mongodb.
Routes is kinda like of or own middleware.

Error handlers intercept the middleware.
Stack trace, where dit it happen. Files that bubble up.