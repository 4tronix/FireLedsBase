# MakeCode Helper Package for 4tronix FireLeds

This is a library of helper functions for products using the 4tronix FireLeds (SK6812)
Pixels: The Band starts at Pixel 0 and ends at Pixel <number of FireLeds - 1>. So a Band of 4 Fireleds is numbered 0 to 3
Updating: None of these functions (except Update) updates the actual FireLeds. All functions simply act on the memory buffer.
Most 4tronix products offer an automatic update function - this is handled in the product Makecode extension

## Initialising
Create a new Band of FireLeds of specified length on selected pin. Sets default brightness to 40. Returns a handle to the Band
```blocks
eg. create a Band of 12 FireLeds on pin 8
fireBand = fireled.newBand(DigitalPin.P8, 12)
```

Set the brightness of the Band. Takes effect on the next updateBand()
```blocks
eg. set brightness of Band to 100
fireBand.setBrightness(100)
```

Update the FireLeds with the contents of the memory buffer
```blocks
fireBand.updateBand()
```

## Setting Colours on the FireLeds
Set all the FireLeds on the Band to the selected colour. Colour is a 24bit number R, G, B - 8 bits each
```blocks
eg. Set all the FireLeds to Green
fireBand.setBand(0x00FF00)
```

Set a selected pixel in the Band to a specified colour
```blocks
eg. set pixel 5 to Blue
fireBand.setPixel(5, 0x0000FF)
```

Clear the whole Band - switch off all FireLeds
```blocks
fireBand.clearBand()
```

Set all FireLeds in the Band to a Rainbow. Starts at Red and finishes at Purple (ish)
```blocks
fireBand.setRainbow()
```

## Moving Pixels around
Shift the FireLeds up one place and set FireLed 0 to OFF
```blocks
fireBand.shiftBand()
```

Rotate the FireLeds right one place and set FireLed 0 to value of last
```blocks
fireBand.rotateBand()
```



## Supported targets

* for PXT/microbit

## License

MIT
