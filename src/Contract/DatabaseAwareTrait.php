<?php

namespace Ps2alerts\Website\Contract;

use Illuminate\Database\Capsule\Manager as DBDriver;

trait DatabaseAwareTrait
{
    /**
     * @var \Illuminate\Database\Capsule\Manager
     */
    protected $db;

    /**
     * Set the Database driver
     *
     * @param \Illuminate\Database\Capsule\Manager $db
     */
    public function setDatabaseDriver(DBDriver $db)
    {
        $this->db = $db;
    }

    /**
     * Get the Database driver
     *
     * @return \Illuminate\Database\Capsule\Manager
     */
    public function getDatabaseDriver()
    {
        return $this->db;
    }
}
