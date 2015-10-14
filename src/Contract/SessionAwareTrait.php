<?php

namespace Ps2alerts\Website\Contract;

use Symfony\Component\HttpFoundation\Session\Session as SessionDriver;

trait SessionAwareTrait
{
    /**
     * @var \Symfony\Component\HttpFoundation\Session\Session
     */
    protected $session;

    /**
     * Set the Sesison driver
     *
     * @param \Symfony\Component\HttpFoundation\Session\Session $session
     */
    public function setSessionDriver(SessionDriver $session)
    {
        $this->session = $session;
    }

    /**
     * Get the Sesison driver
     *
     * @return \Symfony\Component\HttpFoundation\Session\Session
     */
    public function getSessionDriver()
    {
        return $this->session;
    }
}
