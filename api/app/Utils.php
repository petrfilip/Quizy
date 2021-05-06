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


}