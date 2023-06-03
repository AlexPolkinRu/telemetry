<?php
// В этом файле определяем
// $connection_string для подключения к PostgreSQL
include 'secret.php';

$dbconn = pg_connect($connection_string);

// Все записи в БД за сегодня
$query_params = "select to_char(time, 'HH24:MI') as time, temp, hum 
from sensors 
where date(time) = date(now());";

$result = pg_query($dbconn, $query_params);

echo json_encode(pg_fetch_all($result, PGSQL_ASSOC));
pg_close($dbconn);
?>