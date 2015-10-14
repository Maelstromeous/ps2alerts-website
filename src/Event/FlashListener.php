<?php

namespace Ps2alerts\Website\Event;

use Ps2alerts\Website\Contract\SessionAwareInterface;
use Ps2alerts\Website\Contract\SessionAwareTrait;
use League\Event\AbstractListener;
use League\Event\EventInterface;

class FlashListener extends AbstractListener implements SessionAwareInterface
{
    use SessionAwareTrait;

    /**
     * Sets Flash data
     *
     * @param  \League\Event\EventInterface $event
     * @param  array                        $args
     * @return void
     */
    public function handle(EventInterface $event, array $args = [])
    {
        foreach ($args as $key => $value) {
            $this->getSessionDriver()->getFlashBag()->set($key, $value);
        }
    }
}
