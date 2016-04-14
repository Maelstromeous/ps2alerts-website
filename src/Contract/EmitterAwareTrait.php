<?php

namespace Ps2alerts\Frontend\Contract;

use League\Event\Emitter;

trait EmitterAwareTrait
{
    /**
     * @var League\Event\Emitter
     */
    protected $emitter;

    /**
     * Set event Driver
     */
    public function setEmitterDriver(Emitter $emitter)
    {
        $this->emitter = $emitter;
    }

    /**
     * Get the event driver
     */
    public function getEmitterDriver()
    {
        return $this->emitter;
    }
}
