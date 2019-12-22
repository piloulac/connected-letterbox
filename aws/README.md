# AWS

AWS is used to manage the state of each application. I was using 3 main AWS services: 
- **AWS IoT** - used with topics & shadow to store state)
- **SNS** - to send notification of emails and parcel delivery
- **DynamoDB** - to store all applications data

Some lambda were used to trigger SNS notifications based on AWS IoT rules.

## AWS Lambda

You can find here two lambdas used when door were opened or when we receive a letter

### Architecture

What do they do?

#### doorOpened

1. It reads `'waitingForParcel'`from the shadow
2. updates `'doorOpen'` flag to true
3. check if you were waiting or not for a parcel and log two differents behavior

#### receivedLetter

1. It reads `'receivedLetters'` and `'numberOfLettersBeforeNotifications'` from the shadow
2. updates `'receivedLetters'` by increasing it by one
3. check if `receivedLetters >= numberOfLettersBeforeNotifications` and then log a message

#### TODO

Implements triggering of SNS services instead of `console.log("message")`

## DynamoDB

The dynamoDB was used to store the historic of email delivery

### Storing messages to AWS

1. create 2 new rules named store_letter_in_database & store_door_opening_in_database
1. Add a brief description
1. define the rule query statement to be: SELECT * FROM sensor/letter & SELECT * FROM sensor/door
1. Add a insert a message into a DynamoDB table action
1. Create a new database
1. Set myletterbox-database as name
1. Set id as partition key and String
1. Set type as sort key and String
1. Use default settings and create the database.
1. From the configure action page of the rule pass as Hash key value the value ${id}
1. From the configure action page of the rule pass as range key value the value ${type}
1. If you did it correctly for the 2 rules then if you go to Test section on your left pane. You can publish a message to the two concerned topic you will se the database being populated.