<?php
declare(strict_types=1);

use App\ErrorUtils;
use App\Middleware\JwtMiddleware;
use App\Middleware\RoleMiddleware;
use App\UserRepository;
use Firebase\JWT\JWT;
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
        })->addMiddleware(new JwtMiddleware())->addMiddleware(new RoleMiddleware("ADMIN"));

        /**
         * Get all user's labels
         */
        $group->get('/labels', function (Request $request, Response $response) {

            $data = UserRepository::getAllLabels();
            $payload = json_encode($data);

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write($payload);
            return $response;
        })->addMiddleware(new JwtMiddleware())->addMiddleware(new RoleMiddleware("ADMIN"));

        /**
         * Get user by id
         */
        $group->get('/{id}', function (Request $request, Response $response) {
            $inputJson = $request->getAttributes();
            if (intval($request->getAttribute("userId")) !== intval($inputJson["id"]) && $request->getAttribute("userId") != "ADMIN") {
                throw new Exception("Access denied");
            }


            $data = UserRepository::getById($inputJson["id"]);
            $payload = json_encode($data);

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write($payload);
            return $response;
        })->addMiddleware(new JwtMiddleware());

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
        })->addMiddleware(new JwtMiddleware())->addMiddleware(new RoleMiddleware("ADMIN"));


        /**
         * Create new user via admin
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
                $inputJson[0]["role"] = "USER";
            }


            $results = array();
            foreach ($inputJson as $value) {
                $savedUser = null;
                $loadedUser = UserRepository::getByMail($value["mail"]);
                if (!empty($loadedUser)) { // existing user
                    $loadedUser["labels"] = !empty($loadedUser["labels"]) ? $loadedUser["labels"] : array();
                    $loadedUser["labels"] = array_values(array_unique(array_merge($loadedUser["labels"], $value["labels"]), SORT_REGULAR));
                    $savedUser = UserRepository::insertOrUpdate($loadedUser);
                } else { // new user
                    $user = new stdClass();
                    $user->mail = $value["mail"];
                    $user->name = $value["name"];
                    $user->labels = $value["labels"];
                    $user->role = !empty($value["role"]) ? empty($value["role"]) : "USER";

                    if (!empty($value["password"])) {
                        $user->password = password_hash($value["password"], PASSWORD_BCRYPT);
                    } else {

                        $issuedAt = time();
                        $expire = $issuedAt + 2592000; // 60 seconds * 60 minutes * 24 hours * 30 days //todo is it ok?

                        $token = array(
                            "user_mail" => $value["mail"],
                            "exp" => $expire
                        );
                        $jwt = JWT::encode($token, JWT_KEY, 'HS256');

                        $emailBody = "Kliknutím na <a href='https://localhost:3006/password?reset={$jwt}'>odkaz změníte heslo</a>";
                        EmailService::sendMail($value["mail"], "Nové heslo", $emailBody);
                    }
                    $savedUser = UserRepository::insertOrUpdate($user);
                }
                unset($savedUser["password"]);
                unset($savedUser["achievements"]);
                array_push($results, $savedUser);
            }

            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write(json_encode($results));
            return $response;
        })->addMiddleware(new JwtMiddleware())->addMiddleware(new RoleMiddleware("ADMIN"));


        /**
         * The `token` have to contains:
         * - user_mail
         * - exp (expiration)
         *
         * The body have to contains:
         * - token
         * - password
         */
        $group->post('/password', function (Request $request, Response $response) {
            $inputJson = $request->getParsedBody();

            $tokenData = null;
            try {
                $tokenData = JWT::decode($inputJson["token"], JWT_KEY, ['HS256']);
            } catch (SignatureInvalidException $e) {
                throw new Exception("Token is expired");
            }

            if ($tokenData->exp < time()) {
                throw new Exception("Token is expired");
            }


            $user = UserRepository::getByMail($tokenData->user_mail);

            if (empty($user)) {
                throw new Exception("User not found");
            }

            $user["password"] = password_hash($inputJson["password"], PASSWORD_BCRYPT);
            UserRepository::insertOrUpdate($user);

            $response = $response->withHeader('Content-Type', 'application/json');
            return $response->withStatus(200);
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
        })->addMiddleware(new JwtMiddleware())->addMiddleware(new RoleMiddleware("ADMIN"));
    });


};