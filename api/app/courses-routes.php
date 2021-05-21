<?php
declare(strict_types=1);

use App\CourseRepository;
use App\LessonRepository;
use App\Middleware\JwtMiddleware;
use App\Middleware\RoleMiddleware;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

return function (App $app) {

    $app->group('/courses', function (Group $group) {

        $group->get('', function (Request $request, Response $response, $args) {
            $data = CourseRepository::findAll();
            $payload = json_encode($data);

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write($payload);
            return $response;
        });

        $group->get('/{slug}', function (Request $request, Response $response, $args) {
            $course = CourseRepository::getBySlug($args["slug"]);
            $lessonList = LessonRepository::getByIdList($course["lessonList"]);

            $trimmedLessonList = array(); //todo improve
            for ($i = 0; $i <= sizeof($lessonList)-1; $i++) {
                $trimmedLessonList[$i]["slug"] = $lessonList[$i]["slug"];
                $trimmedLessonList[$i]["title"] = $lessonList[$i]["title"];
                $trimmedLessonList[$i]["_id"] = $lessonList[$i]["_id"];
                $trimmedLessonList[$i]["heroImage"] = $lessonList[$i]["heroImage"];
            }
            $course["lessonList"] = $trimmedLessonList;

            $payload = json_encode($course);
            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write($payload);
            return $response;
        });

        $group->delete('/{id}', function (Request $request, Response $response, $args) {
            $data = CourseRepository::deleteById($args["id"]); // add deleteAt
            $payload = json_encode($data);

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write($payload);
            return $response;
        })->addMiddleware(new JwtMiddleware())->addMiddleware(new RoleMiddleware("ADMIN"));

        $group->post('', function (Request $request, Response $response, $args) {
            $dataToInsert = $request->getParsedBody();
            $inserted = CourseRepository::insertOrUpdate($dataToInsert);
            $payload = json_encode($inserted);

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write($payload);
            return $response;
        })->addMiddleware(new JwtMiddleware())->addMiddleware(new RoleMiddleware("ADMIN"));
    });
};