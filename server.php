<?php

if(isset($_POST["empty"])){
    file_put_contents("./data.json", json_encode("empty"));
}
else if(isset($_POST["items"])){
    $items = [];
    for($i = 0; $i < count($_POST["items"]); $i++)
        array_push($items, $_POST["items"][$i]);

    $jsonString = "{\"items\": ";
    $jsonString .= json_encode($items);
    $jsonString .= "}"; 
    file_put_contents("./data.json", $jsonString);
}
else{
    $file = file_get_contents("./data.json");
    echo $file;
}
