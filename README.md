# cngShake #
Cordova Angular  Ionic

This is a simple plugin for judgin wheter the device is shaking. It's based on Cordova and AngularJs.
Thanks for ngCordova and [leecrossley](https://github.com/leecrossley/cordova-plugin-shake "cordova-plugin-shake"), I learned some code from them.
## Install ##

first at all, cordova-plugin-device-motion is needed,

    cordova plugin add cordova-plugin-device-motion

or prefer
    
    ionic plugin add cordova-plugin-device-motion
    
then you can use bower to install cngShake by

    bower install cngShake

## Usage ##

you need to refrence ngShake.js, it usually located in
 > lib/cngShake/www/ngShake.js
 
## Example ##
 
    var onShake = function () {
        // Fired when a shake is detected
        console.log('shake!!');
        cngShake.stopWatch();
    };
    
    var onError = function () {
        // Fired when there is an accelerometer error (optional)
        console.log('watch acceleration error!')
    };

    // how sensitivity of device motion, default 30
    var sensitivity = 15;
    // shake 6 times call back once
    var shakeFrequency = 6; // default 6
    // limit = Prevent duplicate shakes callback within limit time(default is 750ms)
    // Start watching for shake gestures and call "onShake"
        
    var watch = cngShake.startWatch(onShake, onError, sensitivity, 
        shakeFrequency, limit);
        
        
## License ##

    The MIT License (MIT)
    Copyright © 2016 Lee Crossley 

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the “Software”), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.