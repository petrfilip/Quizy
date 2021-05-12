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


final class JwtMiddleware implements MiddlewareInterface
{

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $routeContext = RouteContext::fromRequest($request);
        $routingResults = $routeContext->getRoutingResults();
        $uri = $routingResults->getUri();

        if ($request->getMethod() == "OPTIONS" || $uri == "/login" ) {
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

        if ($tokenData->exp < time()) {
            return new Response(403);
        }

        $actual_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
        if ($tokenData->iss !== $actual_link) {
            return new Response(403);
        }

        $request = $request->withAttribute("userId", $tokenData->user_id);
        return $handler->handle($request);
    }
}