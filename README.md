# Block32 CRUD Demo

# CURL commands to test api routes

`curl localhost:3000/api/notes`
`curl localhost:3000/api/notes/1 -X DELETE`
`curl localhost:3000/api/notes -X POST -d '{"txt": "a new note", "ranking":3 }' -H 'Content-Type:application/json'`
`curl localhost:3000/api/note/2 -X PUT -d '{"txt": "updated note", "ranking":10 }' -H 'Content-Type:application/json'`
