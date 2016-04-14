<?php

namespace Ps2alerts\Frontend\Controller;

use Ps2alerts\Frontend\Contract\ConfigAwareInterface;
use Ps2alerts\Frontend\Contract\ConfigAwareTrait;
use Ps2alerts\Frontend\Contract\EmitterAwareInterface;
use Ps2alerts\Frontend\Contract\EmitterAwareTrait;
use Ps2alerts\Frontend\Contract\TemplateAwareInterface;
use Ps2alerts\Frontend\Contract\TemplateAwareTrait;
use Zend\Diactoros\ServerRequest;
use Zend\Diactoros\Response;

class MainController implements ConfigAwareInterface, EmitterAwareInterface, TemplateAwareInterface
{
    use ConfigAwareTrait;
    use EmitterAwareTrait;
    use TemplateAwareTrait;

    public function landing(ServerRequest $request)
    {
        var_dump('CONFIG SHOULD WORK HERE');
        var_dump($this);
        var_dump($this->getConfig());die;
        return $this->getEmitterDriver()->emit('render.template', [
            'title' => 'Test',
            'code'  => 200
        ]);
    }
}
