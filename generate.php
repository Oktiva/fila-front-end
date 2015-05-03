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
    return $randomString;
}

if(rand(0, 1) == 0){
    $strRet = "[";
    for ($i=0; $i < rand(1, 3); $i++) { 
        if($i != 0)
            $strRet .= ",";
        $strRet .= '{"'.generateRandomString().'" : '.rand(10, 99).'}';
    }
    $strRet .= "]";
    echo $strRet;
}else{
    header("HTTP/1.0 404 Not Found");
}


?>