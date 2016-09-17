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
    storage: { answer: string };

    submitAnswer(): void;
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
        _scope.storage = { answer: "" };

        _scope.submitAnswer = () => {
            _storageSvc.answers.push(_scope.storage.answer);

            if (_scope.currNum == _storageSvc.templates.length) {
                _storageSvc.saveAnswers();
                window.location.href = '#/tab/finished';
            } else {
                window.location.href = '#/tab/sense/' + (_scope.currNum + 1);
            }
        }
    }
}

interface ISenseFinishedScope extends ng.IScope {
    answers: string[];
}

class FinishedCtrl {
    static $inject = ['$scope', 'StorageService'];
    constructor (
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
