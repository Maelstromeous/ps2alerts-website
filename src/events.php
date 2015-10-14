<?php

use League\Container\Container;
use League\Container\ContainerInterface;

/**
 * Pull in the container
 */
$container = (isset($container) && $container instanceof ContainerInterface) ? $container : new Container;
$event = $container->get('League\Event\Emitter');

/**
 * Set the listeners
 */
$event->addListener('flash.listener', $container->get('Ps2alerts\Website\Event\FlashListener'));
$event->addListener('redirect.response', $container->get('Ps2alerts\Website\Event\RedirectResponseListener'));

return $event;
