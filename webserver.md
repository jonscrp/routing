# What is a webserver? :bulb:

**Hardware** - 
Stores HTML CSS and JS

**Sofware** - 
Managage user requests (HTTP server)

Other [network protocols](https://www.techtarget.com/searchnetworking/feature/12-common-network-protocols-and-their-functions-explained)

```
|-----------------|   HTTP Request
|   (Files)       | <------------- |--------|
|                 |                | Client |  
|  ( HTTP server) | ------------>  |--------|
|-----------------|  HTTP Response    Browser
   Server
````
Client sends a request(URL) and the server(HANDLES URL) sends a response(FILE/ERROR). 

## Types of web servers

Static 
delivers index.html files 
 - Hardware + HTTPS server

Dynamic (Examples:Wikepedia and MDN)
delivers  index.pug files(templates) // files that can be populated with different data
- Hardware+ application server + database

Static and Dynamic Server requests handling

![alt text](web_application_with_html_and_steps_image_from_mdn.png)


## Hosting Files 
    - Dedicated web server 
    - Benefits 
        *   Availability 
        *   It can have a dedicated IP address
        *   Typically maintained by a third party 



Client side programming 
presents the client with a UI(nicely designed interface) and forms it can fill to send requests to the server.

Server side programming 
handles client requests by validating the forms and delivering the right resources(files/images/audio).

Advantages 
    * Collect infomation / Deliver personalize data 
        + Templates can be populated with information relevant to the client. 
    * Control user access to content
    * Store session/ state information 
        + similar to context switches for process scheduling but in this case with client sessions

POST and GET [requests/responses](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Client-Server_overview) 


Returning something other than HTML 
[AJAX model](https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX) - "allows the browser to communicate with the server to exchange and update date without having to reload the page" - MDN



Web Frameworks 
* Make it easy to handle client request
* They provide an abstraction to work with databases
    - ORM(OBJECT-RELATIONAL-MAPPER)
        + Help sanitize user input 
        + Speed up the querying process

##[Security](https://developer.mozilla.org/en-US/docs/Web/Security#clickjacking_protection) 
**Cross-Site-Scripting**
- injecting scripts to responses
        * reflected - a link works as the original link but has a script embeded into it
        * persistent - a malicious link is store and then rendered(run).

 ways to prevent this include input sanitization

 **SQL injections**
 modifyig a sql command to do something different that what its supposed to.

 To prevent this to scape all the character in the user input that have a special meaning in sql.

Cross-Site Request Forgery(CSRF)
A user is tricked into rmaking a request to some server without his full acknowledgement

To prevent this include a user-specific site-generated secret this way 


## working with APIS 

[IMB OAuth flows](https://www.ibm.com/docs/en/datapower-gateway/7.5.0?topic=support-oauth-flows)
[Likedin Example Microsoft](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow?tabs=HTTPS1)

Three-legged OAuth flow 
[Video](https://youtu.be/X9MCMLDWFvI)

using googles sheets to store and retrieve content

[Creating credentials](https://developers.google.com/workspace/guides/create-credentials)

[Oauth Steps](https://developers.google.com/identity/protocols/oauth2)



