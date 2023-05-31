const fs = require("fs");
const url = require("url");
const http = require("http");
const https = require("https");
const crypto = require("crypto");
const querystring = require("querystring");

// Notes:
// The task value is irrelevant it simply shows how to pass information from the form 
// More information on what each param means https://developers.google.com/identity/protocols/oauth2/web-server
// More information about the sheets api https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get


const {client_id, client_secret, scope, redirect_uri, response_type,grant_type, spreadsheetId} = require("./auth/credentials.json").web;

const host = "localhost" // Side note localhost can also be accessed using IPv6 with [::1]:3000
const port = 3000;

const task_states = [];
const server = http.createServer();

server.on("listening", listen_handler);
server.listen(port);
function listen_handler(){
	console.log(`Now Listening on Port ${port}`);
	console.log(server.address());
}

server.on("request", request_handler);
// Send form to client
function request_handler(req, res){
    console.log(`New Request from ${req.socket.remoteAddress} for ${req.url}`);
    if(req.url === "/"){
        const form = fs.createReadStream("html/index.html");
		res.writeHead(200, {"Content-Type": "text/html"})
		form.pipe(res);
    }
    // Redirect client to authentication page
    else if(req.url.startsWith("/user_list")){
        let user_input = url.parse(req.url, true).query; // returns an object using the url params
        if(user_input === null){
            not_found(res);
        }
        const {task} = user_input;
        const state = crypto.randomBytes(20).toString("hex"); // random value used to prevent CSRF
        task_states.push({task, state});
        redirect_to_sheetsAuthorizationServer(state, res);
    }
    // Receive code ->  Exchange code for access token
    else if(req.url.startsWith("/receive_code")){
        const {code, state} = url.parse(req.url, true).query; 
        console.log(code);
        let task_state = task_states.find(task_state => task_state.state === state);
        if(code === undefined || state === undefined || task_state === undefined){
            not_found(res);
            return;
        }
        const {task} = task_state;
        send_access_token_request(code, task, res);
    }
    else{
        not_found(res);
    }
}

function not_found(res){
    res.writeHead(404, {"Content-Type": "text/html"});
    res.end(`<h1>404 Not Found</h1>`);
}
//Redirect user to authorization server 
function redirect_to_sheetsAuthorizationServer(state, res){
    const authorization_endpoint = "https://accounts.google.com/o/oauth2/auth";
    let uri = querystring.stringify({client_id,redirect_uri,response_type, scope, state});
    res.writeHead(302, {Location: `${authorization_endpoint}?${uri}`})
    .end();
}


// Trade code for an acess token
function send_access_token_request(code, task, res){
    const token_endpoint = "https://oauth2.googleapis.com/token";
    const post_data = querystring.stringify({code, client_id, client_secret, redirect_uri, grant_type});
    let options = {
        method: "POST", 
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        }
    }
    https.request(
        token_endpoint,
        options,
        (token_stream)=> process_stream(token_stream, receive_access_token, task, res)
        ).end(post_data);
}

// Read Message Body
function process_stream(stream, callback, ...args){
    let body = "";
    stream.on("data", chunk => body += chunk);
    stream.on("end", () => callback(body, ...args));    
}

function receive_access_token(body, task, res){
    console.log(body)
	const {access_token} = JSON.parse(body);
	send_add_task_request(task, access_token, res);
}

// Once access token is receive we use it to send a get request to the sheets resource server
function send_add_task_request(task, access_token, res){
    let range = "!A1:E10";
    const task_endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;
    //const post_data = JSON.stringify({"content":task});
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`
        }
    }
    https.request(
        task_endpoint,
        options,
        (task_stream) => process_stream(task_stream, receive_task_response, res)
    ).end(); // body of the message
}

// Display request response
function receive_task_response(body, res){
    console.log("response received");
    const results = JSON.parse(body).values[0];
    console.log(results);
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end(`<p> ${results}<p>`)
}