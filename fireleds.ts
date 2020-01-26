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
        //% blockId="fire_setBand" block="%band|set 11 band to %colour" 
        //% weight=50
        //% parts="fireled"
        setBand(colour: number)
        {
            for (let i=0; i<this.numLeds; i++)
            {
                this.setPixel(i, colour);
            }
        }

        /**
         * Sets the colour of a single FireLed
         * @param pixel FireLed to set
         * @param colour colour to set
         */
        //% blockId="fire_setPixel" block="%band|set FireLed %pixel|to %colour" 
        //% weight=50
        //% parts="fireled"
        setPixel(pixel: number, colour: number)
        {
            let r = unpackR(colour);
            let g = unpackG(colour);
            let b = unpackB(colour);

            const bright = this.brightness & 0xff;
            r = (bright * r) >> 8;
            g = (bright * g) >> 8;
            b = (bright * b) >> 8;
            this.ledBuffer [pixel*3] = g;
            this.ledBuffer [pixel*3+1] = r; // yes, I know. Right?
            this.ledBuffer [pixel*3+2] = b;
        }

        /* Sets the brightness for future updates */
        setBrightness(bright: number)
        {
            this.brightness = bright & 0xff;
        }

        /* Clears all the FireLeds in the band */
        clearBand()
        {
            for (let i=0; i < (3 * this.numLeds); i++)
            {
                this.ledBuffer[i] = 0;
            }
        }

        /* get rgb colour number for Rainbow */
        private wheel(pos: number): number
        {
            /* Generate rainbow colors across 0-255 positions */
            if (pos < 85)
		return fromRGB(255 - pos * 3, pos * 3, 0); // Red -> Green
            else if (pos < 170)
            {
                pos = pos - 85
                return fromRGB(0, 255 - pos * 3, pos * 3); // Green -> Blue
            }
            else
            {
                pos = pos - 170
                return fromRGB(pos * 3, 0, 255 - pos * 3); // Blue -> Red
            }
        }

        /* Set band to rainbow colours Red to Blue */
        setRainbow()
        {
            let step = 256 / this.numLeds;
            for (let i=0; i<this.numLeds; i++)
            {
               this.setPixel(i, wheel(i * step));
            }
        }

        /* Shift band right one pixel, blanking first pixel */
        shiftBand()
        {
            let step=3;
            for (let i=1; i<this.numLeds; i++)
            {
                let j = i*step;
                this.ledBuffer[j+0] = this.ledBuffer[j+0-step];
                this.ledBuffer[j+1] = this.ledBuffer[j+1-step];
                this.ledBuffer[j+2] = this.ledBuffer[j+2-step];
            }
            this.ledBuffer[0] = 0;
            this.ledBuffer[1] = 0;
            this.ledBuffer[2] = 0;
        }

        /* Rotate band right one pixel, last pixel moves to first */
        rotateBand()
        {
            let step=3;
            let last = this.numLeds * step - step;
            let r = this.ledBuffer[last+0];
            let g = this.ledBuffer[last+1];
            let b = this.ledBuffer[last+2];
            this.shiftBand();
            this.ledBuffer[0] = r;
            this.ledBuffer[1] = g;
            this.ledBuffer[2] = b;
        }

        /** 
         * Update the FireLeds to match the buffer
         */
        //% blockId="fire_updateBand" block="%band|update band"
        //% weight=50
        //% parts="fireled"
        updateBand()
        {
            sk6812.sendBuffer(this.ledBuffer, this.ledPin);
        }

    }

    /* get rgb colour number for Rainbow */
    function wheel(pos: number): number
    {
        /* Generate rainbow colors across 0-255 positions */
        if (pos < 85)
            return this.fromRGB(255 - pos * 3, pos * 3, 0); // Red -> Green
        else if (pos < 170)
        {
            pos = pos - 85
            return this.fromRGB(0, 255 - pos * 3, pos * 3); // Green -> Blue
        }
        else
        {
            pos = pos - 170
            return this.fromRGB(pos * 3, 0, 255 - pos * 3); // Blue -> Red
        }
    }

    function fromRGB(a: number, b: number, c: number): number
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
    //% blockSetVariable=band
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
