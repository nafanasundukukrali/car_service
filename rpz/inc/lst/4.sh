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
