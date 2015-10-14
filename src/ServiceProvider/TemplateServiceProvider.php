<?php

namespace Ps2alerts\Website\ServiceProvider;

use League\Container\ServiceProvider;
use Twig_Loader_Filesystem;
use Twig_Environment;
use Twig_Extension_Debug;
use Twig_SimpleFilter;
use Cocur\Slugify\Bridge\Twig\SlugifyExtension;
use Cocur\Slugify\Slugify;

class TemplateServiceProvider extends ServiceProvider
{
    /**
     * @var array
     */
    protected $provides = [
        'Twig_Environment'
    ];

    /**
     * Register function required by ServiceProvider contract
     */
    public function register()
    {
        $config = $this->getContainer()->get('config');
        $globals = [
            'base_url'  => $config['base_url'],
            'asset_url' => $config['base_url'] . '/assets',
            'env'       => $config['environment']
        ];

        // Register the singleton with the container
        $this->getContainer()->singleton('Twig_Environment', function () use ($globals, $config) {

            $cache = false;
            $debug = true;

            if ($config['environment'] === "production" || $config['environment'] === "staging") {
                $cache = __DIR__ .'/../../cache';
                $debug = false;
            }

            $loader = new Twig_Loader_Filesystem(__DIR__ . '/../../Template');
            $twig   = new Twig_Environment($loader, [
                'cache' => $cache,
                'debug' => $debug
            ]);

            // Add Globals
            foreach($globals as $key => $val) {
                $twig->addGlobal($key, $val);
            }

            // Add session flashes into twig global
            $flashes = $this->getContainer()->get('Symfony\Component\HttpFoundation\Session\Session')->getFlashBag();

            foreach($flashes as $type => $messages) {
                $twig->addGlobal($type, $messages);
            }

            // Add extensions
            if ($debug === true) {
                $twig->addExtension(new Twig_Extension_Debug);
            }
            $twig->addExtension(new SlugifyExtension(Slugify::create(null, array('lowercase' => false))));

            return $twig;
        });
    }
}
