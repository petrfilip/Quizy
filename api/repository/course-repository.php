<?php

namespace App;

use SleekDB\Store;

final class CourseRepository
{
    const REPOSITORY_NAME = 'course';

    static public function getDataStore(): Store
    {
        return new Store(self::REPOSITORY_NAME, DATABASE_ROOT);
    }

    static public function findAll(): array
    {
        return self::getDataStore()->findAll();
    }

    static public function getBySlug($slug): array
    {
        $condition = ["slug", "===", $slug];
        return self::getDataStore()->findOneBy($condition);
    }

    static public function deleteById($id)
    {
        return self::getDataStore()->deleteById($id);
    }

    static public function insertOrUpdate($data): array
    {
        $data = (array)$data;
        return self::getDataStore()->updateOrInsert($data);
    }
}