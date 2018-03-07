# CSCI430CTF1


make sure to do each of these steps in different command lines

## To setup database 
install docker. The instructions can be found here depending on your OS. https://docs.docker.com/install/

The following instructions is for Ubuntu OS.

$docker-compose up

$ docker ps #lists your current containers

$ sudo docker exec -it <Container_ID> bash #takes you to your container... the container_ID can be found after running $docker ps

$su <Your Database> #which in this case is postgres
$psql

'\c' # shows what database you are connected to
'\l' # lists all your current databases


 CREATE DATABASE ctfdb;
 \c ctfdb;
 \dt; #to see your tables which at this point should be empty since sequelize has not been ran.




 ## to run the application 
if you do not have node and npm installed on your computer make sure to install it first.
$cd CSCI430CTF1
$sudo npm install
$sudo npm install -g nodemon
$sudo npm install --save-dev nodemon
$sudo npm run start:dev


## to interact with the app

## to register
curl -d '{"username":"arman", "password":"arman"}' -H "Content-Type: application/json" -X POST http://localhost:8000/register
## to login
curl -v --cookie-jar cookies.txt -d '{"username":"arman", "password":"arman"}' -H "Content-Type: application/json" -X POST http://localhost:8000/login
## to close 
curl -b cookies.txt -d '{"action":"close"}' -H "Content-Type: application/json" -X POST http://localhost:8000/manage
## to balance
curl -b cookies.txt -d '{"action":"balance"}' -H "Content-Type: application/json" -X POST http://localhost:8000/manage
## to deposit
curl -b cookies.txt -d '{"action":"deposit","amount":100}' -H "Content-Type: application/json" -X POST http://localhost:8000/manage
## to withdraw
curl -b cookies.txt -d '{"action":"withdraw","amount":100}' -H "Content-Type: application/json" -X POST http://localhost:8000/manage



