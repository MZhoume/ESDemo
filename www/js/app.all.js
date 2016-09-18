/// <reference path="../typings/index.d.ts" />
var Services;
(function (Services) {
    var StorageService = (function () {
        function StorageService() {
            this.templates = [
                "questions/0.html",
                "questions/1.html",
                "questions/2.html",
                "questions/3.html"
            ];
            this.answers = [];
        }
        StorageService.prototype.saveAnswers = function () {
            var _this = this;
            return;
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                console.log('Saving to: ' + fs.name);
                fs.root.getFile("answers.txt", { create: true, exclusive: true }, function (entry) {
                    writeFile(entry, JSON.stringify(_this.answers));
                }, function (e) { console.log(e); });
            }, function (e) { console.log(e); });
        };
        return StorageService;
    }());
    Services.StorageService = StorageService;
})(Services || (Services = {}));
angular.module('app.services', [])
    .service('StorageService', Services.StorageService);

/// <reference path="../typings/index.d.ts" />
/// <reference path="./services.ts" />
var WelcomeCtrl = (function () {
    function WelcomeCtrl(_scope) {
        this._scope = _scope;
        _scope.time = Date.now();
    }
    WelcomeCtrl.$inject = ['$scope'];
    return WelcomeCtrl;
}());
var SenseCtrl = (function () {
    function SenseCtrl() {
    }
    return SenseCtrl;
}());
var SenseQuestionCtrl = (function () {
    function SenseQuestionCtrl(_scope, _stateParams, _storageSvc) {
        var _this = this;
        this._scope = _scope;
        this._stateParams = _stateParams;
        this._storageSvc = _storageSvc;
        _scope.currNum = parseInt(_stateParams.qId);
        _scope.totalNum = _storageSvc.templates.length;
        _scope.template = _storageSvc.templates[_scope.currNum - 1];
        _scope.storage = { answer: "", scale: 0 };
        _scope.submitAnswer = function () {
            _storageSvc.answers.push(_scope.storage.answer);
            if (_scope.currNum == _storageSvc.templates.length) {
                _storageSvc.saveAnswers();
                window.location.href = '#/tab/finished';
            }
            else {
                window.location.href = '#/tab/sense/' + (_scope.currNum + 1);
            }
        };
        _scope.getTouchPosition = function (event) {
            var canvasPosition = _this.getPosition(event.gesture.touches[0].target);
            var tap = { x: 0, y: 0 };
            if (event.gesture.touches.length > 0) {
                var tt = event.gesture.touches[0];
                tap.x = tt.clientX || tt.pageX || tt.screenX || 0;
                tap.y = tt.clientY || tt.pageY || tt.screenY || 0;
            }
            tap.x = tap.x - canvasPosition.x;
            tap.y = tap.y - canvasPosition.y;
            return { x: tap.x, y: tap.y };
        };
        _scope.saveTouchPosition = function () {
            var tap = { x: 0, y: 0 };
            var position = _scope.getTouchPosition(event);
            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            var cwidth = canvas.width;
            var cheight = canvas.height;
            var cswidth = canvas.clientWidth;
            var scale = cwidth / cswidth;
            var pox = position.x * scale;
            var poy = position.y * scale;
            context.beginPath();
            context.lineWidth = 15;
            context.strokeStyle = 'red';
            context.arc(pox, poy, 3, 0, 2 * Math.PI);
            context.stroke();
            var ansx = pox / (cwidth / 10);
            var ansy = poy / (cheight / 10);
            _scope.storage.answer = JSON.stringify({ 'x': ansx, 'y': ansy });
        };
    }
    SenseQuestionCtrl.prototype.getPosition = function (element) {
        var xPosition = 0;
        var yPosition = 0;
        while (element) {
            xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }
        return { x: xPosition, y: yPosition };
    };
    SenseQuestionCtrl.$inject = ['$scope', '$stateParams', 'StorageService'];
    return SenseQuestionCtrl;
}());
var FinishedCtrl = (function () {
    function FinishedCtrl(_scope, _storageSvc) {
        this._scope = _scope;
        this._storageSvc = _storageSvc;
        _scope.answers = _storageSvc.answers;
    }
    FinishedCtrl.$inject = ['$scope', 'StorageService'];
    return FinishedCtrl;
}());
var SettingsCtrl = (function () {
    function SettingsCtrl() {
    }
    return SettingsCtrl;
}());
angular.module('app.controllers', [])
    .controller('WelcomeCtrl', WelcomeCtrl)
    .controller('SenseCtrl', SenseCtrl)
    .controller('SenseQuestionCtrl', SenseQuestionCtrl)
    .controller('FinishedCtrl', FinishedCtrl)
    .controller('SettingsCtrl', SettingsCtrl);
