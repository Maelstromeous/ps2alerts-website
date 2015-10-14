<?php

namespace Ps2alerts\Website\ServiceProvider;

use League\Container\ServiceProvider;
use Illuminate\Database\Capsule\Manager;

class DatabaseServiceProvider extends ServiceProvider
{
    /**
     * @var array
     */
    protected $provides = [
        'Illuminate\Database\Capsule\Manager'
    ];

    /**
     * {@inheritdoc}
     */
    public function register()
    {
        $this->getContainer()->singleton('Illuminate\Database\Capsule\Manager', function () {
            $capsule = new Manager;
            $config = $this->getContainer()->get('config');

            $capsule->addConnection([
                'driver'    => 'mysql',
                'host'      => $config['database']['host'],
                'database'  => $config['database']['schema'],
                'username'  => $config['database']['user'],
                'password'  => $config['database']['password'],
                'charset'   => 'utf8',
                'collation' => 'utf8_unicode_ci',
                'prefix'    => '',
            ]);

            $capsule->setAsGlobal();

            return $capsule;
        });
    }
}
