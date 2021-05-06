<?php
declare(strict_types=1);

use App\ErrorUtils;
use App\UserRepository;
use Firebase\JWT\JWT;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

return function (App $app) {

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
            $jwt = JWT::encode($payload, JWT_KEY);


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