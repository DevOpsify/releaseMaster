#!/bin/sh

set -xe

wait_for_db(){
  #Naive check, better check would be ping the port
    sleep 8
}

start_node(){
  cd /usr/src/app
  npm start
}

main(){
  wait_for_db
  start_node
}

main