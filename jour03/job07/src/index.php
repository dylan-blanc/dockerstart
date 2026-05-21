<?php

use PDO;
use PDOException;


if (isset($_GET['phpinfo'])) {
    phpinfo();
    exit;
}

header('Content-Type: text/html; charset=utf-8');


$dbHost = 'db';
$dbPort = 3306;
$dbName = 'lamp_demo';
$dbUser = 'dev';
$dbPassword = 'etsonmotdepasse';

function connectToDatabase(string $host, int $port, string $database, string $user, string $password): PDO
{
    $dsn = "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4";

    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    return new PDO($dsn, $user, $password, $options);
}

try {
    $pdo = connectToDatabase($dbHost, $dbPort, $dbName, $dbUser, $dbPassword);
    $pdo->query('SELECT 1');

    echo '<p style="color: green; text-align: center; font-size: 24px;">Connexion réussie</p>';
} catch (PDOException $e) {
    $safeMessage = htmlspecialchars($e->getMessage(), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    echo '<p style="color: red; text-align: center; font-size: 24px;">Connexion échouée</p>';
    echo '<p style="color: red; text-align: center;">' . $safeMessage . '</p>';
}

echo '<form method="get" style="margin-top:10px; align-items:center; display:flex; flex-direction:column;">'
    . '<button type="submit" name="phpinfo" value="1">phpinfo</button>'
    . '</form>';
