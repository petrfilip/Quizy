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
        return UserRepository::getDataStore(self::REPOSITORY_NAME)->findAll();
    }

    static public function getByMail($mail)
    {
        $condition = ["mail", "===", $mail];
        return UserRepository::getDataStore(self::REPOSITORY_NAME)->findOneBy($condition);
    }

    static public function insertOrUpdate($data): array
    {
        $data = (array)$data;
        return UserRepository::getDataStore(self::REPOSITORY_NAME)->updateOrInsert($data);
    }
}