<?php

namespace Ps2alerts\Website\ServiceProvider;

use League\Container\ServiceProvider;

class ConfigServiceProvider extends ServiceProvider
{
    /**
     * @var array
     */
    protected $provides = [
        'config'
    ];

    /**
     * {@inheritdoc}
     */
    public function register()
    {
        $this->getContainer()->singleton('config', function () {
            return include __DIR__ . '/../../config/config.php';
        });
    }
}
