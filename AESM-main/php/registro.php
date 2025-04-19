<?php
// Habilitar errores para facilitar el desarrollo
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");

// Datos de conexión a la base de datos
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';  // Actualiza según corresponda
$db_name = 'maquinas_ibague';

$conexion = new mysqli($db_host, $db_user, $db_pass, $db_name);
if ($conexion->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Error de conexión: " . $conexion->connect_error]);
    exit;
}
$conexion->set_charset("utf8");

// Leer el cuerpo de la petición y decodificar el JSON
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "No se proporcionó un JSON válido."]);
    exit;
}

// Validar que se reciban 'nombre', 'email' y 'password'
if (
    !isset($input['nombre']) || trim($input['nombre']) === '' ||
    !isset($input['email']) || trim($input['email']) === '' ||
    !isset($input['password']) || trim($input['password']) === ''
) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Datos incompletos o inválidos."]);
    exit;
}

$nombre   = trim($conexion->real_escape_string($input['nombre']));
$email    = trim($conexion->real_escape_string($input['email']));
$password = trim($input['password']); // No es necesario escapar antes del hash

// Verificar si el correo ya existe
$query_check = "SELECT usuario_id FROM usuarios WHERE email = ?";
$stmt_check = $conexion->prepare($query_check);
$stmt_check->bind_param("s", $email);
$stmt_check->execute();
$result_check = $stmt_check->get_result();
if ($result_check->num_rows > 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "El correo ya está registrado."]);
    $stmt_check->close();
    $conexion->close();
    exit;
}
$stmt_check->close();

// Crear hash de la contraseña
$hash = password_hash($password, PASSWORD_DEFAULT);

// Para la tabla 'usuarios' se requieren los campos 'nombres' y 'apellidos'. Usaremos el valor ingresado completo en 'nombres' y dejaremos 'apellidos' vacío.
$apellidos = "";

// Preparar la consulta de inserción
$query_insert = "INSERT INTO usuarios (nombres, apellidos, email, contrasena_hash) VALUES (?, ?, ?, ?)";
$stmt_insert = $conexion->prepare($query_insert);
if (!$stmt_insert) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Error preparando la consulta: " . $conexion->error]);
    exit;
}
$stmt_insert->bind_param("ssss", $nombre, $apellidos, $email, $hash);

if ($stmt_insert->execute()) {
    echo json_encode(["success" => true, "message" => "Usuario registrado correctamente."]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Error al registrar el usuario: " . $stmt_insert->error]);
}
$stmt_insert->close();
$conexion->close();
?>
