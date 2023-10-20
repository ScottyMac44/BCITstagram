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
const pathProcessed = path.join(__dirname, "grayscaled");

IOhandler.unzip(zipFilePath, pathUnzipped)
    .then((result) => {
        if (result.fileCount > 0) {
            console.log(`Successfully extracted ${result.fileCount} .png files to ${path.join(__dirname, pathUnzipped)}`);
        } else {
            console.log(`No .png files were found in\n${path.join(__dirname, zipFilePath)}`);
        }
    })

    .catch((error) => {
        console.error('ZIP EXTRACT ERROR: The operation could not be completed\n', error);
    });