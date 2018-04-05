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
* res; information to send data back
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

## 3.1
Models; were our data is going to be stored. Spreadsheet; create columns etc. That's a model.
Mongodb can be a loose database. But it is better to keep it strict.
MongoDB is our database but mongoose is the package to interface.

Query db to wait, it happens async.
module.exports if you want the main thing to be exported. Just specific properties need to be exported as function.
Model gets a schema, schema = what the data is going to look like.

Do all the data normalization as close to the model as possible.
Create model but you also import it so mongodb knows about it.
Singleton; mongodb will know about them. You can configure it troughout node.

## 3.2
mixin pass some data and displays html.
one mixin to one file.
mixins work just like function (accepts)
action tells the browser where to send the data
method tells the browser how to send the data
post is great for invisible

We want to save this data in the database.

## 4.1 
JS is async, when you save to store that you need to wait. Callback hell.
Promise returns (not if it success) but it will fail.
You can chain .then, but we can even do better. ES8
Composition, wrapping a function inside another function.

First create the schema and then in the controller create a new version from the schema and save it to the DB.

## 4.2
Redirect to new page when something sucess. Don't redirect to page to tell them something. You just want to send them a little information.
Locals are variables that are available to me in templates.

## 4.3 
-

## 4.4
MongoDB by default wil asign it an ID.
Anytime you deal with the database you want to make it async.

## 5.1
Before start storing data, how should data be stored. MongoDB has many types. You can then perform more complex queries.

## 5.2
-

## 6.1
Browser needs to send it as a multipart. Then configure express to handle that file type.
Every files has it's own mimetype to describe what type of file it is. You can't rely on remaning alone, but you can rely on the mimetype of a file.

Buffer, we are not saving but reading into memory. You also need to do something with the response, otherwise server is going to give a timeout.

## 6.2
If a query in mongoDB doesn't find anything that not an error but it just returns null.

## 7.1
-

## 7.2
You don't want to query alot of stores and wait for the data to come back. That can be alot of performance if you have over 1000 stores. Offload the heavy lifting onto the database. Write code in node and let mongodb handle it.

Aggregation; complex query with multiple steps. Array with multiple commands.

## 7.3

With asymc await you don't want to wait on eachother. You want to fire them async.

## 8.1
One controller for specific part of your website. Try to put components in mixins. You generally don't want to store the password into the database but only the hash. Passport is defacto library. You want to do as much validation in the schema. Otherwise in the controller. Request body is the stuff that comes from a form.

We also validate on the server because some people can take the required attribute off.

## 8.3
Virtual field can be generated in mongoose. Fields can be generated. Mostly used for conversion. (kg to pounds or something)

## 9
Relationship between different parts of our schema.

## 10.1

-

## 10.2
Indexes; do some homework before we query. Index it, get yourself ready. Indexing will happen inside the schema.
Take query parameters and search database.


Using ES6 on the front-end (import) and require (commonjs) on the server-side.

Cross side scripting attack.

Keep ajax request as slim as possible. Slim down the json response.