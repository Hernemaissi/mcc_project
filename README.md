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

## Deployment
### Install packages
```
  sudo apt-get update
  sudo apt-get install node
  sudo apt-get install mongodb
  sudo apt-get install git
  npm install -g nvm
  npm install -g forever
  nvm install node v0.11.14
  npm install
```

### Clone repo
  `git clone https://github.com/Hernemaissi/mcc_project.git`

### Run
  1. Go to mongo console (`mongo`) and create/check db mcc_data exists `use mcc_data`
  2. Start node.js server `forever start bin/www` (possibly needed to also specify node with `nvm use v0.11.14`)

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
  
#### GET /groups
##### Description
  Array of group information
##### Response
  ```json
  {
      "name" : "name",
      "members" : ["ID", "ID2"...]
  },
  ```

#### GET /groups/:id
##### Description
  Get group information by id
##### Route Params
   Param  |   Value 
  ------- | -----------
     id   |  Record id
##### Response
  ```json
  [
    {
      "name" : "name",
      "members" : ["ID", "ID2"...]
    },
    ...
  ]
  ```
  
#### POST /groups
##### Description
  Create new group entry
##### Request Body
  ```json
  {
    "name" : "name"
  }
  ```
##### Response
  ```json
  {
    "name" : "name",
    "members" : []
  }
  ```
  
#### DELETE /groups/:id
##### Description
  Delete group entry by id
##### Route Params
   Param  |   Value 
  ------- | -----------
     id   |  Record id
##### Response
  ```json
  {
      "name" : "name",
      "members" : ["ID", "ID2"...]
  },
  ```
  
#### PUT /groups/:id
##### Description
  Adds or removes a contact from group
##### Route Params
   Param  |   Value 
  ------- | -----------
     id   |  Record id

##### Request Body on add
  ```json
  {
    "add" : "true",
    "contact_id" : ID
  }
  ```
##### Request Body on remove
  ```json
  {
    "contact_id" : ID
  }
  ```

##### Response on add
  ```json
  "Member added"
  ```
  
##### Response on remove
  ```json
  "Member removed"
  ```