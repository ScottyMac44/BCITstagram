/*
 * Project: Lab 6
 * File Name: IOhandler.js
 * Description: Collection of functions for image processing and input/output related operations
 *
 * Created Date: Oct. 18th, 2023
 * Author: Scott McNeill
 */

const unzipper = require("unzipper");
const fs = require("fs");
const fsp = require("fs").promises;
const PNG = require("pngjs").PNG;
const path = require("path");

/**
 * Description:
 * Decompress zipped file from given pathIn.
 * Reads files in zipped folder recursively, only writes .png files to pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = async (pathIn, pathOut) => {

    let numExtractedFiles = 0; //Keeps track of how many files were processed for debug purposes

    //Check if the output directory exists, and create it if it doesn't
    const folderExists = fsp.access(pathOut)
        .then(() => true)
        .catch(() => false);

    return folderExists
        .then((exists) => {
            if (!exists) {
                return fsp.mkdir(pathOut);
            }
        })
        
        .then(() => {
            const stream = fs.createReadStream(pathIn)
            .pipe(unzipper.Parse());

            return new Promise((resolve, reject) => {
                stream.on('entry', (entry) => {

                    //Check if entry is png file
                    if (path.extname(entry.path) === '.png') {

                        //The code below creates the write stream on the pathOut folder joined with only the file name (basename) of the current image
                        const writeStream = fs.createWriteStream(path.join(pathOut, path.basename(entry.path)));
                        entry.pipe(writeStream);

                        numExtractedFiles++;
                        
                    } else {
                        //Discard entry if not png file
                        entry.autodrain();
                    }
                });

                stream.on('finish', () => {
                    resolve(numExtractedFiles);
                });

                stream.on('error', (error) => reject(error));
            });
        })
        .catch((error) => {
            console.error('Error:', error)
        });  
};



/**
 * Description: read all the png files from given directory and return
 * Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
    return fsp.readdir(dir)
        .then((dirContents) => {
            const filteredContents = dirContents.filter((value) => {
                return path.extname(value) === '.png' || !path.basename.includes('._');
            });
            return filteredContents;
        })
        .catch((error) => { console.error(error) });
};

/**
 * Description: Read each png in filenameArray,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (filenameArray, pathIn, pathOut) => {

    filenameArray.forEach((filename) => {
        const inputFile = path.join(pathIn, filename);
        const outputFile = path.join(pathOut, filename);

        console.log(`Processing file: ${filename}`);

        fs.createReadStream(inputFile)
            .pipe(
                new PNG({
                filterType: 4,
                })
            )
            .on("parsed", function () {
                for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    var idx = (this.width * y + x) << 2;
    
                    //Greyscale algorithm 
                    //Sets R,G,B to value of (R+G+B) / 3
                    this.data[idx] = this.data[idx + 1] = this.data[idx+2]
                    = (this.data[idx] + this.data[idx + 1] + this.data[idx + 1]) /3

                }
                }
    
                this.pack().pipe(fs.createWriteStream(outputFile));
            })
            .on("error", function (err) {
                console.error("Error parsing PNG:", err);
            });
    });
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
