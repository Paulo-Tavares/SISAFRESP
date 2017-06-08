<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$servername = 'localhost:3306';
$username = 'root';
$password = '';
$dbname = 'arduinojava';

//CONEXÃO
$conn = new mysqli($servername, $username, $password, $dbname) or die ("Falha na conexão" . $conn->connect_error);


//PESQUISA E RETORNO
$result = $conn->query("SELECT * FROM `respiracao`");
$outp = array();
while($row = mysqli_fetch_assoc($result)) {
	$outp[] = $row;
}

//ENCERRAMENTO E RETORNO
$conn->close();
echo(json_encode($outp));
?>