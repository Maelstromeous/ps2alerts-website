<?php

include __DIR__ . '/../vendor/autoload.php';

use League\Container\Container;
use League\Route\RouteCollection;
use Psr\Http\Message\ResponseInterface;

// ENV loading
josegonzalez\Dotenv\Loader::load([
    'filepath' => __DIR__ . '/../.env',
    'toEnv'    => true
]);

/** @var Container $container */
$container = include __DIR__ . '/../src/container.php';

/** @var RouteCollection $router */
$router = include __DIR__ . '/../src/routes.php';

/** @var ResponseInterface $response */
$response = $router->dispatch(
    $container->get('Zend\Diactoros\ServerRequest'),
    $container->get('Zend\Diactoros\Response')
);

// Send the response to the client
return $container->get('Zend\Diactoros\Response\SapiEmitter')->emit($response);
