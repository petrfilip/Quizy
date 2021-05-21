<?php

use App\Middleware\CorsMiddleware;
use App\Middleware\HttpExceptionMiddleware;
use DI\ContainerBuilder;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Log\LoggerInterface;
use Slim\App;
use Slim\Exception\HttpNotFoundException;


require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . './../src/Middleware/CorsMiddleware.php';
require __DIR__ . './../src/Middleware/JwtMiddleware.php';
require __DIR__ . './../src/Middleware/RoleMiddleware.php';

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


$containerBuilder = new ContainerBuilder();

// Add container definitions
$containerBuilder->addDefinitions(__DIR__ . '/container.php');

// Build PHP-DI Container instance
$container = $containerBuilder->build();

$app = $container->get(App::class);
$app->add(CorsMiddleware::class);

$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();



// Define Custom Error Handler
$customErrorHandler = function (
    ServerRequestInterface $request,
    Throwable $exception,
    bool $displayErrorDetails,
    bool $logErrors,
    bool $logErrorDetails,
    ?LoggerInterface $logger = null
) use ($app) {
//    $logger->error($exception->getMessage());

    $payload = ['error' => $exception->getMessage()];

    $response = $app->getResponseFactory()->createResponse();



    $requestHeaders = $request->getHeaderLine('Access-Control-Request-Headers');

    $response = $response->withHeader('Access-Control-Allow-Origin', '*');
    $response = $response->withHeader('Access-Control-Allow-Methods', '*');
    $response = $response->withHeader('Access-Control-Allow-Headers', $requestHeaders ?: '*');

    // Allow Ajax CORS requests with Authorization header
    $response = $response->withHeader('Access-Control-Allow-Credentials', 'true');
    $response = $response->withHeader('Access-Control-Expose-Headers', 'Content-Disposition, Content-Type, X-Filename');



    $response->getBody()->write(json_encode($payload, JSON_UNESCAPED_UNICODE));
    return $response->withStatus(500);
};


$errorMiddleware = $app->addErrorMiddleware(true, true, true);
$errorMiddleware->setDefaultErrorHandler($customErrorHandler);



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