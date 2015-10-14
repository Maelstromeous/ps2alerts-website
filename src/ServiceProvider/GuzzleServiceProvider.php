<?php

namespace Ps2alerts\Website\ServiceProvider;

use League\Container\ServiceProvider;
use GuzzleHttp\Client as Guzzle;

class EventServiceProvider extends ServiceProvider
{
    /**
     * @var array
     */
    protected $provides = [
        'GuzzleHttp\Client'
    ];

    /**
     * {@inheritdoc}
     */
    public function register()
    {
        $this->getContainer()->singleton('GuzzleHttp\Client', function () {
            return new Guzzle([
                'base_uri' => 'http://api.ps2alerts.com',
                'timeout'  => 5.0
            ]);
        });
    }
}
