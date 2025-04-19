<?php
// Habilitar la visualización de errores (solo en desarrollo)
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

// Datos de conexión a la base de datos
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';  // Actualiza si es necesario
$db_name = 'maquinas_ibague';

// Conexión a la base de datos
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

// Leer el cuerpo de la petición y decodificar el JSON
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode([
        "success" => false, 
        "error" => "No se proporcionó un JSON válido."
    ]);
    exit;
}

// Validar los campos requeridos: nombre, precio, descripcion, marca_id y categoria_nombre
if (
    !isset($input['nombre']) || trim($input['nombre']) === '' ||
    !isset($input['precio']) || !is_numeric($input['precio']) || floatval($input['precio']) <= 0 ||
    !isset($input['descripcion']) || trim($input['descripcion']) === '' ||
    !isset($input['marca_id']) || !filter_var($input['marca_id'], FILTER_VALIDATE_INT) ||
    !isset($input['categoria_nombre']) || trim($input['categoria_nombre']) === ''
) {
    http_response_code(400);
    echo json_encode([
        "success" => false, 
        "error" => "Datos incompletos o inválidos."
    ]);
    exit;
}

// Saneamiento de datos
$nombre           = trim($conexion->real_escape_string($input['nombre']));
$descripcion      = trim($conexion->real_escape_string($input['descripcion']));
$precio           = floatval($input['precio']);
$url_imagen       = isset($input['url_imagen']) ? trim($conexion->real_escape_string($input['url_imagen'])) : "";
$cantidad_stock   = 0; // Stock inicial por defecto
$marca_id         = intval($input['marca_id']);
$categoria_nombre = trim($conexion->real_escape_string($input['categoria_nombre']));

// Consultar el ID de la categoría en la tabla 'categorias'
$queryCategoria = "SELECT categoria_id FROM categorias WHERE nombre = ? LIMIT 1";
$stmtCat = $conexion->prepare($queryCategoria);
if (!$stmtCat) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "error" => "Error preparando consulta de categoría: " . $conexion->error
    ]);
    exit;
}
$stmtCat->bind_param("s", $categoria_nombre);
$stmtCat->execute();
$resultCat = $stmtCat->get_result();
if ($row = $resultCat->fetch_assoc()) {
    $categoria_id = $row['categoria_id'];
} else {
    http_response_code(400);
    echo json_encode([
        "success" => false, 
        "error" => "La categoría '$categoria_nombre' no fue encontrada."
    ]);
    $stmtCat->close();
    $conexion->close();
    exit;
}
$stmtCat->close();

// Preparar la consulta de inserción en la tabla 'productos'
// Se insertan: nombre, descripcion, precio, url_imagen, cantidad_stock, marca_id, categoria_id y se marca 'esta_activo' como TRUE.
$queryInsert = "INSERT INTO productos (nombre, descripcion, precio, url_imagen, cantidad_stock, marca_id, categoria_id, esta_activo)
                VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)";
$stmtInsert = $conexion->prepare($queryInsert);
if (!$stmtInsert) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "error" => "Error preparando consulta de inserción: " . $conexion->error
    ]);
    exit;
}

// La cadena de tipos es: s (nombre), s (descripcion), d (precio), s (url_imagen), i (cantidad_stock), i (marca_id), i (categoria_id)
$stmtInsert->bind_param("ssdsiii", $nombre, $descripcion, $precio, $url_imagen, $cantidad_stock, $marca_id, $categoria_id);

if ($stmtInsert->execute()) {
    echo json_encode([
        "success" => true, 
        "message" => "Producto añadido correctamente."
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "error" => "Error al guardar el producto: " . $stmtInsert->error
    ]);
}
$stmtInsert->close();
$conexion->close();
?>
