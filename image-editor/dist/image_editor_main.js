"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const Buffer = require('buffer');
console.log("hello world!");
class ImageEditor {
    run(args) {
        try {
            if (args.length < 5) {
                this.usage();
                return;
            }
            let inputFile = "";
            let ouputFile = "";
            let filter = "";
            if (args[2] != undefined && args[3] != undefined && args[4] != undefined) {
                inputFile = args[2];
                ouputFile = args[3];
                filter = args[4];
            }
            else {
                this.usage();
                return;
            }
            let image = this.readImageFile(inputFile);
            if (filter === "grayscale") {
                console.log("You got it boss, one grayscale comin' up!");
            }
            this.writeImageFile(ouputFile, image);
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
            }
        }
    }
    usage() {
        console.log("USAGE: npm run start <in-file> <out-file> <grayscale|invert|emboss|motionblur> {motion-blur-length}");
    }
    readImageFile(path) {
        let image_buff = fs.readFileSync(path, 'utf-8');
        let image_list = image_buff.split(" ");
        const width = Number(image_list[1]);
        const height = Number(image_list[2]);
        let image = new Image(width, height, image_list);
        return image;
    }
    writeImageFile(path, image) {
        console.log(`writing the new image to path ${path}`);
        //TODO add try block here?
        const width = image._width;
        const height = image._height;
        const writeTo = fs.openSync(path, 'w');
        fs.writeSync(writeTo, `P3\n${width} ${height}\n255\n`);
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                let color = image.getColorAt(x, y);
                fs.writeSync(writeTo, `${color.red} ${color.green} ${color.blue}\n`);
            }
        }
        fs.closeSync(writeTo);
    }
}
class Color {
    red;
    green;
    blue;
    constructor(r, g, b) {
        this.red = r;
        this.green = g;
        this.blue = b;
    }
}
class Image {
    pixels;
    width;
    height;
    constructor(w, h, image_list) {
        this.width = w;
        this.height = h;
        let ind = 4;
        this.pixels = [];
        for (var y = 0; y < this.height; y++) {
            this.pixels[y] = [];
            for (var x = 0; x < this.width; x++) {
                let r = Number(image_list[ind]);
                let g = Number(image_list[ind + 1]);
                let b = Number(image_list[ind + 2]);
                ind += 3;
                const tempArr = this.pixels[y]; //got this code from internet https://stackoverflow.com/questions/78616119/typescript-array-access-with-nouncheckedindexedaccess
                if (tempArr != undefined) {
                    tempArr[x] = new Color(r, g, b);
                }
            }
        }
        //console.log(this.pixels)
    }
    get _width() {
        return this.width;
    }
    get _height() {
        return this.height;
    }
    getColorAt(x, y) {
        const tempArr = this.pixels[y];
        if (tempArr != undefined) {
            if (tempArr[x] != undefined) {
                return tempArr[x];
            }
        }
        console.log(`could not access color at ${x}, ${y}`);
        return new Color(0, 0, 0);
    }
    setColorAt(x, y, color) {
        const tempArr = this.pixels[y];
        if (tempArr != undefined) {
            tempArr[x] = color;
            return;
        }
        console.log(`could not access color at ${x}, ${y}`);
    }
}
function main() {
    if (typeof process.argv[2] === 'string') {
        let imageEditor = new ImageEditor;
        imageEditor.run(process.argv);
    }
    else {
        console.log("couldn't find source file in arguments");
    }
}
main();
//# sourceMappingURL=image_editor_main.js.map