'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');


module.exports = {

  port: '',
  toFileProp : [["/favicon.ico", "favicon.ico"]],
  toDirProp : [],
  toFunctionProp : [],


  // TODO: Implement good error catching/error msgs, parameter checking
  // TODO: Use classes

  startServer: function() {
    if(!this.port) { this.errorReporter(1) }
    http.createServer((req, res) => {
      this.univRouter(req, res);
    }).listen(this.port, console.log(`Listening to port: ${this.port}`))
  },

  listenToPort: function(port) {
    this.port = port;
  },

  univRouter: function (req, res) {
    let path = '';
    let dir = '';
    let parsedUrl = url.parse(req.url).pathname;

    if(this.toDirProp.length) {
        let splitUrl = parsedUrl.split('/');
        splitUrl.forEach((urlDir) => {
            let tmpDir = "/"+urlDir;
            this.toDirProp.forEach((dirArr) => {
                if(tmpDir.indexOf(dirArr[0]) > -1) {
                    dir += dirArr[1]
                }
            })
        })
    }

    if(this.toFileProp.length) {
        this.toFileProp.forEach((fileArr) => {
            if(parsedUrl.indexOf(fileArr[0]) > -1) {
                path = fileArr[1]
            }
        })
    }

    let file = dir + path;
    if(parsedUrl === "/") file = "index1.html";

    // TODO:Implement easy routing to function and returning intended response
    // file = toFunctionProp[parsedUrl] ? toFunctionProp[parsedUrl] : file;

    let contentType = this.extractContentType(file)
    res.writeHead(200, {"Content-Type": contentType});
    res.end(fs.readFileSync(file));
  },

  extractContentType: function (filePath) {
    let extName = path.extname(filePath);
    let contentType = '';
    // TODO: Extend the extensions and contenttypes
    switch(extName) {
      case ".js": contentType = "text/javascript";
      break;
      case ".css": contentType = "text/css";
      break;
      case ".html": contentType = "text/html";
      break;
      case ".jpg": contentType = "text/jpeg";
      break;
      case ".png": contentType = "text/png";
      break;
      case ".ico": contentType = "image/x-icon";
      break;
      default: contentType = "text/html";
      }
    return contentType;
  },

  routePath: function(urlPath) {
    this.urlPath = urlPath;
    return this;
  },

  toFile: function(filePath) {
    if(!this.urlPath) { this.errorReporter(2); }
    this.toFileProp.push(["/"+this.urlPath, filePath]);
    delete this.urlPath;
  },

  toDir: function(dirPath) {
    if(!this.urlPath) { this.errorReporter(2); }
    this.toDirProp.push(["/"+this.urlPath, dirPath+"/"]);
    delete this.urlPath;
  },

  toFunction: function() {

  },


  routeExt: function (extName) {
    // TODO: Implement a catchall for specific extensions
    // Most likely .routeExt().toDir() is the best way to implement
    // Need to brainstorm good uses for routeExt() and toDir()
    //    -- One is assets such as .jpg, .pdf, .doc
    return "Function incomplete"
    this.extName = extName;
    return this;
  },

  errorReporter: function(errNum) {
    let errMsg = ''
    switch(errNum){
      case 1: errMsg = "Specify a port using .listenToPort(portNum) before calling "+
                        ".startServer()";
      break;
      case 2: errMsg = `Use .toFile() and .toDir() in the form of .routeFrom(urlPathName).toFile(fileName) or .toDir(dirName)`;
      break;
      default: errMsg = "Please raise an issue to the maintainer for quickhttp"+
                        "with as much detail as possible.";
    }
    throw new Error(errMsg);
  }
}