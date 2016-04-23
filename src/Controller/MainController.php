<?php

namespace Ps2alerts\Frontend\Controller;

use Ps2alerts\Frontend\Contract\ConfigAwareInterface;
use Ps2alerts\Frontend\Contract\ConfigAwareTrait;
use Ps2alerts\Frontend\Contract\TemplateAwareInterface;
use Ps2alerts\Frontend\Contract\TemplateAwareTrait;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class MainController implements ConfigAwareInterface, TemplateAwareInterface
{
    use ConfigAwareTrait;
    use TemplateAwareTrait;

    public function landing(ServerRequestInterface $request, ResponseInterface $response)
    {
        $response->getBody()->write(
            $this->getTemplateDriver()->render('landing.html')
        );

        return $response;
    }
}
