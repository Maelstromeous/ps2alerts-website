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
            'asset_url' => $config['asset_url'],
            'api_url'   => $config['api_url'],
            'env'       => $config['environment'],
            'servers'   => [1,10,13,17,25,1000,2000],
            'zones'     => [2,4,6,8],
            'zoneNames' => [
                2 => 'indar',
                4 => 'hossin',
                6 => 'amerish',
                8 => 'esamir'
            ],
            'serverNames' => [
                1    => 'Connery',
                10   => 'Miller',
                13   => 'Cobalt',
                17   => 'Emerald',
                19   => 'Jaeger',
                25   => 'Briggs',
                1000 => 'Genudine',
                1001 => 'Palos',
                1002 => 'Crux',
                1003 => 'Searhus',
                2000 => 'Ceres',
                2001 => 'Lithcorp',
                2002 => 'Rashnu'
            ],
            'factions' => ['vs','nc','tr','draw']
        ];

        // Register the singleton with the container
        $this->getContainer()->singleton('Twig_Environment', function () use ($globals, $config) {

            $cache = false;
            $debug = true;

            if ($config['environment'] === "production" || $config['environment'] === "staging") {
                $cache = __DIR__ .'/../../cache';
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

            // Add session flashes into twig global
            $flashes = $this->getContainer()->get('Symfony\Component\HttpFoundation\Session\Session')->getFlashBag();

            foreach ($flashes as $type => $messages) {
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
