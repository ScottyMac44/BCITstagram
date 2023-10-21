/*
 * Project: Milestone 1
 * File Name: main.js
 * Description: Input and output point for IOhandler.js
 *
 * Created Date: Oct. 18th, 2023
 * Author: Scott McNeill
 *
 */

const process = require('process');
const path = require("path");
const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "output");


IOhandler.unzip(zipFilePath, pathUnzipped)
    .then((fileCount) => {
        if (fileCount > 0) {
            console.log(`Successfully extracted ${fileCount} .png files to ${pathUnzipped}`);
            return IOhandler.readDir(pathUnzipped);
        } else {
            console.log(`No .png files were found in\n${zipFilePath}`);
        }
    })

    .then((dirContents) => {
        IOhandler.grayScale(dirContents, pathUnzipped, pathProcessed);
    })

    .catch((error) => {
        console.error('ERROR: The operation could not be completed\n', error);
    });