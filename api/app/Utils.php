<?php

namespace App;

use DateTime;

final class Utils
{

    static public function getCurrentDateTime()
    {
        $date = new DateTime();
        return $date->format('Y-m-d H:i:s');
    }

    static public function isApplicationInitialized()
    {
        return defined("JWT_KEY");
    }

    static public function isPasswordValid($password) : bool {
        return strlen($password) > 3;
    }

    static public function randomPassword(): string {
        $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        $pass = array(); //remember to declare $pass as an array
        $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
        for ($i = 0; $i < 50; $i++) {
            $n = rand(0, $alphaLength);
            $pass[] = $alphabet[$n];
        }
        return implode($pass); //turn the array into a string
    }



}