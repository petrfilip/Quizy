<?php
declare(strict_types=1);

use App\ErrorUtils;
use App\UserRepository;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

return function (App $app) {

    $app->group('/users', function (Group $group) {

        /**
         * Get all users
         */
        $group->get('', function (Request $request, Response $response) {

            $data = UserRepository::findAll();
            //todo remove password from data
            $payload = json_encode($data);

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write($payload);
            return $response;
        });

        /**
         * Get user by id
         */
        $group->get('/{id}', function (Request $request, Response $response) {
            $response->getBody()->write('Hello world! - id');
            return $response;
        });


        /**
         * Create new user
         */
        $group->post('', function (Request $request, Response $response) {
            $inputJson = $request->getParsedBody();

            $loadedUser = UserRepository::getByMail($inputJson["mail"]);
            if (!empty($loadedUser)) {
                $response->getBody()->write(json_encode(ErrorUtils::error(ErrorUtils::USER_ALREADY_EXISTS)));
                return $response->withStatus(403);
            }


            $user = new stdClass();
            $user->mail = $inputJson["mail"];
            $user->name = $inputJson["name"];
            $user->password = password_hash($inputJson["password"], PASSWORD_BCRYPT);

            $savedUser = UserRepository::insertOrUpdate($user);
            unset($savedUser["password"]);
            $response->getBody()->write(json_encode($savedUser));
            return $response;
        });

        /**
         * Delete user
         */
        $group->delete('/{id}', function (Request $request, Response $response, $args) {
            $data = UserRepository::deleteById($args["id"]); // add deleteAt
            $payload = json_encode($data);

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write($payload);
            return $response;
        });
    });


};