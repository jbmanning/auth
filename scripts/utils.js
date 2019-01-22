const fs = require("fs");
const path = require("path");

const isFile = (source) => fs.existsSync(source) && fs.lstatSync(source).isFile();

const isDirectory = (source) => fs.existsSync(source) && fs.lstatSync(source).isDirectory();

const getDirectories = (source) =>
  fs
    .readdirSync(source)
    .map((name) => path.join(source, name))
    .filter(isDirectory);

const getFiles = (source) =>
  fs
    .readdirSync(source)
    .map((name) => path.join(source, name))
    .filter(isFile);

exports.isFile = isFile;
exports.isDirectory = isDirectory;
exports.getDirectories = getDirectories;
exports.getFiles = getFiles;