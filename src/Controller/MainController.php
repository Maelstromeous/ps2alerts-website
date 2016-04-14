<?php

namespace Ps2alerts\Frontend\Controller;

use Ps2alerts\Frontend\Contract\EmitterAwareInterface;
use Ps2alerts\Frontend\Contract\EmitterAwareTrait;
use Ps2alerts\Frontend\Contract\TemplateAwareInterface;
use Ps2alerts\Frontend\Contract\TemplateAwareTrait;
use Zend\Diactoros\ServerRequest;
use Zend\Diactoros\Response;

class MainController implements EmitterAwareInterface, TemplateAwareInterface
{
    use EmitterAwareTrait;
    use TemplateAwareTrait;

    public function landing(ServerRequest $request)
    {
        return $this->getEmitterDriver()->emit('render.template', [
            'title' => 'Test',
            'code'  => 200
        ]);
    }
}
