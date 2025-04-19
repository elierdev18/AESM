<?php
// Habilitar errores para desarrollo
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");

// Datos de conexión
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

// Leer JSON de la petición
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "No se proporcionó un JSON válido."]);
    exit;
}

// Validar que se reciban 'email' y 'password'
if (
    !isset($input['email']) || trim($input['email']) === '' ||
    !isset($input['password']) || trim($input['password']) === ''
) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Datos incompletos o inválidos."]);
    exit;
}

$email    = trim($conexion->real_escape_string($input['email']));
$password = trim($input['password']);

// Buscar el usuario por email
$query = "SELECT usuario_id, contrasena_hash FROM usuarios WHERE email = ? LIMIT 1";
$stmt = $conexion->prepare($query);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Error preparando la consulta: " . $conexion->error]);
    exit;
}
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Credenciales inválidas."]);
    $stmt->close();
    $conexion->close();
    exit;
}

$user = $result->fetch_assoc();
$stmt->close();
$conexion->close();

// Verificar la contraseña
if (password_verify($password, $user['contrasena_hash'])) {
    echo json_encode(["success" => true, "message" => "Inicio de sesión exitoso."]);
} else {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Credenciales inválidas."]);
}
?>
