<?php

namespace Ps2alerts\Website\Contract;

use Illuminate\Database\Capsule\Manager as DBDriver;

interface DatabaseAwareInterface
{
    /**
     * Set the Database driver
     *
     * @param \Illuminate\Database\Capsule\Manager $db
     */
    public function setDatabaseDriver(DBDriver $db);

    /**
     * Get the Database driver
     *
     * @return \Illuminate\Database\Capsule\Manager
     */
    public function getDatabaseDriver();
}
