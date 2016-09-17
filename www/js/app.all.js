/// <reference path="../typings/index.d.ts" />
var Services;
(function (Services) {
    var StorageService = (function () {
        function StorageService() {
            this.templates = [
                "questions/1.html",
                "questions/2.html"
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
        this._scope = _scope;
        this._stateParams = _stateParams;
        this._storageSvc = _storageSvc;
        _scope.currNum = parseInt(_stateParams.qId);
        _scope.totalNum = _storageSvc.templates.length;
        _scope.template = _storageSvc.templates[_scope.currNum - 1];
        _scope.storage = { answer: "" };
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
    }
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
