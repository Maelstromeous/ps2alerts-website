<?php

use Zend\Diactoros\ServerRequestFactory;
use Zend\Diactoros\Response;

$container = new League\Container\Container();

// Set up the PSR-7 objects and register them with the container
$container->share('Zend\Diactoros\ServerRequest', function () {
    return ServerRequestFactory::fromGlobals(
        $_SERVER,
        $_GET,
        $_POST,
        $_COOKIE,
        $_FILES
    );
});

$container->share('Zend\Diactoros\Response', function () {
    return new Response();
});

$container->addServiceProvider('Ps2alerts\Frontend\ServiceProvider\ConfigServiceProvider');
$container->addServiceProvider('Ps2alerts\Frontend\ServiceProvider\EmitterServiceProvider');
$container->addServiceProvider('Ps2alerts\Frontend\ServiceProvider\TemplateServiceProvider');

$container->inflector('Ps2alerts\Frontend\Contract\ConfigAwareInterface')
          ->invokeMethod('setConfig', ['config']);
$container->inflector('Ps2alerts\Frontend\Contract\EmitterAwareInterface')
          ->invokeMethod('setEmitterDriver', ['League\Event\Emitter']);
$container->inflector('Ps2alerts\Frontend\Contract\TemplateAwareInterface')
          ->invokeMethod('setTemplateDriver', ['Twig_Environment']);

return $container;
