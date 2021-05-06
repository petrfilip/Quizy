<?php


namespace App;

final class ErrorUtils
{
    /* error constants */
    public const BAD_LOGIN = ["code" => "BAD_LOGIN", "description" => "Bad login credentials"];
    public const NO_CONTENT_TO_UPLOAD = ["code" => "NO_CONTENT_TO_UPLOAD", "description" => "No file to upload"];

    static public function error(array $error)
    {
        $error["timestamp"] = Utils::getCurrentDateTime();
        return $error;
    }
}