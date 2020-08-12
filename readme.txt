Corrupter - by lucas (sample-text-here)

This program requires no dependencies. It is a cli tool to corrupt files
To use, have node.js installed (I had 12.x) and run `node index.js <options> <file>`
`<file>` is self explanatory
`<options>` can be the following:
temp: How often to corrupt a byte. Default: 0.1
rock: How much to change a byte. Default: 3
protect: How many bytes to preserve at the beginning
    (in case the file has special headers) Default: 32
enprot: How many bytes to preserve at the end
    (in case the file has special headers) Default: 8

example:
`node index.js temp=0.2 rock=8 image.jpg`