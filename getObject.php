<?php
   # $factoryID = $_GET['object']; вместо этого следующее
    $factoryID = filter_input(INPUT_GET, 'object', FILTER_SANITIZE_NUMBER_INT);
    $dbname = 'test'; # название базы MySQL для записи данных с карты
    $user = "root"; # пользователь MySQL с правами записи в базу данных $dbname
    $pass = ""; # пароль пользователя MySQL
    
    
    
    $link = mysqli_connect("localhost", $user, $password, $dbname) or die ("Error ".mysqli_error($link));
    $query = "SELECT * FROM `objects` WHERE id=$factoryID";
    $result = mysqli_query($link, $query) or die ("error " . mysqli_error($link));
    $res = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $res[factory] = $row;
    }

    $resultJSON = json_encode($res);
    echo($resultJSON);
    
    mysqli_close($link);
