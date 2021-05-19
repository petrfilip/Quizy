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

    public static function findUnfinishedExamByUser($type, $examId, $userId): array
    {
        return  self::getDataStore()->createQueryBuilder()
            ->where(["type", "=", $type])
            ->where(["userId", "=", $userId])
            ->where(["examId", "=", $examId])
            ->where(["finishedAt", "=", null])
            ->getQuery()
            ->first();
    }
}