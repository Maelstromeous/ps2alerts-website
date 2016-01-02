<?php

namespace Ps2alerts\Website\Contract;

use League\Event\Emitter;

trait EventAwareTrait
{
    /**
     * @var \League\Event\Emitter $event
     */
    protected $event;

    /**
     * Set Event Driver
     *
     * @param \League\Event\Emitter $event
     */
    public function setEventDriver(Emitter $event)
    {
        $this->event = $event;
    }

    /**
     * Get Event Driver
     *
     * @return \League\Event\Emitter
     */
    public function getEventDriver()
    {
        return $this->event;
    }
}
