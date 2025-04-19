<?php
// obtener_productos.php

// --- Configuración de la Base de Datos ---
// !! IMPORTANTE: En una aplicación real, NUNCA pongas las credenciales directamente aquí.
// Usa variables de entorno o un archivo de configuración fuera del directorio web.
$db_host = 'localhost'; // O la IP/host de tu servidor de BD
$db_user = 'root'; // Reemplaza con tu usuario de la BD
$db_pass = ''; // Reemplaza con tu contraseña
$db_name = 'maquinas_ibague'; // Reemplaza con el nombre de tu BD (donde están las tablas)

// --- Conexión a la Base de Datos usando MySQLi ---
$conexion = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Verificar conexión
if ($conexion->connect_error) {
    // Enviar una respuesta de error en JSON
    header('Content-Type: application/json');
    http_response_code(500); // Error interno del servidor
    echo json_encode(['error' => 'Error de conexión a la base de datos: ' . $conexion->connect_error]);
    exit; // Detener la ejecución del script
}

// Establecer la codificación a UTF-8 (recomendado para caracteres en español)
$conexion->set_charset("utf8");

// --- Consulta SQL para obtener los productos ---
// Seleccionamos campos necesarios y unimos con 'marcas' para obtener el nombre de la marca
$sql = "SELECT p.producto_id, p.nombre, p.precio, m.nombre as nombre_marca
        FROM productos p
        JOIN marcas m ON p.marca_id = m.marca_id
        WHERE p.esta_activo = TRUE
        ORDER BY p.nombre ASC";

$resultado = $conexion->query($sql);

// --- Procesar Resultados ---
$productos_array = [];

if ($resultado) {
    if ($resultado->num_rows > 0) {
        // Obtener todas las filas como un array asociativo
        while ($fila = $resultado->fetch_assoc()) {
            $productos_array[] = $fila;
        }
    }
    // Liberar el conjunto de resultados
    $resultado->free();
} else {
    // Error en la consulta
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['error' => 'Error al ejecutar la consulta: ' . $conexion->error]);
    $conexion->close();
    exit;
}

// --- Cerrar Conexión ---
$conexion->close();

// --- Enviar Respuesta JSON ---
header('Content-Type: application/json');
echo json_encode($productos_array);

?>