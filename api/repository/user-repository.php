<?php

namespace App;

use SleekDB\Store;

final class UserRepository
{
    const REPOSITORY_NAME = 'user';
    static private function getDataStore($storeName): Store
    {
        return new Store($storeName, DATABASE_ROOT);
    }

    static public function findAll(): array
    {
        return self::getDataStore(self::REPOSITORY_NAME)->findAll();
    }

    static public function getByMail($mail)
    {
        $condition = ["mail", "===", $mail];
        return self::getDataStore(self::REPOSITORY_NAME)->findOneBy($condition);
    }

    static public function deleteById($id)
    {
        return self::getDataStore(self::REPOSITORY_NAME)->deleteById($id);
    }

    static public function insertOrUpdate($data): array
    {
        $data = (array)$data;
        return self::getDataStore(self::REPOSITORY_NAME)->updateOrInsert($data);
    }
}