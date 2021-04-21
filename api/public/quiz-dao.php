<?php

namespace App;

use SleekDB\Store;

final class QuizDao
{
    static private function getDataStore($storeName): Store
    {
        return new Store($storeName, DATABASE_ROOT);
    }

    static public function findAll(): array
    {
        return QuizDao::getDataStore("quiz")->findAll();
    }


    static public function getBySlug($slug): array
    {
        $condition = ["slug", "===", $slug];
        return QuizDao::getDataStore("quiz")->findOneBy($condition);
    }

    static public function insertOrUpdate($data): array
    {
        $data = (array)$data;
        return QuizDao::getDataStore("quiz")->updateOrInsert($data);
    }
}