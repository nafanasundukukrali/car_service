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
