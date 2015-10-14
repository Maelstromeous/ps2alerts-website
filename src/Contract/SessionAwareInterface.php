<?php

namespace Ps2alerts\Website\Contract;

use Symfony\Component\HttpFoundation\Session\Session as SessionDriver;

interface SessionAwareInterface
{
    /**
     * Set the Sesison driver
     *
     * @param \Symfony\Component\HttpFoundation\Session\Session $session
     */
    public function setSessionDriver(SessionDriver $session);

    /**
     * Get the Sesison driver
     *
     * @return \Symfony\Component\HttpFoundation\Session\Session
     */
    public function getSessionDriver();
}
