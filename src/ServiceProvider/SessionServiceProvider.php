<?php

namespace Ps2alerts\Website\ServiceProvider;

use League\Container\ServiceProvider;
use Symfony\Component\HttpFoundation\Session\Session as SessionDriver;

class SessionServiceProvider extends ServiceProvider
{
    /**
     * @var array
     */
    protected $provides = [
        'Symfony\Component\HttpFoundation\Session\Session'
    ];

    /**
     * {@inheritdoc}
     */
    public function register()
    {
        $this->getContainer()->singleton('Symfony\Component\HttpFoundation\Session\Session', function () {
            return new SessionDriver();
        });
    }
}
