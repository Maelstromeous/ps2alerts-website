<?php

namespace Ps2alerts\Website\ServiceProvider;

use League\Container\ServiceProvider;

class EventServiceProvider extends ServiceProvider
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
        $this->getContainer()->singleton('League\Event\Emitter');
    }
}
