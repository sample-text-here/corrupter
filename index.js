//default settings
let settings = {
  temp: 0.1,
  rock: 3,
  protect: 32,
  enprot: 8,
};

//require fs and path module
const fs = require("fs");
const path = require("path");

//read in arguments
process.argv.forEach((i, x) => {
  if (x > 1) {
    if (i.includes("=")) {
      //if it matchs key=value, then set the key in settings to value
      let tmp = i.split("=");
      //hacky way to convert to number if possble
      if (+tmp[1] == tmp[1]) tmp[1] = +tmp[1];
      settings[tmp[0]] = tmp[1];
    } else {
      //if it does not match key=value, it's the file name
      settings["file"] = i;
    }
  }
});

//detect errors in settings
//is rock an integer?
if (settings.rock != Math.floor(settings.rock)) {
  throw new Error("Rock is not an integer");
}

//is rock more than 0?
if (settings.rock < 0) {
  throw new Error("Rock is less than 0");
}

//is protect an integer?
if (settings.protect != Math.floor(settings.protect)) {
  throw new Error("Protect is not an integer");
}

//is protect more than 0?
if (settings.protect < 0) {
  throw new Error("Protect is less than 0");
}

//is enprot an integer?
if (settings.enprot != Math.floor(settings.enprot)) {
  throw new Error("Enprot is not an integer");
}

//is enprot more than 0?
if (settings.enprot < 0) {
  throw new Error("Enprot is less than 0");
}

//is rock too high (over 255)?
if (settings.rock > 255) {
  throw new Error("Rock is too high");
}

//is temp an float?
if (settings.temp < 0 || settings.temp > 1) {
  throw new Error("Temp is not an float");
}

//is there a file argument?
if (!settings.hasOwnProperty("file")) {
  throw new Error("Missing file name");
}

//resolve file name
settings.file = path.join(__dirname, settings.file);

//is file a real file?
if (!fs.existsSync(settings.file)) {
  throw new Error("File does not exist");
}

//read file
const file = fs.readFileSync(settings.file);

//convert to hex and make pairs of characters
const hexArray = file.toString("hex").match(/.{2}/g);

//map to decimal
const decArray = hexArray.map((i) => parseInt(i, 16));

//loop over array of characters
for (let i = settings.protect; i < decArray.length - settings.enprot; i++) {
  if (Math.random() < settings.temp) {
    //choose a random number between -rock and rock
    let random = settings.rock - Math.floor(Math.random() * settings.rock * 2);

    //add it to the decArray value
    decArray[i] += random;

    //if it's negative, fix it
    if (decArray[i] < 0) {
      decArray[i] += 256;
    }

    //if it's too high, fix it
    if (decArray[i] > 255) {
      decArray[i] -= 256;
    }
  }
}

//convert back to hex
const finArray = decArray
  .map((i) => i.toString(16).toUpperCase())
  .map((i) => (i.length == 1 ? "0" + i : i)); //leftpad
console.log(hexArray, finArray);

//make a buffer
const buffer = Buffer.from(finArray.join(""), "hex");
const name = path.basename(settings.file) + "_corrupted";

//repeat a thousand times to make sure no overwriting is done
for (let i = 0; i < 1024; i++) {
  let newname = path.join(
    settings.file,
    "..",
    name + "_" + i + path.extname(settings.file)
  );
  if (fs.existsSync(newname)) continue;
  fs.writeFileSync(newname, buffer);
  return;
}

throw new Error("How did we get here?");
