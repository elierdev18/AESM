<?php
$db = new SQLite3('basededatos.sqlite');

$result = $db->query('SELECT * FROM productos');
?>

<div class="productos">
  <?php while ($producto = $result->fetchArray(SQLITE3_ASSOC)) { ?>
    <div class="producto">
      <img src="img/<?php echo $producto['imagen']; ?>" alt="<?php echo $producto['nombre']; ?>">
      <h3><?php echo $producto['nombre']; ?></h3>
      <p><?php echo $producto['descripcion']; ?></p>
    </div>
  <?php } ?>
</div>
