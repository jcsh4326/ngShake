(function(){
'use strict';
var isUndifined = function (obj) {
    return typeof obj === 'undifined';
}
    
var isUndfd = function () {
    return isUndifined(navigator.accelerometer);
}
var isFunc = function (func) {
    return typeof func === 'function';
}
angular.module('me.chaos.cordovaPlugins',[])
/**
 * this plugin is for cordova-plugin-device-motion (since 6.x) and
 * forked from ngCordova.plugins.deviceMotion (link : https://github.com/driftyco/ng-cordova/blob/master/src/plugins/deviceMotion.js)
 */
.factory('cDeviceMotion',['$q', function ($q) {
    
    
    
    /**
     * for browser:
     *   X, Y, Z motion are all randomly generated
     * for android:
     *  he accelerometer is called with the SENSOR_DELAY_UI flag, 
     *  which limits the maximum readout frequency to something between 20 and 60 Hz, 
     *  depending on the device. 
     *  Values for period corresponding to higher frequencies will result in duplicate samples
     * for IOS:
     *  iOS doesn't recognize the concept of getting the current acceleration at any given point.
     *  use watchAcceleration instead.ß
     */
    var getCurrentAcceleration = function () {
        var q = $q.defer();
        if(isUndfd()||
            !isFunc(navigator.accelerometer.getCurrentAcceleration)){
            var err = isUndfd() ? 'navigator.accelerometer is undifined!' :
                'getCurrentAcceleration is uncompatibility!';
                console.error(err);
                q.reject(err);
        }
        
        var onSuccess = function (acceleration) {
            q.resolve(acceleration);
            // alert('Acceleration X: ' + acceleration.x + '\n' +
            //     'Acceleration Y: ' + acceleration.y + '\n' +
            //     'Acceleration Z: ' + acceleration.z + '\n' +
            //     'Timestamp: '      + acceleration.timestamp + '\n');
        }

        var onError = function (err) {
            q.reject(err);
        }

        navigator.accelerometer
            .getCurrentAcceleration(onSuccess, onError);
        return q.promise;
    }
    
    var _options = {frequency: 1000};
    
    /**
     * for IOS:
     * The API calls the success callback function at the interval requested, 
     * but restricts the range of requests to the device between 40ms and 1000ms. For example, if you request an interval of 3 seconds, (3000ms), the API requests data from the device every 1 second, but only executes the success callback every 3 seconds.    
     * param: 
     *  options {frequency: requested period of calls to accelerometerSuccess with acceleration data in Milliseconds. (Number) (Default: 10000)}
     */
    var watchAcceleration = function (options) {
        // * if cordova.platformId === "browser" ,window.dispatchEvent(devicemotionEvent);
        var q = $q.defer();
        if(isUndfd()||
            !isFunc(navigator.accelerometer.watchAcceleration)){
            var err = isUndfd() ? 'navigator.accelerometer is undifined!' :
                'watchAcceleration is uncompatibility!';
                console.error(err);
                q.reject(err);
        }
        
        var onSuccess = function (acceleration) {
            // q should never resolved
            q.notify(acceleration);
            // alert('Acceleration X: ' + acceleration.x + '\n' +
            //     'Acceleration Y: ' + acceleration.y + '\n' +
            //     'Acceleration Z: ' + acceleration.z + '\n' +
            //     'Timestamp: '      + acceleration.timestamp + '\n');
        }

        var onError = function (err) {
            q.reject(err);
        }
        
        options = options || _options;
        options.frequency = options.frequency || 
            _options.frequency;
        var watchId = navigator.accelerometer.watchAcceleration(
            onSuccess,onError,options
        );
        q.promise.cancel = function () {
            navigator.accelerometer.clearWatch(watchId);
            q.promise.clearWatch = function (id) {
                navigator.accelerometer.clearWatch(id || watchId);
            }
        }
        q.promise.watchId = watchId;
        
        return q.promise;
    }
    
    var clearWatch = function (watchId) {
        return navigator.accelerometer.clearWatch(watchId);
    }
    
    return {
        clearWatch: clearWatch,
        watchAcceleration: watchAcceleration,
        getCurrentAcceleration: getCurrentAcceleration
    }
}])
.factory('cShake',['$q','$timeout','cDeviceMotion', function ($q, $timeout, motion) {
    // watchId by watchAcceleration
    var watch = null;
    
    var options = {
        frequency: 40
    }, previousAcceleration = null;
    
    var shakeBack = null;
    // how sensitivity of device motion
    var _sensitivity = 30;
    var _shakeFrequency = 6, _shaked = 0;
    
    // Prevent duplicate shakes within limit time(default is 750ms)
    var debounce = function (onShake, limit) {
        var promise;
        return function () {
            if (promise) {
                return;
            }

            promise = $timeout(function () {
                $timeout.cancel(promise)
                promise = null;
            }, limit||750);

            onShake();
        };
    };
    
    // Assess the current acceleration parameters to determine a shake
    var assessCurrentAcceleration = function (acceleration) {
        console.log('assess...');
        var delX=0, delY=0, delZ=0;
        if (previousAcceleration && previousAcceleration.x) {
            delX = Math.abs(previousAcceleration.x - acceleration.x);
            delY = Math.abs(previousAcceleration.y - acceleration.y);
            delZ = Math.abs(previousAcceleration.z - acceleration.z);
        }

        previousAcceleration = acceleration;       

        // should make a motion in at least one direcation 
        if (delX>_sensitivity||delY>_sensitivity||delZ>_sensitivity){
            // Shake detected
            console.log('callback shake...');
            _shaked++;
            if(_shaked===_shakeFrequency){
                _shaked = 0;
                shakeBack();
            }
        }
    };
        
    var startWatch = function (onShake, onError, sensitivity, shakeFrequency, limit) {
        if(!isFunc(onShake)){
            console.err('must input first param callback as a function');
            return;
        }
        _sensitivity = typeof sensitivity === 'number' ? sensitivity : _sensitivity;
        _shakeFrequency = typeof shakeFrequency === 'number' ? shakeFrequency : _shakeFrequency;
        shakeBack = debounce(onShake, limit);
        
        var _notify = function () {
            console.log('waiting...');
        }        

        // var watchId = navigator.accelerometer.watchAcceleration(assessCurrentAcceleration, onError, options);
        // watch = {watchId: watchId};
        watch = motion.watchAcceleration(options);
        watch.then(null, onError, assessCurrentAcceleration);
    }
    
    var stopWatch = function () {
        if (watch !== null) {
            motion.clearWatch(watch.watchId);
            _shaked = 0;
            watch = null;
            previousAcceleration = null;
        }
    };
    
    return {
        startWatch: startWatch,
        stopWatch: stopWatch
    }
}])
})();