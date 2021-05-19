<?php

namespace App;

use SleekDB\Store;

final class ExamRepository
{
    const REPOSITORY_NAME = 'exam';

    static public function getDataStore(): Store
    {
        return new Store(self::REPOSITORY_NAME, DATABASE_ROOT);
    }

    static public function findAll(): array
    {
        return self::getDataStore()->findAll();
    }

    static public function insertOrUpdate($data): array
    {
        $data = (array)$data;
        return self::getDataStore()->updateOrInsert($data);
    }

    public static function findUnfinishedByUser($type, $examId, $userId)
    {
        $typeCondition = ["type", "=", $type];
        $userCondition = ["userId", "=", $userId];
        $examCondition = ["examId", "=", $examId];
        $allConditions = [$userCondition, "AND", $examCondition, "AND", $typeCondition];
//        print_r(json_encode($allConditions));
        return self::getDataStore()->findBy($allConditions);
    }
}