<?php

include __DIR__ . '/../vendor/autoload.php';

// ENV loading
josegonzalez\Dotenv\Loader::load([
    'filepath' => __DIR__ . '/../.env',
    'toEnv'    => true
]);

$container = require __DIR__ . '/../src/container.php';

$router = require __DIR__ . '/../src/routes.php';

// Rewrite REQUEST_URI path so it matches exactly the routes
$config = $container->get('config');

if ($config['environment'] === 'development') {
    $_SERVER['REQUEST_URI']  = str_replace('/ps2alerts/public', '', $_SERVER['REQUEST_URI']);
    $_SERVER['REDIRECT_URL'] = str_replace('/ps2alerts/public', '', $_SERVER['REDIRECT_URL']);
}

$router->dispatch(
    $container->get('Zend\Diactoros\ServerRequest'),
    $container->get('Zend\Diactoros\Response')
);
