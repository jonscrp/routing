const fs = require("fs");
const url = require("url");
const http = require("https");
const https = require("https");
const crypto = require("crypto");
const querystring = require("querystring");

const {client_id, client_secret, scope} = require("./auth/credentials.json").web;

const host = "localhost"; 
const port = 3000;

const task_states = [];
const server = http.createServer();

server.on("listening", listen_handler);
function listen_handler(){
    console.log(`Now Listening on Port$ ${port}`);
    console.log(server.address());
}

server.on("request", request_handler);
function request_handler(req,res){
    console.log(`New Request from ${req.socket.remoteAddress} for ${req.url}`);
    if(req.url === "/"){
        const form = fs.createReadStream("html/index.html");
        res.writeHead(200, {"Content-Type": "text/html"});
        form.pipe(res);
    }
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
    else if(url.startsWith("/receive_code")){
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

/*
Redirect user to authorization server to
authenticate itself and grant scope(permissions)
to this application

Authorization server sends code to this application
*/
function redirect_to_sheetsAuthorizationServer(state, res){
    const authorization_endpoint = "https://accounts.google.com/o/oauth2/auth";
    let uri = querystring.stringify({client_id, scope, state});
    res.writeHead(302, {Location: `${authorization_endpoint}?${uri}`})
    .end();
}

/*
Application uses code to obtain an access token.
access token - similar to an API key but for private user data.
*/
function send_access_token_request(code, task, res){
    const token_endpoint = "https://oauth2.googleapis.com/token";
    const post_data = querystring.stringify({client_id, client_secret, code});
    let options = {
        method: "POST", 
        headers:{
            "Content-Type":"application/x-www-from-urlencoded"
        }
    }
    https.request(
        token_endpoint,
        options,
        (token_stream)=> process_stream(token_stream, receive_acess_token, task, res)
        ).end(post_data);
}

function process_stream(stream, callback, ...args){
    let body = "";
    stream.on("data", chunk => body += chunk);
    stream.on("end", () => callback(body, ...args));    
}
// Once access token is receive we used to send a POST request to the third party api
function receive_acess_token(){
    const task_endpoint = "";
    const post_data = JSON.stringify({"content":task});
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`
        }
    }
    https.request(
        task_endpoint,
        options,
        (task_stream) => process_stream(task_stream, receive_task_response, res)
    ).end(post_data);
}

function receive_task_response(body, res){
    const results = JSON.parse(body);
    res.writeHead(302, {Location:`${results.url}`}).end();
}

