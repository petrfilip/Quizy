<?php


namespace App;

final class ErrorUtils
{
    /* error constants */
    public const BAD_LOGIN = ["code" => "BAD_LOGIN", "description" => "Bad login credentials"];
    public const USER_ALREADY_EXISTS = ["code" => "USER_ALREADY_EXISTS", "description" => "User with same mail is already registered"];
    public const NO_CONTENT_TO_UPLOAD = ["code" => "NO_CONTENT_TO_UPLOAD", "description" => "No file to upload"];

    static public function error(array $error)
    {
        $error["timestamp"] = Utils::getCurrentDateTime();
        return $error;
    }
}