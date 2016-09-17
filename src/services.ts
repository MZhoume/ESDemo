/// <reference path="../typings/index.d.ts" />

namespace Services {
    export class StorageService {
        templates: string[] = [
            "questions/1.html",
            "questions/2.html"
        ];

        answers: string[] = [];

        saveAnswers() {
            return;
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fs) => {
                console.log('Saving to: ' + fs.name);
                fs.root.getFile("answers.txt", 
                {create: true, exclusive: true},
                (entry) => {
                    writeFile(entry, JSON.stringify(this.answers));
                }, (e) => {console.log(e);})
            }, (e) => {console.log(e);});
        }
    }
}

angular.module('app.services', [])

    .service('StorageService', Services.StorageService);
