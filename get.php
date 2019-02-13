<?php
    $dbname = 'test'; # название базы MySQL для записи данных с карты
    $user = "root"; # пользователь MySQL с правами записи в базу данных $dbname
    $pass = ""; # пароль пользователя MySQL
    
    
    
    $link = mysqli_connect("localhost", $user, $password, $dbname) or die ("Error ".mysqli_error($link));
    $query = "SELECT `id`,`name`,`latitude`,`longitude`,`category` FROM `objects`";
    $result = mysqli_query($link, $query) or die ("error " . mysqli_error($link));
    $res = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $res[] = $row;
    }
    
    $resultJSON = json_encode($res);
    echo($resultJSON);
    
    mysqli_close($link);
     /*       
    try {
        $con = new PDO("mysql:host=localhost;dbname=$dbname", $user, $pass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
        $res = mysqli_query("SELECT * FROM `objects`", $con); //отбор данных
        //$res->execute();
        //$result = $res->fetchAll(PDO::FETCH_ASSOC) or print ("Can't select entries from table.<br>");
        //$resultJSON = json_encode($result);
        while ($row = mysqli_fetch_assoc($res)) {
            print_r($row);
        }
        

        $con = null; #очистка памяти от объектов
    }
    catch (PDOException $e) {
	    print("<font color='red'>Error loading data from MySQL:</font> ".$e->getMessage() . "<br/>");
	    die();
    }
//    echo $resultJSON;
*/
?>