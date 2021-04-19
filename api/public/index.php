<?php

use App\QuizDao;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use App\DatabaseManager;


require __DIR__ . '/../vendor/autoload.php';
require "./quiz-dao.php";

define("DATABASE_ROOT", __DIR__ . "/../database");

$app = AppFactory::create();


$app->addBodyParsingMiddleware();
$app->addErrorMiddleware(true, true, true);
$app->addRoutingMiddleware();

$app->get('/', function (Request $request, Response $response, $args) {
    $response->getBody()->write("Hello");
    return $response;
});

$app->get('/quiz', function (Request $request, Response $response, $args) {
    $data = QuizDao::findAll();
    $payload = json_encode($data);

    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()->write($payload);
    return $response;
});

$app->get('/quiz/{slug}', function (Request $request, Response $response, $args) {
    $data = QuizDao::getBySlug($args["slug"]);
    $payload = json_encode($data);

    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()->write($payload);
    return $response;
});

$app->post('/quiz', function (Request $request, Response $response, $args) {
    $dataToInsert = $request->getParsedBody();
    $inserted = QuizDao::insertOrUpdate($dataToInsert);
    $payload = json_encode($inserted);

    $response = $response->withHeader('Content-Type', 'application/json');
    $response->getBody()->write($payload);
    return $response;
});

$app->run();