const Jimp = require('jimp');
const fs = require("fs");
const path = require("path");

async function loadData(basePath) {
    let trainImages = [];
    let trainLabels = [];
    let validImages = [];
    let validLabels = [];

    const trainPath = path.join(basePath, 'train', 'images');
    const validPath = path.join(basePath, 'valid', 'images');

    const trainLabelPath = path.join(basePath, 'train', 'labels');
    const validLabelPath = path.join(basePath, 'valid', 'labels');

    const trainFiles = fs.readdirSync(trainPath);
    const validFiles = fs.readdirSync(validPath);

    const trainLabelFiles = fs.readdirSync(trainLabelPath);
    const validLabelFiles = fs.readdirSync(validLabelPath);

    for (let i = 0; i < trainFiles.length; i++) {
        const image = await Jimp.read(path.join(trainPath, trainFiles[i]));
        trainImages.push(image.bitmap.data);
        trainLabels.push(trainLabelFiles[i].split('.')[0]);
    }

    for (let i = 0; i < validFiles.length; i++) {
        const image = await Jimp.read(path.join(validPath, validFiles[i]));
        validImages.push(image.bitmap.data);
        validLabels.push(validLabelFiles[i].split('.')[0]);
    }

    return {
        train: {
            images: trainImages,
            labels: trainLabels,
        },
        valid: {
            images: validImages,
            labels: validLabels,
        }
    };
}
module.exports = loadData
