<?php
declare(strict_types=1);

use App\ExamRepository;
use App\LessonRepository;
use App\Middleware\JwtMiddleware;
use App\Utils;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

return function (App $app) {

    $app->group('/lessons', function (Group $group) {

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

        //todo /{slug}/exam/inProgress

        $group->get('/{slug}/exam', function (Request $request, Response $response, $args) {
            $data = LessonRepository::getBySlug($args["slug"]);
            $payload = json_encode($data["questions"]);


            $unfinished = ExamRepository::findUnfinishedByUser("LESSON", $payload["_id"], $request->getAttribute("userId"));

            if (sizeof($unfinished) === 0) {
                $out = new stdClass();
                $out->startedAt = Utils::getCurrentDateTime();
                $out->finishedAt = null;
                $out->userId = $request->getAttribute("userId");
                $out->type = "LESSON";
                $out->examId = $data["_id"];
                $out->examTitle = $data["title"];
                ExamRepository::insertOrUpdate($out);
            }

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write($payload); //todo return randomly generated questions
            return $response;
        })->addMiddleware(new JwtMiddleware());

        $group->post('/{slug}/exam', function (Request $request, Response $response, $args) {
            $data = LessonRepository::getBySlug($args["slug"]);
            $payload = json_encode($data);

            $unfinished = ExamRepository::findUnfinishedByUser("LESSON", intval($payload["_id"]), $request->getAttribute("userId"));

            $unfinished->finshedAt = Utils::getCurrentDateTime();
            $unfinished->score = 0;
            ExamRepository::insertOrUpdate($unfinished);


            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write("todo evaluate and result");
            return $response;
        })->addMiddleware(new JwtMiddleware());

        //todo exam routes

        $group->delete('/{id}', function (Request $request, Response $response, $args) {
            $data = LessonRepository::deleteById($args["id"]); // add deleteAt
            $payload = json_encode($data);

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write($payload);
            return $response;
        })->addMiddleware(new JwtMiddleware());

        $group->post('', function (Request $request, Response $response, $args) {
            $dataToInsert = $request->getParsedBody();
            $inserted = LessonRepository::insertOrUpdate($dataToInsert);
            $payload = json_encode($inserted);

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write($payload);
            return $response;
        })->addMiddleware(new JwtMiddleware());
    });
};