<?php

namespace App;

use SleekDB\Store;

final class UserRepository
{
    const REPOSITORY_NAME = 'user';

    static private function getDataStore(): Store
    {
        return new Store(self::REPOSITORY_NAME, DATABASE_ROOT);
    }

    static public function findAll(): array
    {
        return self::getDataStore()->findAll();
    }

    static public function getByMail($mail)
    {
        $condition = ["mail", "===", $mail];
        return self::getDataStore()->findOneBy($condition);
    }

    static public function getById($id)
    {
        return self::getDataStore()->findById($id);
    }

    static public function findBy($filters = [], $sorters = []): array
    {
        if (sizeof($filters) == 0) {
            return self::findAll();
        }

        return self::getDataStore()->findBy($filters, $sorters);
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

    public static function getAllLabels(): array
    {
        $userQueryBuilder = self::getDataStore()->createQueryBuilder();
        $result = $userQueryBuilder
            ->select(["labels"])
            ->except(["_id"])
            ->distinct("labels")
            ->getQuery()
            ->fetch();

        $allLabels = array();
        for ($i = 0; $i <= sizeof($result) - 1; $i++) {
            if (is_array($result[$i]["labels"])) {
                $allLabels = array_merge($allLabels, $result[$i]["labels"]);
            }
        }
        return array_values(array_unique($allLabels));
    }
}