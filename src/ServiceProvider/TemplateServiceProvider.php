<?php

namespace Ps2alerts\Frontend\ServiceProvider;

use League\Container\ServiceProvider\AbstractServiceProvider;
use Twig_Loader_Filesystem;
use Twig_Environment;
use Twig_Extension_Debug;
use Twig_SimpleFilter;

class TemplateServiceProvider extends AbstractServiceProvider
{
    /**
     * @var array
     */
    protected $provides = [
        'Twig_Environment'
    ];

    public function register()
    {
        $config = $this->getContainer()->get('config');
        $globals = [
            'base_url'  => $config['base_url'],
            'asset_url' => $config['base_url'] . '/assets',
            'env'       => $config['environment']
        ];

        $this->getContainer()->share('Twig_Environment', function () use ($globals, $config) {
            $cache = false;
            $debug = true;

            if ($config['environment'] === "production") {
                $cache = __DIR__ . '/../../cache';
                $debug = false;
            }

            $loader = new Twig_Loader_Filesystem(__DIR__ . '/../../template');
            $twig   = new Twig_Environment($loader, [
                'cache' => $cache,
                'debug' => $debug
            ]);

            // Add Globals
            foreach ($globals as $key => $val) {
                $twig->addGlobal($key, $val);
            }

            // Add extensions
            if ($debug === true) {
                $twig->addExtension(new Twig_Extension_Debug);
            }

            return $twig;
        });
    }
}
