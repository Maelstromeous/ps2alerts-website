<?php

namespace Ps2alerts\Website\ServiceProvider;

use League\Container\ServiceProvider;
use GuzzleHttp\Client as Guzzle;
use Ps2alerts\Website\Contract\ConfigAwareInterface;
use Ps2alerts\Website\Contract\ConfigAwareTrait;

class GuzzleServiceProvider extends ServiceProvider implements ConfigAwareInterface
{
    use ConfigAwareTrait;

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
                'base_uri' => $this->getConfigItem('api_url'),
                'timeout'  => 5.0
            ]);
        });
    }
}
