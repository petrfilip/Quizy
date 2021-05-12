<?php
declare(strict_types=1);

use App\ApplicationRequirementsDto;
use App\ErrorUtils;
use App\UserRepository;
use Firebase\JWT\JWT;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

require_once "ApplicationRequirementsDto.php";


return function (App $app) {

    /**
     * Provide information about application requirements
     */
    $app->get('/app/init/requirements', function (Request $request, Response $response, $args) {

        //$loadedModules = phpinfo();
        //$isModRewriteLoaded = (strpos($loadedModules, 'mod_rewrite') !== false);
//        chmod(MEDIA_STORAGE_ROOT, 0777);
        chmod(DATABASE_ROOT, 0777);
//        chmod(CONFIG_FILE, 0777);
        // PHP | CURRENT VERSION | REQUIRED VERSION | STATUS
        $requirements = [
            new ApplicationRequirementsDto("Quizy", strval(\App\Utils::isApplicationInitialized() ? "TRUE" : "FALSE"), "FALSE", "The application can be initialized only once"),
            new ApplicationRequirementsDto("PHP", phpversion(), "7.2", "todo description"),
            new ApplicationRequirementsDto("mod rewrite", "isModRewriteLoaded", "TRUE", "todo description"),
            new ApplicationRequirementsDto("gd library", extension_loaded('gd') ? "true" : "false", "true", "todo description"),
            new ApplicationRequirementsDto("file_uploads", ini_get('file_uploads'), "todo", "todo description"),
            new ApplicationRequirementsDto("upload_max_filesize", ini_get('upload_max_filesize'), "todo", "todo description"),
            new ApplicationRequirementsDto("max_file_uploads", ini_get('max_file_uploads'), "todo", "todo description"),
            new ApplicationRequirementsDto("post_max_size", ini_get('post_max_size'), "todo", "todo description"),
            new ApplicationRequirementsDto("upload_tmp_dir", ini_get('upload_tmp_dir'), "todo", "todo description"),
            new ApplicationRequirementsDto("memory_limit", ini_get('memory_limit'), "todo", "todo description"),
            new ApplicationRequirementsDto("max_execution_time", ini_get('max_execution_time'), "todo", "todo description"),
//            new ApplicationRequirementsDto("chmod media", is_writable(MEDIA_STORAGE_ROOT) ? "true" : "false", "TRUE", "todo description"),
//            new ApplicationRequirementsDto("chmod database", is_writable(DATABASE_ROOT) ? "true" : "false", "TRUE", "todo description"),
//            new ApplicationRequirementsDto("chmod config", is_writable(CONFIG_FILE) ? "true" : "false", "TRUE", "todo description"),
        ];
        $response = $response->withHeader('Content-Type', 'application/json');

        $response->getBody()->write(json_encode($requirements));
        return $response;
    });

    /**
     * Get state of the application
     */
    $app->get('/app/init', function (Request $request, Response $response, $args) {
        $status = array(
            "status" => \App\Utils::isApplicationInitialized() ? "running" : "notInitialized", //todo add another state such as suspended
        );
        $response = $response->withHeader('Content-Type', 'application/json');
        $response->getBody()->write(json_encode($status));
        return $response;
    });

    /**
     * Init application
     * - creates first user and password for JWT tokens
     */
    $app->post('/app/init', function (Request $request, Response $response, $args) {

        if (\App\Utils::isApplicationInitialized()) {
            return $response->withStatus(400);
        }

        $inputJson = $request->getParsedBody();
        if ($inputJson == null) {
            return $response->withStatus(424);
        }

        /* init required directories */
//        if (!folder_exist(MEDIA_STORAGE_ROOT . MEDIA_STORAGE_THUMBNAIL_DIRECTORY)) {
//            mkdir(MEDIA_STORAGE_ROOT . MEDIA_STORAGE_THUMBNAIL_DIRECTORY);
//        }
//
//        if (!folder_exist(MEDIA_STORAGE_ROOT . MEDIA_STORAGE_TRASH)) {
//            mkdir(MEDIA_STORAGE_ROOT . MEDIA_STORAGE_TRASH);
//        }


        /* create config file with configuration*/
        $inputJson = $request->getParsedBody();

        if (!filter_var($inputJson["mail"], FILTER_VALIDATE_EMAIL)) {
            $response->getBody()->write("INVALID EMAIL");
            return $response;
        }

        if (!\App\Utils::isPasswordValid($inputJson["password"])) {
            $response->getBody()->write("INVALID PASSWORD");
            return $response;
        }


        $configFile = fopen(CONFIG_FILE, "w") or die("Unable to open file!");
        $txt = '<?php ';
        fwrite($configFile, $txt);
        $txt = 'define("JWT_KEY", "' . \App\Utils::randomPassword() . '");';
        fwrite($configFile, $txt);
        fclose($configFile);

        /* create first user */
        $user = new stdClass();
        $user->mail = $inputJson["mail"];
        $user->password = password_hash($inputJson["password"], PASSWORD_BCRYPT);

        $savedUser = UserRepository::insertOrUpdate($user);
        unset($savedUser["password"]);
        $response->getBody()->write(json_encode($savedUser));
        return $response;
    });

    /**
     * Login user by mail and password
     * The method provides new JET token
     */
    $app->group('/login', function (Group $group) {

        $group->options('', function (Request $request, Response $response, $args) {
            $response = $response->withHeader('Content-Type', 'application/json');
            return $response;
        });

        $group->post('', function (Request $request, Response $response) {
            $inputJson = $request->getParsedBody();

            // verify credentials
            $loadedUser = UserRepository::getByMail($inputJson["mail"]);

            if (empty($loadedUser) || !password_verify($inputJson["password"], $loadedUser["password"])) {
                $response->getBody()->write(json_encode(ErrorUtils::error(ErrorUtils::BAD_LOGIN)));
                return $response->withStatus(403);
            }

            $issuedAt = time();
            $expire = $issuedAt + 2592000; // 60 seconds * 60 minutes * 24 hours * 30 days //todo is it ok?
            $actual_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";

            $payload = array(
                "user_id" => $loadedUser["_id"],
                "user_mail" => $loadedUser["mail"],
                "iss" => $actual_link,
                "aud" => $actual_link,
                "iat" => $issuedAt,
                "exp" => $expire
            );
            $jwt = JWT::encode($payload, JWT_KEY, 'HS256');


            // create output for user
            $output = new stdClass();
            $output->token = $jwt;
            $output->mail = $inputJson["mail"];

            // log the event

            $response->getBody()->write(json_encode($output));
            return $response;
        });


    });
};