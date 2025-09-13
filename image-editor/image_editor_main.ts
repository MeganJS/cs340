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
