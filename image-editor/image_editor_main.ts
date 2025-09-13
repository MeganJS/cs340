const fs = require('fs');
const Buffer = require('buffer');
console.log("hello world!")

class ImageEditor{

    run(args: string[]){
        try {
            if (args.length < 5) {
                this.usage()
                return
            }

            let inputFile: string = ""
            let ouputFile: string = ""
            let filter: string = ""

            if (args[2] != undefined && args[3] != undefined && args[4] != undefined) {
                inputFile = args[2]
                ouputFile = args[3]
                filter = args[4]
            } else {
                this.usage()
                return
            }

            let image: Image = this.readImageFile(inputFile)

            if (filter === "grayscale"){
                console.log("You got it boss, one grayscale comin' up!")
                this.grayscale(image)
            } else if (filter == "invert") {
                console.log("inversion start! !start inversion")
                this.invert(image)
            } else if (filter === "emboss") {
                console.log("We will of course emboss this image, honored patron of the arts.")
                this.emboss(image)
            } else if (filter === "motionblur") {
                if (args.length < 6) {
                    this.usage()
                    return
                }
                
                if (args[5] === undefined) {
                    this.usage()
                    return
                }

                let blurLen: number = -1
                try{
                    blurLen = Number.parseInt(args[5])
                } catch (e) {
                    if (e instanceof Error) {
                        //not gonna worry about it
                    }
                }
                if (blurLen < 0){
                    this.usage()
                    return
                }

                console.log("I'll motionblur as fast as a wink!")
                this.motionblur(image, blurLen)
            }

            this.writeImageFile(ouputFile, image)


        } catch (e) {
            if (e instanceof Error){
                console.error(e.message)
            }
        }
    }


    private usage(){
        console.log("USAGE: npm run start <in-file> <out-file> <grayscale|invert|emboss|motionblur> {motion-blur-length}")
    }
    
    readImageFile(path: string): Image {
        let image_buff = fs.readFileSync(path, 'utf-8');
        let image_list: string[] = image_buff.split(" ")
        const width: number = Number(image_list[1])
        const height: number = Number(image_list[2])

        let image: Image = new Image(width, height, image_list)
        return image
    }

    grayscale(image: Image) {
        const width = image._width
        const height = image._height
        
        for (var y: number = 0; y < height; y++){
            for (var x: number = 0; x < width; x++){
                let color: Color = image.getColorAt(x,y)
                let graylevel: number = Math.floor((color.red + color.green + color.blue) / 3)
                let gray: Color = new Color(graylevel, graylevel, graylevel)
                image.setColorAt(x,y,gray)
            }
        }
    }

    invert(image: Image) {
        const width = image._width
        const height = image._height
        for (var y: number = 0; y < height; y++){
            for (var x: number = 0; x < width; x++){
                let color: Color = image.getColorAt(x,y)
                let invertColor: Color = new Color(255-color.red, 255-color.green, 255-color.blue)
                image.setColorAt(x,y,invertColor)
            }
        }

    }

    emboss(image: Image) {
        const width = image._width
        const height = image._height
        
        for (var x: number = width-1; x >=0 ; --x){
            for (var y: number = height-1; y >= 0; --y){
                let color: Color = image.getColorAt(x,y)
                
                let diff: number = 0
                if (x > 0 && y > 0) {
                    let upLeftColor: Color = image.getColorAt(x-1, y-1)
                    if(Math.abs(color.red - upLeftColor.red) > Math.abs(diff)) {
                        diff = color.red - upLeftColor.red
                    }
                    if(Math.abs(color.green - upLeftColor.green) > Math.abs(diff)) {
                        diff = color.green - upLeftColor.green
                    }
                    if(Math.abs(color.blue - upLeftColor.blue) > Math.abs(diff)) {
                        diff = color.blue - upLeftColor.blue
                    }
                }
                let graylevel: number = 128 + diff
                graylevel = Math.max(0, Math.min(graylevel, 255))

                image.setColorAt(x,y, new Color(graylevel, graylevel, graylevel))
            }
        }
    }

    motionblur(image: Image, blurLen: number) {
        const width = image._width
        const height = image._height

        for (var y: number = 0; y < height; y++){
            for (var x: number = 0; x < width; x++){
                let color: Color = image.getColorAt(x,y)

                let maximumX: number = Math.min(width - 1, x + blurLen - 1)
                for (var i: number = x + 1; i <= maximumX; ++i) {
                    let tmpColor: Color = image.getColorAt(i,y)
                    color.red += tmpColor.red
                    color.green += tmpColor.green
                    color.blue += tmpColor.blue
                }

                let delta: number = (maximumX - x + 1)
                let newRed = Math.floor(color.red / delta)
                let newGreen = Math.floor(color.green / delta)
                let newBlue = Math.floor(color.blue / delta)
                image.setColorAt(x, y, new Color(newRed, newGreen, newBlue))

            }
        }
    }

    writeImageFile(path: string, image: Image) {
        console.log(`writing the new image to path ${path}`)
        //TODO add try block here?
        const width = image._width
        const height = image._height
        const writeTo = fs.openSync(path, 'w')

        fs.writeSync(writeTo, `P3\n${width} ${height}\n255\n`)
        for (var y: number = 0; y < height; y++){
            for (var x: number = 0; x < width; x++){
                let color: Color = image.getColorAt(x,y)
                fs.writeSync(writeTo, `${color.red} ${color.green} ${color.blue}\n`)
            }
        }

        fs.closeSync(writeTo)
    }

}


class Color {
    red: number
    green: number
    blue: number
    constructor(r: number, g: number, b: number) {
        this.red = r
        this.green = g
        this.blue = b
    }
}

class Image {
    private pixels: Color[][]
    private width: number
    private height: number
    constructor(w:number, h:number, image_list: String[]){
        this.width = w
        this.height = h
        let ind: number = 4
        this.pixels = []
        for (var y: number = 0; y < this.height; y++) {
            this.pixels[y] = []
            for (var x: number = 0; x < this.width; x++){
                let r: number = Number(image_list[ind])
                let g: number = Number(image_list[ind+1])
                let b: number = Number(image_list[ind+2])
                ind += 3
                const tempArr = this.pixels[y] //got this code from internet https://stackoverflow.com/questions/78616119/typescript-array-access-with-nouncheckedindexedaccess
                if (tempArr != undefined){
                    tempArr[x] = new Color(r,g,b)
                }
            }
        }
        //console.log(this.pixels)
    }
    public get _width() {
        return this.width
    }
    public get _height() {
        return this.height
    }
    getColorAt(x:number, y:number): Color{
        const tempArr = this.pixels[y]
        if (tempArr != undefined){
            if (tempArr[x] != undefined){
                return tempArr[x]
            }
        }
        console.log(`could not access color at ${x}, ${y}`)
        return new Color(0,0,0)
    }
    
    setColorAt(x: number, y: number, color: Color) {
        const tempArr = this.pixels[y]
        if (tempArr != undefined){
            tempArr[x] = color
            return
        }
        console.log(`could not access color at ${x}, ${y}`)
    }

}

function main() {
    if (typeof process.argv[2] === 'string'){
        let imageEditor: ImageEditor = new ImageEditor
        imageEditor.run(process.argv)
    }
    else{
        console.log("couldn't find source file in arguments")
    }
}

main()
