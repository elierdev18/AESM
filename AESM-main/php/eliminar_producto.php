<?php
// habilitar errores para desarrollo
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

// Datos de conexión a la base de datos
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';  // Actualiza si es necesario
$db_name = 'maquinas_ibague';

// Conecta a la base de datos
$conexion = new mysqli($db_host, $db_user, $db_pass, $db_name);
if ($conexion->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error de conexión a la BD: " . $conexion->connect_error
    ]);
    exit;
}
$conexion->set_charset("utf8");

// Leer el JSON enviado en la solicitud
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "No se proporcionó un JSON válido."
    ]);
    exit;
}

// Validar que se haya recibido el campo 'producto_id'
if (!isset($input['producto_id']) || !filter_var($input['producto_id'], FILTER_VALIDATE_INT)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "ID de producto no válido o ausente."
    ]);
    exit;
}
$producto_id = intval($input['producto_id']);

// Preparar y ejecutar la consulta para eliminar el producto
$query = "DELETE FROM productos WHERE producto_id = ?";
$stmt = $conexion->prepare($query);
if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error preparando la consulta: " . $conexion->error
    ]);
    exit;
}
$stmt->bind_param("i", $producto_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Producto eliminado correctamente."
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "error" => "Producto no encontrado o no se pudo eliminar."
        ]);
    }
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error al eliminar el producto: " . $stmt->error
    ]);
}

$stmt->close();
$conexion->close();
?>
