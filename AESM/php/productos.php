<?php
$db = new SQLite3('basededatos.sqlite');

$result = $db->query('SELECT * FROM productos');

$productos = [];

while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
    $productos[] = $row;
}

header('Content-Type: application/json');
echo json_encode($productos);
?>


<?php
try {
    $conexion = new PDO("sqlite:../db/tienda.db"); // Asegúrate que la ruta es correcta
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT * FROM productos";
    $stmt = $conexion->prepare($sql);
    $stmt->execute();
    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    echo "Error en la conexión: " . $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Productos</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <h1>Productos</h1>
    <div class="productos">
        <?php foreach ($productos as $producto): ?>
            <div class="producto">
                <img src="../img/<?php echo htmlspecialchars($producto['imagen']); ?>" alt="<?php echo htmlspecialchars($producto['nombre']); ?>">
                <h3><?php echo htmlspecialchars($producto['nombre']); ?></h3>
                <p><?php echo htmlspecialchars($producto['descripcion']); ?></p>
            </div>
        <?php endforeach; ?>
    </div>
</body>
</html>
