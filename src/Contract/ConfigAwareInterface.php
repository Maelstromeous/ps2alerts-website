<?php

namespace Ps2alerts\Website\Contract;

interface ConfigAwareInterface
{
    /**
     * Sets the Config
     *
     * @param array $config
     */
    public function setConfig(array $config);

    /**
     * Gets the config
     *
     * @return array
     */
    public function getConfig();

    /**
     * Gets the config item from the config array
     *
     * @param  string $key Array key to get
     * @return string      Array key content returned
     */
    public function getConfigItem($key);
}
