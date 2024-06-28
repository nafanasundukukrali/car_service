#!/bin/bash

reset_db()
{
    existps="$(sudo docker container ls -al | grep db | awk '{print $1;}')"
    while [[ ! -z $existps ]]
    do
    sudo docker container stop $existps
    sudo docker rm $existps
    existps="$(sudo docker ps -al | grep db | awk '{print $1;}')"
    done

    existps="$(sudo docker ps -al | grep db | awk '{print $1;}')"
    while [[ ! -z $existps ]]
    do
    sudo docker rm $existps
    existps="$(sudo docker ps -al | grep db | awk '{print $1;}')"
    done

    existvol="$(docker volume ls --filter name=pgtestdata -q)"

    if [[ ! -z $existvol ]] 
    then
        sudo docker volume rm -f $(sudo docker volume ls --filter name=pgtestdata -q)
    fi

    sudo docker compose up db &
}

if [ -f ./res_test_db_no_index.txt ]; then
    rm ./res_test_db_no_index.txt
fi

touch ./res_test_db_no_index.txt

for (( i=0; i <= 190000; i=i+10000 ))
do
    reset_db
    sleep 10
    PGPASSWORD=$(cat .env | grep POSTGRES_PASSWORD= | cut -f2 -d"=") psql  -h $(cat .env | grep POSTGRES_HOST= | cut -f2 -d"=") \
            -p $(cat .env | grep POSTGRES_PORT= | cut -f2 -d"=") \
            -d $(cat .env | grep POSTGRES_DB= | cut -f2 -d"=") \
            -U $(cat .env | grep POSTGRES_USER= | cut -f2 -d"=") \
            --command "\copy AutoService.Client(id, email, fio, datebirth, phone, password) from './fake/data/test/${i}.csv' with delimiter ';';"
    for (( j=0; j <= 20; j++ ))
    do
        str="i=${i}, j=${j}"
        echo $str
        val=$(echo "EXPLAIN ANALYZE select * from AutoService.Client order by datebirth;" | LANG=C PGPASSWORD=$(cat .env | grep POSTGRES_PASSWORD= | cut -f2 -d"=")  psql  -h $(cat .env | grep POSTGRES_HOST= | cut -f2 -d"=") \
            -p $(cat .env | grep POSTGRES_PORT= | cut -f2 -d"=") \
            -d $(cat .env | grep POSTGRES_DB= | cut -f2 -d"=") \
            -U $(cat .env | grep POSTGRES_USER= | cut -f2 -d"="))
        val1=$(echo $val| tr ' ' '\n' | tail -4 | tr '\n' ' ' | cut -f 1 -d ' ')
        val2=$(echo $val| tr ' ' '\n' | tail -10 | tr '\n' ' ' | cut -f 3 -d ' ')
        res=$(echo "$val1+$val2" | bc)
        echo $res >> ./res_test_db_no_index.txt

    done
done

if [ -f ./res_test_db_index.txt ]; then
    rm ./res_test_db_index.txt
fi

touch ./res_test_db_index.txt

for (( i=0; i <= 190000; i=i+10000 ))
do
    reset_db
    sleep 10
    PGPASSWORD=$(cat .env | grep POSTGRES_PASSWORD= | cut -f2 -d"=") psql  -h $(cat .env | grep POSTGRES_HOST= | cut -f2 -d"=") \
            -p $(cat .env | grep POSTGRES_PORT= | cut -f2 -d"=") \
            -d $(cat .env | grep POSTGRES_DB= | cut -f2 -d"=") \
            -U $(cat .env | grep POSTGRES_USER= | cut -f2 -d"=") \
            --command "CREATE INDEX idx_user ON AutoService.Client USING BTREE (datebirth);"
    PGPASSWORD=$(cat .env | grep POSTGRES_PASSWORD= | cut -f2 -d"=") psql  -h $(cat .env | grep POSTGRES_HOST= | cut -f2 -d"=") \
            -p $(cat .env | grep POSTGRES_PORT= | cut -f2 -d"=") \
            -d $(cat .env | grep POSTGRES_DB= | cut -f2 -d"=") \
            -U $(cat .env | grep POSTGRES_USER= | cut -f2 -d"=") \
            --command "\copy AutoService.Client(id, email, fio, datebirth, phone, password) from './fake/data/test/${i}.csv' with delimiter ';';"
    for (( j=0; j <= 20; j++ ))
    do
        str="i=${i}, j=${j}"
        echo $str
        val=$(echo "EXPLAIN ANALYZE select * from AutoService.Client order by datebirth;" | LANG=C PGPASSWORD=$(cat .env | grep POSTGRES_PASSWORD= | cut -f2 -d"=")  psql  -h $(cat .env | grep POSTGRES_HOST= | cut -f2 -d"=") \
            -p $(cat .env | grep POSTGRES_PORT= | cut -f2 -d"=") \
            -d $(cat .env | grep POSTGRES_DB= | cut -f2 -d"=") \
            -U $(cat .env | grep POSTGRES_USER= | cut -f2 -d"="))
        val1=$(echo $val| tr ' ' '\n' | tail -4 | tr '\n' ' ' | cut -f 1 -d ' ')
        val2=$(echo $val| tr ' ' '\n' | tail -10 | tr '\n' ' ' | cut -f 3 -d ' ')
        res=$(echo "$val1+$val2" | bc)
        echo $res >> ./res_test_db_index.txt 

    done
done
