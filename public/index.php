<?php

include __DIR__ . '/../vendor/autoload.php';

use League\Route\Http\Exception\NotFoundException;

// ENV loading
josegonzalez\Dotenv\Loader::load([
    'filepath' => __DIR__ . '/../.env',
    'toEnv'    => true
]);

// Container
$container = include __DIR__ . '/../src/container.php';

// Events
$events = include __DIR__ . '/../src/events.php';

// Routes
$router = include __DIR__ . '/../src/routes.php';

// FIRE!!!
try {
    $response = $router->dispatch(
        $container->get('Symfony\Component\HttpFoundation\Request')->getMethod(),
        $container->get('Symfony\Component\HttpFoundation\Request')->getPathInfo()
    );
} catch (NotFoundException $e) {
    $response = $container->get('Symfony\Component\HttpFoundation\Response');

    $response->setContent(
        $container->get('Twig_Environment')->render('404.html')
    );
}

$response->send();
