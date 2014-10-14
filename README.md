# MCC Project

## Setup

### Node.js & Express
1. `brew install node` or download and install from [node](http://nodejs.org/download/)
1.1 Optionally install express globally `npm install -g express` (also `npm install -g express-generator` for scaffolding)
2. Run `npm install` within project folder
3. Start server using: `npm start`
4. Go to [localhost:3000](http://localhost:3000)

### Mongodb
1. `brew install mongodb` or download and install from [mongodb](https://www.mongodb.org/)
2. `mkdir data`
3. `mongod --dbpath data`
4. To test using mongo console `mongo mcc_data`

## API

#### GET /contacts
##### Description
  Array of contact information
##### Response
  ```json
  {
    "name" : "name",
    "email" : "email@example.com",
    "phone" : "+123 456 7890"
  }
  ```
##### Test Command
  ```
    curl \
      -X GET \
      -H "Accept: application/json" \
      -H "Content-Type: application/json" \
      http://localhost:3000/contacts
  ```

#### GET /contacts/:id
##### Description
  Get contact information by id
##### Route Params
   Param  |   Value 
  ------- | -----------
     id   |  Record id
##### Response
  ```json
  [
    {
      "name" : "name",
      "email" : "email@example.com",
      "phone" : "+123 456 7890"
    },
    ...
  ]
  ```
##### Test Command
  Replace :id with a contact id
  ```
    curl \
      -X GET \
      -H "Accept: application/json" \
      -H "Content-Type: application/json" \
      http://localhost:3000/contacts/:id
  ```

#### GET /contacts/search
##### Description
  Get contact information by id
##### Request Query Params
   Param  |   Value 
  ------- | -----------
    q     |  Contact name (case-insensitive substring matched)
##### Response
  ```json
  [
    {
      "name" : "name",
      "email" : "email@example.com",
      "phone" : "+123 456 7890"
    },
    ...
  ]
  ```
##### Test Command
  Replace q with different name partial if needed
  ```
    curl \
      -X GET \
      -H "Accept: application/json" \
      -H "Content-Type: application/json" \
      http://localhost:3000/contacts/search?q=te
  ```

#### POST /contacts
##### Description
  Create new contact information entry
##### Request Body
  ```json
  {
    "name" : "name",
    "email" : "email@example.com",
    "phone" : "+123 456 7890"
  }
  ```
##### Response
  ```json
  {
    "name" : "name",
    "email" : "email@example.com",
    "phone" : "+123 456 7890"
  }
  ```
##### Test Command
  ```
    curl \
      -X POST \
      -H "Accept: application/json" \
      -H "Content-Type: application/json" \
      -d '{"name":"test","email":"test@example.com", "phone":"+123 456 7890"}' \
      http://localhost:3000/contacts
  ```

#### DELETE /contacts/:id
##### Description
  Delete contact information entry by id
##### Route Params
   Param  |   Value 
  ------- | -----------
     id   |  Record id
##### Response
  ```json
  {
    "name" : "name",
    "email" : "email@example.com",
    "phone" : "+123 456 7890"
  }
  ```
##### Test Command
  Replace :id with a contact id
  ```
    curl \
      -X DELETE \
      -H "Accept: application/json" \
      -H "Content-Type: application/json" \
      http://localhost:3000/contacts/:id
  ```
