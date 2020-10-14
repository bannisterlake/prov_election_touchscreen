# Provincial Election Touchscreen Widget

Can run several provincial elections simultaneously locally, for use within the same network, or via web using a static bucket. 

## RUN WIDGET LOCALLY: 

Pull from git hub.

```npm
npm install
```

```npm
npm start
```

To use on same computer as app is running locally: 

Navigate to http://localhost:3000/?prov=# enter 2-letter provincial code here


Or on a computer within the same network as where the app is running: 

Navigate to http://# IP ADDRESS HERE:3000/?prov=# enter 2 letter provincial code here

## RUN WIDGET ON STATIC BUCKET

Pull from git hub

Place contents of "dist" folder in the static bucket

## CONFIGS

Navigate to the respective {prov}election.config.json to adjust the widget variables.

"timer" - Given in ms to change the rate at which the data is refreshed

"database" - Points to the database that is holding the election data. Leave blank if the election is over and the data in the widget is up-to-date. OR if the widget is being hosted on a static bucket. 

Leave all other parameters default.
