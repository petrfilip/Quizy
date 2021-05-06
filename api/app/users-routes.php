<?php
declare(strict_types=1);

use App\UserRepository;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

return function (App $app) {

    $app->group('/users', function (Group $group) {

        $group->get('', function (Request $request, Response $response) {

            $data = UserRepository::findAll();
            //todo remove password from data
            $payload = json_encode($data);

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write($payload);
            return $response;
        });

        $group->get('/{id}', function (Request $request, Response $response) {
            $response->getBody()->write('Hello world! - id');
            return $response;
        });


        $group->post('', function (Request $request, Response $response) {
            $inputJson = $request->getParsedBody();


            $user = new stdClass();
            $user->mail = $inputJson["mail"];
            $user->password = password_hash($inputJson["password"], PASSWORD_BCRYPT);

            $savedUser = UserRepository::insertOrUpdate($user);
            unset($savedUser["password"]);
            $response->getBody()->write(json_encode($savedUser));
            return $response;
        });
    });


};