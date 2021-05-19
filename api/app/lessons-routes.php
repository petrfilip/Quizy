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

        //todo /exam/inProgress -> will cause force test render

        $group->get('/{slug}/exam', function (Request $request, Response $response, $args) {
            $data = LessonRepository::getBySlug($args["slug"]);

            $unfinished = ExamRepository::findUnfinishedExamByUser("LESSON", intval($data["_id"]), intval($request->getAttribute("userId")));

            if (sizeof($unfinished) === 0) {
                $exam = new stdClass();
                $exam->startedAt = Utils::getCurrentDateTime();
                $exam->finishedAt = null;
                $exam->userId = $request->getAttribute("userId");
                $exam->type = "LESSON";
                $exam->examId = $data["_id"];
                $exam->examTitle = $data["title"];
                $unfinished = ExamRepository::insertOrUpdate($exam);


            }

            $out = array();
            $out["questions"] = $data["questions"];
            $out["metadata"] = $unfinished;

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write(json_encode($out)); //todo return randomly generated questions
            return $response;
        })->addMiddleware(new JwtMiddleware());

        $group->post('/{slug}/exam', function (Request $request, Response $response, $args) {
            $data = LessonRepository::getBySlug($args["slug"]);


            $unfinished = ExamRepository::findUnfinishedExamByUser("LESSON", intval($data["_id"]), intval($request->getAttribute("userId")));
            $unfinished["score"] = 0;
            $unfinished["finishedAt"] = Utils::getCurrentDateTime();
            $unfinished = ExamRepository::insertOrUpdate($unfinished);


            $user = UserRepository::getById($request->getAttribute("userId"));


            if (!array_key_exists("achievements", $user)) {
                $user["achievements"] = array();
            }

            if (!array_key_exists("lessonList", $user["achievements"])) {
                $user["achievements"]["lessonList"] = array();
            }


            array_push($user["achievements"]["lessonList"], $unfinished);
            UserRepository::insertOrUpdate($user);


            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write(json_encode($unfinished));
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