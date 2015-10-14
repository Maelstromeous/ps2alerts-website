<?php

$container = new League\Container\Container;

// Register the request object singleton to be used later in the request cyncle
$container->singleton('Symfony\Component\HttpFoundation\Request', function() {
    return Symfony\Component\HttpFoundation\Request::createFromGlobals();
});

// Service Providers
$container->addServiceProvider('Ps2alerts\Website\ServiceProvider\ConfigServiceProvider');
$container->addServiceProvider('Ps2alerts\Website\ServiceProvider\DatabaseServiceProvider');
$container->addServiceProvider('Ps2alerts\Website\ServiceProvider\EventServiceProvider');
$container->addServiceProvider('Ps2alerts\Website\ServiceProvider\SessionServiceProvider');
$container->addServiceProvider('Ps2alerts\Website\ServiceProvider\TemplateServiceProvider');

// Inflectors
$container->inflector('Ps2alerts\Website\Contract\ConfigAwareInterface')
          ->invokeMethod('setConfig', ['config']);
$container->inflector('Ps2alerts\Website\Contract\DatabaseAwareInterface')
          ->invokeMethod('setDatabaseDriver', ['Illuminate\Database\Capsule\Manager']);
$container->inflector('Ps2alerts\Website\Contract\EventAwareInterface')
          ->invokeMethod('setEventDriver', ['League\Event\Emitter']);
$container->inflector('Ps2alerts\Website\Contract\SessionAwareInterface')
          ->invokeMethod('setSessionDriver', ['Symfony\Component\HttpFoundation\Session\Session']);
$container->inflector('Ps2alerts\Website\Contract\TemplateAwareInterface')
          ->invokeMethod('setTemplateDriver', ['Twig_Environment']);

// Container Inflector
$container->inflector('League\Container\ContainerAwareInterface')
          ->invokeMethod('setContainer', [$container]);

return $container;
