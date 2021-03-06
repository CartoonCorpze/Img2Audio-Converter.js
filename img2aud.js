const Jimp = require('jimp');
const fs = require('fs')
const wav = require('node-wav');

const _args = process.argv;
console.log(_args);


let dataArray = new Array();
let imgX = 200;
let imgY = 1800;

let conversionMethod = 0;


// File stuff
function writeWav(channels) {
  let buffer = wav.encode(
    channels,
    {
      sampleRate: 32000, // Default is 16000
      numat: true,
      bitDepth: 32,
      floatPoint: true
    });

  fs.writeFile(
    './' + imgX + 'x' + imgY + '.wav',
    buffer, (err) => { if (err) return console.log(err); });
}


// Data structure stuff
function arrayToAudio() { // We convert dataArray to wav
  let channels = [[], []];

  for (let x = 0; x < dataArray.length; x++) {
    if (x % 2 === 0) { // Spread over 2 channels
      channels[0][channels[0].length] = dataArray[x];
    } else {
      channels[1][channels[1].length] = dataArray[x];
    }
  }
  writeWav(channels);
}




// Simple conversions and math
function toBinary(number, bit) {
  let bin = Math.abs(number)
  bin = number.toString(2);
  return '0'.repeat(bit - bin.length) + bin;
}
function fromBinary(text) {
  return parseInt(text, 2);
}



// Math
function lerp(v1, v2, a) {
  return v1 + (v2 - v1) * a;
}




// Default conversion method
function colorToSample_Def(hex) {
  let { r, g, b, a } = Jimp.intToRGBA(hex);
  let bin = toBinary(r, 8) + toBinary(g, 8) + toBinary(b, 8) + toBinary(a, 8);
  let number = fromBinary(bin) / 4_294_967_296 // 32b - 4_294_967_296 ; 24b - 16_777_216;
  return (number * 2) - 1;
}


// other conversion methods
function colorToSample_Sin(hex) {
  let { r, g, b, a } = Jimp.intToRGBA(hex);
  return Math.sin(r) * Math.sin(g) * Math.sin(b) * Math.sin(a);
}






// Main functions

function imageToAudio(file) { // Simple, straight forward conversion algorithm
  Jimp.read('./' + file).then(
    image => { ////
      image.rgba = false;
      imgY = image.bitmap.height; imgX = image.bitmap.width; // Set the height and width

      // Iterate over every pixel because we can
      for (let y = 0; y < imgX; y++) {
        for (let x = 0; x < imgX; x++) { // Pixels to dataArray

          switch (conversionMethod) {
            case 1:
              dataArray[dataArray.length] = colorToSample_Sin(image.getPixelColor(x, y));;
              break;
            default:
              dataArray[dataArray.length] = colorToSample_Def(image.getPixelColor(x, y));;
              break;
          }

        }
      }

      // Check if array is even for 2 sound channels
      if (dataArray.length % 2 !== 0) {
        dataArray[dataArray.length] = 0;
      }

      console.log(dataArray);
      arrayToAudio();

    }).catch(err => { console.log('Something went wrong loading the image\n'); console.log(err); });
}



// Command line buttsauce

switch (_args[2]) {
  case 'def':
    imageToAudio(_args[3]);
    console.log('\nUsed the default method\n');
    break;

  case 'sin':
    conversionMethod = 1;
    imageToAudio(_args[3]);
    console.log('\nUsed the sin method\n');
    break;

  case 'printwav': // For reading the structure of a wav file
    let buffer = fs.readFileSync('./' + _args[3]);
    let channels = wav.decode(buffer);
    console.log(channels.sampleRate);
    console.log(channels.channelData);
    break;

  default: // For the lazy
    imageToAudio('imgin.png');
    console.log('\nLazily converted image to audio\n');
    break;
}