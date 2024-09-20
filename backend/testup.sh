#!/bin/bash

existps="$(sudo docker container ls -al | grep tests | awk '{print $1;}')"
    while [[ ! -z $existps ]]
    do
    sudo docker container stop $existps
    sudo docker rm $existps
    existps="$(sudo docker ps -al | grep tests | awk '{print $1;}')"
    done

    existps="$(sudo docker ps -al | grep tests | awk '{print $1;}')"
    while [[ ! -z $existps ]]
    do
    sudo docker rm $existps
    existps="$(sudo docker ps -al | grep tests | awk '{print $1;}')"
    done

    existvol="$(docker volume ls --filter name=pgtestdata -q)"

    if [[ ! -z $existvol ]] 
    then
        sudo docker volume rm -f $(sudo docker volume ls --filter name=pgtestdata -q)
    fi
existps="$(sudo docker container ls -al | grep dbtest | awk '{print $1;}')"
    while [[ ! -z $existps ]]
    do
    sudo docker container stop $existps
    sudo docker rm $existps
    existps="$(sudo docker ps -al | grep dbtest | awk '{print $1;}')"
    done

    existps="$(sudo docker ps -al | grep dbtest | awk '{print $1;}')"
    while [[ ! -z $existps ]]
    do
    sudo docker rm $existps
    existps="$(sudo docker ps -al | grep dbtest | awk '{print $1;}')"
    done

    existvol="$(docker volume ls --filter name=pgtestdata -q)"

    if [[ ! -z $existvol ]] 
    then
        sudo docker volume rm -f $(sudo docker volume ls --filter name=pgtestdata -q)
    fi

sudo docker compose -f ./docker-compose.yml up  tests

