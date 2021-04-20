<?php

use App\QuizDao;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Exception\HttpNotFoundException;
use Slim\Factory\AppFactory;
use App\DatabaseManager;

use App\Middleware\CorsMiddleware;



require __DIR__ . '/../vendor/autoload.php';
require "./quiz-dao.php";
require __DIR__ . './../src/Middleware/CorsMiddleware.php';

define("DATABASE_ROOT", __DIR__ . "/../database");

$app = AppFactory::create();


$app->add(CorsMiddleware::class);

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

//todo improve it
$app->options('/quiz', function (Request $request, Response $response, $args) {
    $response = $response->withHeader('Content-Type', 'application/json');
    return $response;
});

$app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], '/{routes:.+}', function ($request, $response) {
    throw new HttpNotFoundException($request);
});

$app->run();