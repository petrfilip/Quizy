<?php
declare(strict_types=1);

use App\ErrorUtils;
use App\Middleware\JwtMiddleware;
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
        })->addMiddleware(new JwtMiddleware());

        /**
         * Get all user's labels
         */
        $group->get('/labels', function (Request $request, Response $response) {

            $data = UserRepository::getAllLabels();
            $payload = json_encode($data);

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write($payload);
            return $response;
        });//->addMiddleware(new JwtMiddleware());;

        /**
         * Get user by id
         */
        $group->get('/{id}', function (Request $request, Response $response) {

            $inputJson = $request->getAttributes();
            $data = UserRepository::getById($inputJson["id"]);
            $payload = json_encode($data);

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write($payload);
            return $response;
        });

        /**
         * Get users by any conditions
         */
        $group->post('/find', function (Request $request, Response $response) {

            $inputJson = $request->getParsedBody();
            $data = UserRepository::findBy($inputJson["filterMap"], $inputJson["sorterMap"]);
            $payload = json_encode($data);

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write($payload);
            return $response;
        });


        /**
         * Create new user
         */
        $group->post('', function (Request $request, Response $response) {
            $inputJson = $request->getParsedBody();

            //convert to array
            if (!is_array($inputJson)) {
                $mail = $inputJson["mail"];
                $name = $inputJson["name"];
                $inputJson = array();
                $inputJson[0]["mail"] = $mail;
                $inputJson[0]["name"] = $name;
            }


            $results = array();
            foreach ($inputJson as $value) {
//                $loadedUser = UserRepository::getByMail($value["mail"]);
//                if (!empty($loadedUser)) {
//                    $response->getBody()->write(json_encode(ErrorUtils::error(ErrorUtils::USER_ALREADY_EXISTS)));
//                    return $response->withStatus(403);
//                }


                $user = new stdClass();
                $user->mail = $value["mail"];
                $user->name = $value["name"];
                $user->labels = $value["labels"];

                if (!empty($value["password"])) {
                    $user->password = password_hash($value["password"], PASSWORD_BCRYPT);
                } else {
                    //todo mail token
                }

                $user->password = password_hash($value["mail"], PASSWORD_BCRYPT); //todo remove - only for debug

                $savedUser = UserRepository::insertOrUpdate($user);
                unset($savedUser["password"]);
                array_push($results, $savedUser);
            }

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write(json_encode($results));
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
        })->addMiddleware(new JwtMiddleware());;
    });


};