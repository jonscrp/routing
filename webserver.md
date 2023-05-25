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
Client sends a request(URL) and the server(HANDLES URL) sends a response(FILE). 

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
Handles client requests by validating the forms and delivering the right resources(files/images/audio).

    - Advantages 
        * Collect infomation / Deliver personalize data 
            + Templates can be populated with information relevant to the client. 
        * Control user access to content
        * Store session/ state information 
            + similar to context switches for process scheduling but in this case with client sessions
    

POST and GET [requests/responses](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Client-Server_overview) 



