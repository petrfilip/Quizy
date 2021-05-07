<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Exception\HttpNotFoundException;
use Slim\Factory\AppFactory;

use App\Middleware\CorsMiddleware;



require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . './../src/Middleware/CorsMiddleware.php';
require __DIR__ . './../src/Middleware/JwtMiddleware.php';

require __DIR__ . '/../repository/lesson-repository.php';
require __DIR__ . '/../repository/user-repository.php';
require __DIR__ . '/../app/ErrorUtils.php';
require __DIR__ . '/../app/Utils.php';

define("DATABASE_ROOT", __DIR__ . "/../database");

define("JWT_KEY", "TODO");

$app = AppFactory::create();


$app->add(CorsMiddleware::class);

$app->addBodyParsingMiddleware();
$app->addErrorMiddleware(true, true, true);
$app->addRoutingMiddleware();


$app->get('/', function (Request $request, Response $response, $args) {
    $response->getBody()->write("Hello");
    return $response;
});

$loginRoute = require __DIR__ . '/../app/login-routes.php';
$loginRoute($app);

$usersRoutes = require __DIR__ . '/../app/users-routes.php';
$usersRoutes($app);

$lessonsRoutes = require __DIR__ . '/../app/lessons-routes.php';
$lessonsRoutes($app);

$app->options('/{routes:.+}', function (Request $request, Response $response, $args) {
    $response = $response->withHeader('Content-Type', 'application/json');
    return $response;
});


$app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function ($request, $response) {
    throw new HttpNotFoundException($request);
});

$app->run();