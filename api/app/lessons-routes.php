<?php
declare(strict_types=1);

use App\LessonRepository;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

return function (App $app) {

    $app->group('/lessons', function (Group $group) {

        $group->options('', function (Request $request, Response $response, $args) {
            $response = $response->withHeader('Content-Type', 'application/json');
            return $response;
        });
        $group->options('/{id}', function (Request $request, Response $response, $args) {
            $response = $response->withHeader('Content-Type', 'application/json');
            return $response;
        });

        $group->get('', function (Request $request, Response $response, $args) {
            $data = LessonRepository::findAll();
            $payload = json_encode($data);

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write($payload);
            return $response;
        });

        $group->get('/{slug}', function (Request $request, Response $response, $args) {
            $data = LessonRepository::getBySlug($args["slug"]);
            $payload = json_encode($data);

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write($payload);
            return $response;
        });

        $group->delete('/{id}', function (Request $request, Response $response, $args) {
            $data = LessonRepository::deleteById($args["id"]); // add deleteAt
            $payload = json_encode($data);

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write($payload);
            return $response;
        });

        $group->post('', function (Request $request, Response $response, $args) {
            $dataToInsert = $request->getParsedBody();
            $inserted = LessonRepository::insertOrUpdate($dataToInsert);
            $payload = json_encode($inserted);

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write($payload);
            return $response;
        });//->addMiddleware(new JwtMiddleware());
    });
};