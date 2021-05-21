<?php

namespace App\Middleware;

use Firebase\JWT\JWT;
use Firebase\JWT\SignatureInvalidException;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Psr7\Response;
use Slim\Routing\RouteContext;


final class RoleMiddleware implements MiddlewareInterface
{


    private $role;

    /**
     * RoleMiddleware constructor.
     */
    public function __construct(...$role)
    {
        $this->role = $role;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $routeContext = RouteContext::fromRequest($request);
        $routingResults = $routeContext->getRoutingResults();
        $uri = $routingResults->getUri();

        if ($request->getMethod() == "OPTIONS" || $uri == "/login") {
            return $handler->handle($request);
        }

        $jwt = $request->getHeaders();
        $jwt = str_replace('Bearer ', '', $jwt['Authorization'][0]);
        $tokenData = null;
        try {
            $tokenData = JWT::decode($jwt, JWT_KEY, ['HS256']);
        } catch (SignatureInvalidException $e) {
            return new Response(401);
        }

        if (!in_array($tokenData->user_role, $this->role)) {
            throw new \Exception("Permission denied");
        }

        return $handler->handle($request);
    }
}