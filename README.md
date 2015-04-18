# YATODO
Yet Another TODO application

This repository contains the code developed as by of this guide (Link not available yet) at airpair.

This is an application written using Firebase, Iron.io worker and Ionic. Development of
the code base is done in stages and for every stage there is a corresponding git branch.

## Stage 1

https://github.com/ksachdeva/YATODO/tree/ninja-stage-1

git checkout -b ninja-stage-1 origin/ninja-stage-1

- How you could automate the testing of the rules
- Very basic firebase rules for reading and writing user profile
- Use of mocha and chai framework to write the tests

## Stage 2

https://github.com/ksachdeva/YATODO/tree/ninja-stage-2

git checkout -b ninja-stage-2 origin/ninja-stage-2

- Security rules and corresponding tests for organizations
- Security rules and corresponding tests for staff management at organization

## Stage 3

https://github.com/ksachdeva/YATODO/tree/ninja-stage-3

git checkout -b ninja-stage-3 origin/ninja-stage-3

- Security rules and corresponding tests for managing the todos

## Stage 4

https://github.com/ksachdeva/YATODO/tree/ninja-stage-4

git checkout -b ninja-stage-4 origin/ninja-stage-4

- nodejs based workers to listen and perform user email verification
- nodejs based cli (client app) to register and verify the user

## Stage 5

https://github.com/ksachdeva/YATODO/tree/ninja-stage-5

git checkout -b ninja-stage-5 origin/ninja-stage-5

- Usage of iron.io's ironworker to do user invitation code generation
- Queuing ironworker's task from nodejs based workers
