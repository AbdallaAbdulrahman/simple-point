<?php


namespace App\Services;

use App\Models\DeliverableData;
use App\Models\RequestData;

class ProjectServices
{
    /**
     * @param $projectId
     * @param $name
     * @param $fileSize
     * @return mixed
     */
    public function updateRequestData($projectId, $name, $fileSize)
    {
        return RequestData::updateOrCreate(
            [
                'project_id' => $projectId,
                'request_data_link' => $name,
            ],
            [
                'project_id' => $projectId,
                'request_data_link' => $name,
                'file_size' => $fileSize
            ]
        );
    }

    /**
     * @param $projectId
     * @param $name
     * @param $fileSize
     * @return mixed
     */
    public function updateDeliverableData($projectId, $name, $fileSize)
    {
        return DeliverableData::updateOrCreate(
            [
                'project_id' => $projectId,
                'deliverable_data_link' => $name,
            ],
            [
                'project_id' => $projectId,
                'deliverable_data_link' => $name,
                'file_size' => $fileSize
            ]
        );
    }
}
