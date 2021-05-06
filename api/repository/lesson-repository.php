<?php

namespace App;

use SleekDB\Store;

final class LessonRepository
{
    const REPOSITORY_NAME = 'quiz';
    static private function getDataStore($storeName): Store
    {
        return new Store($storeName, DATABASE_ROOT);
    }

    static public function findAll(): array
    {
        return LessonRepository::getDataStore(self::REPOSITORY_NAME)->findAll();
    }


    static public function getBySlug($slug): array
    {
        $condition = ["slug", "===", $slug];
        return LessonRepository::getDataStore(self::REPOSITORY_NAME)->findOneBy($condition);
    }

    static public function deleteById($id)
    {
        return LessonRepository::getDataStore(self::REPOSITORY_NAME)->deleteById($id);
    }

    static public function insertOrUpdate($data): array
    {
        $data = (array)$data;
        return LessonRepository::getDataStore(self::REPOSITORY_NAME)->updateOrInsert($data);
    }
}