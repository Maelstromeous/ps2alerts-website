<?php

namespace Ps2alerts\Frontend\Contract;

use League\Event\Emitter;

interface EmitterAwareInterface
{
    /**
     * Set the Emitter driver
     *
     * @param League\Event\Emitter $emitter
     */
    public function setEmitterDriver(Emitter $emitter);

    /**
     * Get the Emitter driver
     *
     * @return League\Event\Emitter
     */
    public function getEmitterDriver();
}
