/// <reference path="../typings/index.d.ts" />
/// <reference path="./services.ts" />


interface IWelcomeScope extends ng.IScope {
    time: number;
}

class WelcomeCtrl {
    static $inject = ['$scope'];
    constructor(
        private _scope: IWelcomeScope
    ) {
        _scope.time = Date.now();
    }
}

class SenseCtrl {

}

interface ISenseQuestionScope extends ng.IScope {
    currNum: number;
    totalNum: number;
    question: string;
    template: string;
    storage: { answer: string, scale: number };

    submitAnswer(): void;
    getTouchPosition(e): { x: number, y: number };
    saveTouchPosition(): void;
}

class SenseQuestionCtrl {
    static $inject = ['$scope', '$stateParams', 'StorageService'];
    constructor(
        private _scope: ISenseQuestionScope,
        private _stateParams: { qId: string },
        private _storageSvc: Services.StorageService
    ) {
        _scope.currNum = parseInt(_stateParams.qId);
        _scope.totalNum = _storageSvc.templates.length;

        _scope.template = _storageSvc.templates[_scope.currNum - 1];
        _scope.storage = { answer: "", scale: 0 };

        _scope.submitAnswer = () => {
            _storageSvc.answers.push(_scope.storage.answer);

            if (_scope.currNum == _storageSvc.templates.length) {
                _storageSvc.saveAnswers();
                window.location.href = '#/tab/finished';
            } else {
                window.location.href = '#/tab/sense/' + (_scope.currNum + 1);
            }
        };

        _scope.getTouchPosition = (event) => {
            var canvasPosition = this.getPosition(event.gesture.touches[0].target);

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

        _scope.saveTouchPosition = () => {
            var tap = { x: 0, y: 0 };
            var position = _scope.getTouchPosition(event);

            var canvas = <HTMLCanvasElement>document.getElementById('canvas');
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

            _scope.storage.answer = JSON.stringify({'x': ansx, 'y': ansy});
        };
    }

    getPosition(element) {
        var xPosition = 0;
        var yPosition = 0;

        while (element) {
            xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }
        return { x: xPosition, y: yPosition };
    }
}

interface ISenseFinishedScope extends ng.IScope {
    answers: string[];
}

class FinishedCtrl {
    static $inject = ['$scope', 'StorageService'];
    constructor(
        private _scope: ISenseFinishedScope,
        private _storageSvc: Services.StorageService
    ) {
        _scope.answers = _storageSvc.answers;
    }
}

class SettingsCtrl {

}

angular.module('app.controllers', [])

    .controller('WelcomeCtrl', WelcomeCtrl)

    .controller('SenseCtrl', SenseCtrl)

    .controller('SenseQuestionCtrl', SenseQuestionCtrl)

    .controller('FinishedCtrl', FinishedCtrl)

    .controller('SettingsCtrl', SettingsCtrl);
