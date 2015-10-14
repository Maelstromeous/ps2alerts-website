<?php

namespace Ps2alerts\Website\Contract;

trait ConfigAwareTrait
{
    /**
     * Holds Config Array
     *
     * @var array
     */
    protected $config;

    /**
     * Sets the Config
     *
     * @param array $config
     */
    public function setConfig(array $config)
    {
        $this->config = $config;
    }

    /**
     * Gets the config
     *
     * @return array
     */
    public function getConfig()
    {
        return $this->config;
    }

    /**
     * Gets the config item from the config array
     *
     * @param  string $key
     * @return string
     */
    public function getConfigItem($key)
    {
        if (array_key_exists($key, $this->config)) {
            return $this->config[$key];
        }
    }
}
