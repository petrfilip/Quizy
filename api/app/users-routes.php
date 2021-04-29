<?php
declare(strict_types=1);

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

return function (App $app) {

    $app->group('/users', function (Group $group) {

        $group->get('', function (Request $request, Response $response) {
            $response->getBody()->write('Hello world - root!');
            return $response;
        });

        $group->get('/{id}', function (Request $request, Response $response) {
            $response->getBody()->write('Hello world! - id');
            return $response;
        });
    });
};