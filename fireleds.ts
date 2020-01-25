/* Helper Functions for 4tronix FireLeds */

/**
 * Custom blocks
 */
//% weight=50 color=#e7660b icon="\uf1da"
namespace fireled
{
    /* A band of FireLeds (single dimension) */

    export class Band
    {
        ledBuffer: Buffer;
        ledPin: DigitalPin;
        brightness: number;
        numLeds: number;

        /**
         * Sets the whole Band colour 
         * @param colour Colour to set
         */
        //% blockId="fire_setBand" block="set 01 band to %colour" 
        //% weight=50
        //% parts="fireled"
        setBand(colour: number)
        {
            for (let i=0; i<this.numLeds, i++)
            {
                this.setColour(i, colour);
            }
        }

        /** 
         * Update the LEDs in the Band
         */
        //% blockId="fire_updateBand" block="update band"
        //% weight=50
        //% parts="fireled"
        updateBand()
        {
            sk6812.sendBuffer(this.ledBuffer, this.ledPin);
        }

        private setColour(colour: number, idx: number)
        {
            let red = unpackR(colour);
            let green = unpackG(colour);
            let blue = unpackB(colour);

            const br = this.brightness;
            if (br < 255)
            {
                red = (red * br) >> 8;
                green = (green * br) >> 8;
                blue = (blue * br) >> 8;
            }
            this.ledBuffer [idx*3] = red;
            this.ledBuffer [idx*3+1] = green;
            this.ledBuffer [idx*3+2] = blue;
        }

    }

    function packRGB(a: number, b: number, c: number): number
    {
        return ((a & 0xFF) << 16) | ((b & 0xFF) << 8) | (c & 0xFF);
    }

    function unpackR(rgb: number): number
    {
        let r = (rgb >> 16) & 0xFF;
        return r;
    }

    function unpackG(rgb: number): number
    {
        let g = (rgb >> 8) & 0xFF;
        return g;
    }

    function unpackB(rgb: number): number
    {
        let b = (rgb) & 0xFF;
        return b;
    }

    /** Initial test function only - remove when tested
     * Create a new FireLed Band
     * @param pin FireLed pin
     * @param count number of FireLeds in the Band
     */
    //% blockId="fire_newBand" block="band on pin %pin|with %count|FireLeds"
    //% weight=50
    //% parts="fireled"
    export function newBand(pin: DigitalPin, count: number): Band
    {
        let band = new Band();
        band.ledBuffer = pins.createBuffer(count * 3);
        band.numLeds = count;
        band.brightness = 40;
        band.ledPin = pin;
        return band;
    }


}
