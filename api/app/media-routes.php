<?php
declare(strict_types=1);

use App\ErrorUtils;
use App\MediaRepository;
use App\Middleware\JwtMiddleware;
use App\Utils;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

return function (App $app) {

    $app->group('/media', function (Group $group) {


        $group->get('/{id:[0-9]+}', function (Request $request, Response $response, $args) {
            $loadedItem = MediaRepository::getById($args["id"]);

            if (count($loadedItem)) {
                $payload = json_encode($loadedItem);
                $response->getBody()->write($payload);
                return $response;
            } else {
                return $response->withStatus(404);
            }
        });

        /* list directory */
        $group->get('/list[/{location:.*}]', function (Request $request, Response $response, $args) {
            $path = $args["location"];
            if ($path == "" || $path[0] != "/") {
                $path = "/" . $path;
            }

            $allItems = MediaRepository::findByLocation($path);

            $directories = array_filter($allItems, function ($v) {
                return $v["type"] === 'directory';
            }, ARRAY_FILTER_USE_BOTH);

            $files = array_filter($allItems, function ($v) {
                return $v["type"] === 'file';
            }, ARRAY_FILTER_USE_BOTH);

            $out = new stdClass();
            $out->location = $path;
            $out->files = array_values($files);
            $out->directories = array_values($directories);

            $payload = json_encode($out);
            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write($payload);
            return $response;
        });

        /**
         * create new directory
         */
        $group->post('/directory', function (Request $request, Response $response, $args) {
            $inputData = $request->getParsedBody();
            $path = $inputData["location"];
            if ($path[0] != "/") {
                $path = "/" . $path;
            }

            $slugName = Utils::slugify($inputData["directory"]);
            $originName = $inputData["directory"];


            $relativePath = $path;

            /* avoid two slashes in path*/
            if (strlen($path) === 1) {
                $path = "";
            }
            $publicPath = MEDIA_STORAGE . $path . DIRECTORY_SEPARATOR . $slugName;
            $realPathToSave = MEDIA_STORAGE_ROOT . $path . DIRECTORY_SEPARATOR . $slugName;

            //todo check if directory exists

            if (mkdir($realPathToSave)) {
                $media = new stdClass();
                $media->type = "directory";
                $media->originName = $originName;
                $media->slugName = $slugName;
                $media->path = $relativePath;
                $media->fullPath = $publicPath;
                $userId = $request->getAttribute("userId");
                $saved = MediaRepository::insertNewVersionedRecord($media, $userId);
                $payload = json_encode($saved);
                $response->getBody()->write($payload);
                return $response;
            } else {
                return $response->withStatus(503);
            }
        })->addMiddleware(new JwtMiddleware());

        $group->put('/directory', function (Request $request, Response $response, $args) {
//todo rename folder, find all files and directories containing old name and rename it
        })->addMiddleware(new JwtMiddleware());


        /* upload files*/

        $group->post('/file', function (Request $request, Response $response, $args) {

            // todo handle file with same name
            $uploadedFiles = $request->getUploadedFiles();
            if (!count($uploadedFiles)) {
                $response->getBody()->write(json_encode(ErrorUtils::error(ErrorUtils::NO_CONTENT_TO_UPLOAD)));
                return $response->withStatus(404); //todo fix code
            }

            foreach ($uploadedFiles['files'] as $uploadedFile) {
                if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
                    try {
                    $uploaded[] = Utils::moveUploadedFile($_POST["location"], $uploadedFile);
                    } catch (Exception $e) {
                        $errorResponse = ErrorUtils::error(ErrorUtils::UNABLE_TO_UPLOAD_FILE);
                        $errorResponse["location"] = $_POST["location"];
                        $errorResponse["file"] = $uploadedFile->getClientFilename();
                        $errorResponse["exception"] = $e->getMessage();
                        $response->getBody()->write(json_encode($errorResponse));
                        return $response->withStatus(500);
                    }
                }
            }

            $userId = $request->getAttribute("userId");
            $inserted = MediaRepository::insertNewVersionedRecords($uploaded, $userId);
            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write(json_encode($inserted));
            return $response;
        });//->addMiddleware(new JwtMiddleware());


        $group->put('/file', function (Request $request, Response $response, $args) {
            $inputJson = $request->getParsedBody();
            $userId = $request->getAttribute("userId");
            $inserted = MediaRepository::updateVersionedRecord($inputJson, $userId);
            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write(json_encode($inserted));
            return $response;
        })->addMiddleware(new JwtMiddleware());


        /**
         * Delete file and move to the trash
         */
        $group->delete('/{id}', function (Request $request, Response $response, $args) {

            $userId = $request->getAttribute("userId");
            //load from db
            $loaded = MediaRepository::getById($args["id"]);

            //check type (file/folder)
            //if dir, then go deep and delete (no trash)
            //if file, then move to trash

            rename(__DIR__ . $loaded["publicPath"], MEDIA_STORAGE_ROOT . MEDIA_STORAGE_TRASH . '/' . $loaded["slugName"]);

            MediaRepository::deleteById($args["id"]);
            unset($loaded["_id"]);

            $inserted = MediaRepository::insertNewVersionedRecord($loaded, $userId);
            $response = $response->withHeader('Content-Type', 'application/json');
            $response->getBody()->write(json_encode($inserted));
            return $response;
        })->addMiddleware(new JwtMiddleware());
    });
};