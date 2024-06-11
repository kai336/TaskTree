# todo
- [ ] implement backend
    - [x] make tree-structure database
        - [x] learn about SQL
    - [x] convert json data from DB to List of Task
    - [ ] reflect changes on taskTrees to DB 
        - [ ] build api
            - [ ] add root task
            - [ ] add child task

# how to start
```
docker-compose build
docker-compose up
cd frontend
npm run start
cd ../backend
node app.js
```