<?php

namespace Ps2alerts\Website\Controller;

use Ps2alerts\Website\Contract\TemplateAwareInterface;
use Ps2alerts\Website\Contract\TemplateAwareTrait;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class MainController implements TemplateAwareInterface
{
    use TemplateAwareTrait;

    /**
     * Homepage
     * @param  \Symfony\Component\HttpFoundation\Request  $request
     * @param  \Symfony\Component\HttpFoundation\Response $response
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index(Request $request, Response $response)
    {
        return $response->setContent(
            $this->getTemplateDriver()->render('home/index.html')
        );
    }
}
