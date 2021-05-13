<?php

namespace App;

use SleekDB\Store;

final class MediaRepository
{
    const REPOSITORY_NAME = 'media';
    static private function getDataStore($storeName): Store
    {
        return new Store($storeName, DATABASE_ROOT);
    }

    static public function findAll(): array
    {
        return self::getDataStore(self::REPOSITORY_NAME)->findAll();
    }

    static public function getById($id)
    {
        return self::getDataStore(self::REPOSITORY_NAME)->findById($id);
    }

    static public function deleteById($id)
    {
        return DatabaseManager::deleteById(self::REPOSITORY_NAME, $id);
    }

    static public function insertNewVersionedRecord($data, $userId)
    {
        return DatabaseManager::insertNewVersionedRecord(self::REPOSITORY_NAME, $data, $userId);
    }

    static public function insertNewVersionedRecords($data, $userId)
    {
        return DatabaseManager::insertNewVersionedRecords(self::REPOSITORY_NAME, $data, $userId);
    }

    public static function updateVersionedRecord($data, $userId)
    {
        return DatabaseManager::updateVersionedRecord(self::REPOSITORY_NAME, $data, $userId);
    }

    public static function findByLocation($location): array
    {
        $condition = ["path", "===", $location];
        return self::getDataStore(self::REPOSITORY_NAME)->findBy($condition);
    }


}