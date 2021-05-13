<?php

namespace App;

use Exception;
use SleekDB\Store;

final class DatabaseManager
{

    static public function getDataStore($storeName): Store
    {
        return new Store($storeName, DATABASE_ROOT);
    }

    static public function findAll($collectionName)
    {
        return DatabaseManager::getDataStore($collectionName)->findAll();
    }

    static public function getById($collectionStoreName, $id)
    {
        $collectionStore = DatabaseManager::getDataStore($collectionStoreName);
        $loadedArray = $collectionStore->where("_id", "=", $id)->fetch();
        if (count($loadedArray)) {
            return $loadedArray[0];
        } else {
            return null;
        }
    }

    static public function updateById($collectionStore, $data)
    {
        $isUpdated = $collectionStore->where("_id", "=", $data["_id"])->update($data);
        if (!$isUpdated) {
            throw new Exception('Unable to update data.');
        }
    }

    static public function deleteById($collectionName, $id)
    {
        $collectionStore = DatabaseManager::getDataStore($collectionName);
        $isDeleted = $collectionStore->where("_id", "=", $id)->delete();
        if (!$isDeleted) {
            throw new Exception('Unable to delete data.');
        }
        return $isDeleted;
    }

    static public function createAuditVersion($collectionStoreName, $data)
    {
        unset($data["_id"]);
        $store = DatabaseManager::getDataStore($collectionStoreName . "-archiving");
        $store->insert($data);
    }

    static public function updateVersionedRecord($collectionName, $data, $userId, $createAudit = true)
    {
        $collectionStore = DatabaseManager::getDataStore($collectionName);
        $id = $data["_id"];
        if (empty($id)) {
            throw new Exception("Missing ID");
        }

        $loadVersion = DatabaseManager::getById($collectionName, $id);

        $data["sys"]["version"] = $data["sys"]["version"] + 1;
        $data["sys"]["updated"] = Utils::getCurrentDateTime();
        $data["sys"]["updatedBy"] = $userId;
        DatabaseManager::updateById($collectionStore, $data);

        if ($createAudit) {
            DatabaseManager::createAuditVersion($collectionName, $loadVersion);
        }
        return $data;
    }

    static public function safeDeleteVersionedRecord($collectionName, $id, $userId, $createAudit = true)
    {
        $collectionStore = DatabaseManager::getDataStore($collectionName);
        if (empty($id)) {
            throw new Exception("Missing ID");
        }

        $loadVersion = DatabaseManager::getById($collectionName, $id);

        $loadVersion["sys"]["version"] = $loadVersion["sys"]["version"] + 1;
        $loadVersion["sys"]["updated"] = Utils::getCurrentDateTime();
        $loadVersion["sys"]["updatedBy"] = $userId;
        $loadVersion["sys"]["deleted"] = true;
        DatabaseManager::deleteById($collectionName, $loadVersion["_id"]);

        if ($createAudit) {
            DatabaseManager::createAuditVersion($collectionName, $loadVersion);
        }
        return $loadVersion;
    }

    static public function insertNewVersionedRecord($collectionName, $data, $userId)
    {
        $data = (array)$data;
        $data["sys"]["version"] = 1;
        $data["sys"]["created"] = Utils::getCurrentDateTime();
        $data["sys"]["updated"] = Utils::getCurrentDateTime();
        $data["sys"]["createBy"] = $userId;
        $collectionStore = DatabaseManager::getDataStore($collectionName);
        return $collectionStore->insert($data);
    }

    static public function insertNewVersionedRecords($collectionName, $data, $userId)
    {
        $now = Utils::getCurrentDateTime();
        foreach ($data as $item) {
            $item = (array)$item;
            $item["sys"]["version"] = 1;
            $item["sys"]["created"] = $now;
            $item["sys"]["updated"] = $now;
            $item["sys"]["createBy"] = $userId;
            $items[] = $item;
        }

        $collectionStore = DatabaseManager::getDataStore($collectionName);
        return $collectionStore->insertMany($items);
    }


}