<?php

use Psr\Container\ContainerInterface;
use Slim\App;
use Slim\Factory\AppFactory;
use Slim\Middleware\ErrorMiddleware;
use Psr\Http\Message\ResponseFactoryInterface;

return [
    ResponseFactoryInterface::class => function (ContainerInterface $container) {
        return $container->get(App::class)->getResponseFactory();
    },

    App::class => function (ContainerInterface $container) {
        AppFactory::setContainer($container);
        return AppFactory::create();
    },

//
//    ErrorMiddleware::class => function (ContainerInterface $container) {
//        $app = $container->get(App::class);
//
//        return new ErrorMiddleware(
//            $app->getCallableResolver(),
//            $app->getResponseFactory(),
//            true,
//            true,
//            true
//        );
//    },


];