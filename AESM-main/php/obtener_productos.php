<?php
// obtener_productos.php

// --- Configuración de la Base de Datos ---
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'maquinas_ibague';

// --- Conexión a la Base de Datos usando MySQLi ---
$conexion = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conexion->connect_error) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión a la base de datos: ' . $conexion->connect_error]);
    exit;
}

$conexion->set_charset("utf8");

// --- Consulta SQL para obtener los productos ---
// Ahora, seleccionamos también los campos `descripcion` y `url_imagen`.
$sql = "SELECT p.producto_id, p.nombre, p.descripcion, p.precio, p.url_imagen, m.nombre AS nombre_marca
        FROM productos p
        JOIN marcas m ON p.marca_id = m.marca_id
        WHERE p.esta_activo = TRUE
        ORDER BY p.nombre ASC";

$resultado = $conexion->query($sql);

$productos_array = [];

if ($resultado) {
    if ($resultado->num_rows > 0) {
        while ($fila = $resultado->fetch_assoc()) {
            $productos_array[] = $fila;
        }
    }
    $resultado->free();
} else {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['error' => 'Error al ejecutar la consulta: ' . $conexion->error]);
    $conexion->close();
    exit;
}

$conexion->close();

header('Content-Type: application/json');
echo json_encode($productos_array);
?>
