<?php

namespace Ps2alerts\Website\Event;

use Ps2alerts\Website\Contract\ConfigAwareInterface;
use Ps2alerts\Website\Contract\ConfigAwareTrait;
use League\Container\ContainerAwareInterface;
use League\Container\ContainerAwareTrait;
use League\Event\AbstractListener;
use League\Event\EventInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;

class RedirectResponseListener extends AbstractListener implements ConfigAwareInterface, ContainerAwareInterface
{
    use ConfigAwareTrait;
    use ContainerAwareTrait;

    /**
     * Sets Flash data
     *
     * @param  \League\Event\EventInterface                       $event
     * @param  array                                              $args
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function handle(EventInterface $event, array $args = [])
    {
        $eventInstance = $this->getContainer()->get('League\Event\Emitter');

        // Set any session flash messages if required
        $eventInstance->emit('flash.listener', $args['messages']);

        // Get the base URL from the config array and append the requested redirect
        $redirect = $this->getConfigItem('base_url') . $args['redirect'];

        return (new RedirectResponse($redirect))->send();
    }
}
