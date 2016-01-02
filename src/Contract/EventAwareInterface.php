<?php

namespace Ps2alerts\Website\Contract;

use League\Event\Emitter;

interface EventAwareInterface
{
    /**
     * Set Event Driver
     *
     * @param \League\Event\Emitter $event
     */
    public function setEventDriver(Emitter $event);

    /**
     * Get Event Driver
     *
     * @return \League\Event\Emitter
     */
    public function getEventDriver();
}
