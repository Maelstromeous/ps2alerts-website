<?php

namespace Ps2alerts\Frontend\ServiceProvider;

use League\Container\ServiceProvider\AbstractServiceProvider;
use League\Event\Emitter;

class EmitterServiceProvider extends AbstractServiceProvider
{
    /**
     * @var array
     */
    protected $provides = [
        'League\Event\Emitter'
    ];

    /**
     * {@inheritdoc}
     */
    public function register()
    {
        $this->getContainer()->share('League\Event\Emitter', function () {
            $emitter = new Emitter();

            $emitter->addListener('render.template', function ($event, $args) {
                echo "Event";
                $response = $this->getContainer()->get('Zend\Diactoros\Response');

                var_dump('RESPONSE', $response);

                $response->getBody()->write(
                    'Hello world!'
                );
            });

            var_dump($emitter);die;

            return $emitter;
        });
    }
}
