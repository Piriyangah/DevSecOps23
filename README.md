# Progressive Web Apps - Vegane Rezepte Blog

Dieses Projekt enthält die Semesteraufgabe aus - aktuelle Trends der IKT 2022. Im Laufe des Semesters wurde eine Progressive Web Application entwickelt. Diese PWA ist ein Blog über vegane Rezepte. 

## Installation

- Zum Ausführen des Projektes wird [Node.js](https://nodejs.org) verendet. Sie müssen es auf Ihren Rechner installieren. 


- Zum Starten des Projektes wechseln Sie im Terminal (Terminal Ihres Rechners oder das Terminal in der IDE) in den Projektordner und führen dort 

	`npm install` 

	aus (es genügt auch `npm i`). Damit werden alle erforderlichen Abhängigkeiten installiert. Es entsteht der `node_modules`-Ordner. 

- Nach erfolgreicher Installation der Abhängigkeiten, geben Sie  

	`npm start` 

	ein, um Ihr Projekt auszuführen (Es wird der `http-server` mit der Option `-c-1` gestartet. Diese Option disabled Caching). Klicken Sie danach auf [localhost:8080](http://localhost:8080) oder geben Sie die URL direkt in Ihren Browser ein.

- Um das Backend zu starten müssen Sie aus dem Projektordner in den Backend Ordner wechseln mit cd backend und dann mit npm run watch starten

## Progressive Web Application hat:

- ein responsives Frontend

- ein Backend welches über die MongoDB Cloud verbunden ist

- eine Datenbank MongoDB 

- ist installierbar

- ist offline nutzbar

- verwendet die IndexedDB

- verwendet Hintergrundsynchronisation

- verwendet Push-Nachrichten

- verwendet die Gelocation API

- verwendet die Kamera