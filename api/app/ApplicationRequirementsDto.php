<?php

namespace App;

final class ApplicationRequirementsDto {
    public $key;
    public $current;
    public $required;
    public $status;
    public $description;

    /**
     * ApplicationRequirementsDto constructor.
     * @param $key
     * @param $current
     * @param $required
     * @param $description
     */
    public function __construct($key, $current, $required, $description)
    {
        $this->key = $key;
        $this->current = $current;
        $this->required = $required;
        $this->status = "";
        $this->description = $description;
    }

    /**
     * @return mixed
     */
    public function getKey()
    {
        return $this->key;
    }

    /**
     * @return mixed
     */
    public function getCurrent()
    {
        return $this->current;
    }

    /**
     * @return mixed
     */
    public function getRequired()
    {
        return $this->required;
    }

    /**
     * @return string
     */
    public function getStatus(): string
    {
        return $this->status;
    }

    /**
     * @return mixed
     */
    public function getDescription()
    {
        return $this->description;
    }

}