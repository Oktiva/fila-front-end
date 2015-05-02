<?php 
header("Access-Control-Allow-Origin: *");
function generateRandomString($length = 1) {
    $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    $randomString .= rand(100, 999);
    $randomString .= " ";
    $randomString .= rand(10, 99);
    return $randomString;
}

if(rand(0, 3) == 3){
    echo '{"senha" : "'.generateRandomString().'"}';    
}else{
    header("HTTP/1.0 404 Not Found");
}


?>