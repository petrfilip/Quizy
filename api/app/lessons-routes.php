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

        function seededShuffle(array &$array, $seed) {
            mt_srand($seed);
            $size = count($array);
            for ($i = 0; $i < $size; ++$i) {
                list($chunk) = array_splice($array, mt_rand(0, $size-1), 1);
                array_push($array, $chunk);
            }
        }

        $group->get('/{slug}/exam', function (Request $request, Response $response, $args) {
            $data = LessonRepository::getBySlug($args["slug"]);

            $unfinished = ExamRepository::findUnfinishedExamByUser("LESSONS", intval($data["_id"]), intval($request->getAttribute("userId")));

            if (empty($unfinished)) {
                $exam = new stdClass();
                $exam->startedAt = Utils::getCurrentDateTime();
                $exam->finishedAt = null;
                $exam->userId = $request->getAttribute("userId");
                $exam->type = "LESSONS";
                $exam->examId = $data["_id"];
                $exam->examTitle = $data["title"];
                $exam->examSlug = $data["slug"];
                $unfinished = ExamRepository::insertOrUpdate($exam);
            }

            $questions = $data["questions"];
            seededShuffle($questions, $unfinished["_id"]);
            $out = array();
            $out["metadata"] = $unfinished;
            $out["questions"] = $questions;

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write(json_encode($out));
            return $response;
        })->addMiddleware(new JwtMiddleware());

        $group->post('/{slug}/exam', function (Request $request, Response $response, $args) {
            $finishedExam = $request->getParsedBody();
            $userAnswers = $finishedExam["answers"];

            $lesson = LessonRepository::getBySlug($args["slug"]);
            $unfinished = ExamRepository::findUnfinishedExamByUser("LESSONS", intval($lesson["_id"]), intval($request->getAttribute("userId")));

            $score = 0;

            $questions = $lesson["questions"];
            seededShuffle($questions, $unfinished["_id"]);

            for ($i = 0; $i <= sizeOf($questions) - 1; $i++) {
                /**
                 * pick one
                 */
                if ($questions[$i]["questionType"] === "pickOne") {
                    if ($questions[$i]["correct"] == $userAnswers[$i]["answer"]["index"]) {
                        $score++;
                        continue;
                    }
                }

                /**
                 * pick multiple
                 */
                if ($questions[$i]["questionType"] === "pickMultiple") {
                    $normalizedArray = array();
                    for ($ni = 0; $ni <= sizeOf($userAnswers[$i]["answer"]) - 1; $ni++) {
                        array_push($normalizedArray, $userAnswers[$i]["answer"][$ni]["checkedItem"]["index"]);
                    }

                    $normalizedArray = array_values($normalizedArray);
                    if ($questions[$i]["correct"] == $normalizedArray) {
                        $score++;
                        continue;
                    }
                }

                /**
                 * fill text exactly
                 */
                if ($questions[$i]["questionType"] === "fillTextExactly") {
                    if ($questions[$i]["correct"] === $userAnswers[$i]["answer"]) {
                        $score++;
                        continue;
                    }
                }
            }


            $unfinished = ExamRepository::findUnfinishedExamByUser("LESSONS", intval($lesson["_id"]), intval($request->getAttribute("userId")));
            $unfinished["score"] = $score;
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
            $userId = $request->getAttribute("userId");
            $inserted = LessonRepository::insertOrUpdateVersionedRecord($dataToInsert, $userId);
            $payload = json_encode($inserted);

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write($payload);
            return $response;
        })->addMiddleware(new JwtMiddleware());
    });
};