<?php

use League\Container\Container;
use League\Container\ContainerInterface;
use League\Route\RouteCollection;

// Load the route collection. If container is not ready, generate one here now.
$route = new RouteCollection(
    (isset($container) && $container instanceof ContainerInterface) ? $container : new Container
);

/**
 * Routes
 */
$route->get('/', 'Ps2alerts\Website\Controller\MainController::index');
$route->get('/alert-history', 'Ps2alerts\Website\Controller\MainController::alertHistory');


/**
 * Return the dispatcher to the app loader
 */
return $route->getDispatcher();
