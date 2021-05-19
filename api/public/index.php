<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Exception\HttpNotFoundException;
use Slim\Factory\AppFactory;

use App\Middleware\CorsMiddleware;


require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . './../src/Middleware/CorsMiddleware.php';
require __DIR__ . './../src/Middleware/JwtMiddleware.php';

require __DIR__ . '/../repository/DatabaseManager.php';
require __DIR__ . '/../repository/exam-repository.php';
require __DIR__ . '/../repository/course-repository.php';
require __DIR__ . '/../repository/media-repository.php';
require __DIR__ . '/../repository/lesson-repository.php';
require __DIR__ . '/../repository/user-repository.php';
require __DIR__ . '/../app/ErrorUtils.php';
require __DIR__ . '/../app/Utils.php';

define("DATABASE_ROOT", __DIR__ . "/../database");
define("CONFIG_FILE", __DIR__ . './../config.php');
require CONFIG_FILE;

define("MEDIA_STORAGE_TRASH", "/trash");
define("MEDIA_STORAGE_THUMBNAIL_DIRECTORY", "/generated-thumbnail");
define("MEDIA_STORAGE", "/media-storage");
define("MEDIA_STORAGE_ROOT", __DIR__ . MEDIA_STORAGE);
putenv('TMPDIR=' . MEDIA_STORAGE_ROOT . "/tmp");
ini_set('upload_tmp_dir', MEDIA_STORAGE_ROOT . "/tmp");


$app = AppFactory::create();


$app->add(CorsMiddleware::class);

$app->addBodyParsingMiddleware();
$app->addErrorMiddleware(true, true, true);
$app->addRoutingMiddleware();


$app->get('/', function (Request $request, Response $response, $args) {
    $response->getBody()->write("Hello");
    return $response;
});

$appRoutes = require __DIR__ . '/../app/app-routes.php';
$appRoutes($app);

$usersRoutes = require __DIR__ . '/../app/users-routes.php';
$usersRoutes($app);

$lessonsRoutes = require __DIR__ . '/../app/lessons-routes.php';
$lessonsRoutes($app);

$coursesRoutes = require __DIR__ . '/../app/courses-routes.php';
$coursesRoutes($app);

$mediaRoutes = require __DIR__ . '/../app/media-routes.php';
$mediaRoutes($app);


$app->options('/{routes:.+}', function (Request $request, Response $response, $args) {
    $response = $response->withHeader('Content-Type', 'application/json');
    return $response;
});


$app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function ($request, $response) {
    throw new HttpNotFoundException($request);
});

$app->run();