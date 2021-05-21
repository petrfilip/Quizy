<?php
declare(strict_types=1);

use App\ExamRepository;
use App\LessonRepository;
use App\Middleware\JwtMiddleware;
use App\UserRepository;
use App\Utils;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

return function (App $app) {

    $app->group('/exam', function (Group $group) {

        $group->get('/running', function (Request $request, Response $response, $args) {
            $unfinished = ExamRepository::findUnfinishedExam(intval($request->getAttribute("userId")));
            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write(json_encode($unfinished));
            return $response;
        })->addMiddleware(new JwtMiddleware());

    });
};