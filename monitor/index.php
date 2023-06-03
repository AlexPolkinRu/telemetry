<?php 
  include 'secret.php';

  $postData = file_get_contents('php://input');
  $data = json_decode($postData, true);

  if (
    // Вносим показания в БД
    isset($data["key"]) &&
    isset($data["t"]) &&
    isset($data["h"]) &&
    $data["key"] == $secretKey
  ) {
    echo "температура: " . $data["t"] . "°, влажность: " . $data["h"] . "%";
    $dbconn = pg_connect($connection_string);

if ($dbconn == false){
    print("Ошибка: Невозможно подключиться к PostgreSQL " . pg_last_error());
} else {
    print("Соединение установлено успешно");

    $res = pg_query($dbconn, "INSERT INTO sensors VALUES (now()," . $data["t"] . "," . $data["h"] . ",0);");

    if (!$res) {
        echo "Произошла ошибка.\n";
    }
    pg_close($dbconn);
}
  }
?>