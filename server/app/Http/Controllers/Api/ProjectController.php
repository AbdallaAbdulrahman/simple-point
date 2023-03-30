<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Role;
use App\Models\Project;
use App\Models\ProjectDetail;
use App\Models\RequestData;
use App\Models\DeliverableData;
use App\Models\Work;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Validator;

use App\Mail\OrderNotiEmail;
use App\Mail\AssignNotiEmail;
use App\Mail\StartNotiEmail;
use App\Mail\DeliveryNotiEmail;
use App\Mail\ConfirmNotiEmail;
use App\Mail\FinishNotiEmail;
use App\Services\ProjectServices;
use Illuminate\Support\Facades\Mail;

use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use PDF;

class ProjectController extends Controller
{

    /**
     * @var ProjectServices
     */
    protected $projectServices;

    //
    public function __construct(ProjectServices $projectServices) {
        $this->middleware('auth:api', ['except' => []]);
        $this->projectServices = $projectServices;
    }
    /**
     * Response all data
     *
     * @return \Illuminate\Http\Response
     */
    public function getAll()
    {
        $user = auth('api')->user();
        $role = $user->roles->first();

        if ($role->name == 'Client')
            $projects = Project::where('client_id', $user->id)->get();
        else if ($role->name == 'Business')
            $projects = Project::where('business_id', $user->id)->get();
        else
            $projects = Project::all();

        foreach ($projects as $key => $project) {
            if ($project->client != null)
                $project->company = $project->client->company;
            $project->created_date = $project->created_at->format('Y-m-d');
        }

        return response()->json([
            'message' => 'success',
            'projects' => $projects,
            'user' => $user
        ], 200);
    }

    /**
     * Response one data by id
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getById($projectId)
    {
        $project = Project::find($projectId);
        $project->client;
        $project->business;
        $project->detail;
        $project->requestData;
        $project->deliverableData;

        return response()->json([
            'message' => 'success',
            'project' => $project,
        ], 200);
    }

    public function getWorkFormats(Request $request) {
        $works = Work::all();
        foreach ($works as $work) {
            $work->outputFormats;
        }

        return response()->json([
            'message' => 'success',
            'work_output_formats' => $works,
        ], 200);
    }

    /**
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request) {
        $validator = Validator::make($request->all(), [
            'client_id' => 'required',
            'title' => 'required|string',
            'delivery_date' => 'required',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $project = new Project;
        $project->admin_id = 1;
        $project->client_id = $request->client_id;
        $project->title = $request->title;
        $project->amount = $request->amount;
        $project->tax = $request->tax;
        $project->delivery_date = $request->delivery_date;
        $project->status = '作業前';
        $project->save();

        $project->detail()->create([
            'ground_data' => $request->ground_data,
            'ground_data_output' => $request->ground_data_output,
            'ground_price' => $request->ground_price,
            'simplified_drawing' => $request->simplified_drawing,
            'simplified_drawing_output' => $request->simplified_drawing_output,
            'simplified_drawing_rank' => $request->simplified_drawing_rank,
            'simplified_drawing_scale' => $request->simplified_drawing_scale,
            'simplified_drawing_price' => $request->simplified_drawing_price,
            'contour_data' => $request->contour_data,
            'contour_data_output' => $request->contour_data_output,
            'contour_price' => $request->contour_price,
            'longitudinal_data' => $request->longitudinal_data,
            'longitudinal_data_output' => $request->longitudinal_data_output,
            'longitudinal_price' => $request->longitudinal_price,
            'simple_orthphoto' => $request->simple_orthphoto,
            'simple_orthphoto_output' => $request->simple_orthphoto_output,
            'simple_orthphoto_price' => $request->simple_orthphoto_price,
            'mesh_soil_volume' => $request->mesh_soil_volume,
            'mesh_soil_volume_output' => $request->mesh_soil_volume_output,
            'mesh_soil_volume_price' => $request->mesh_soil_volume_price,
            'simple_accuracy_table' => $request->simple_accuracy_table,
            'simple_accuracy_table_output' => $request->simple_accuracy_table_output,
            'simple_accuracy_price' => $request->simple_accuracy_price,
            'public_accuracy_table' => $request->public_accuracy_table,
            'public_accuracy_table_output' => $request->public_accuracy_table_output,
            'public_accuracy_price' => $request->public_accuracy_price,
        ]);

        $project = Project::all()->last();

        $subdata = [
            [Work::find(1)->work, $request->ground_data, $request->ground_price],
            [Work::find(2)->work, $request->simplified_drawing, $request->simplified_drawing_price],
            [Work::find(3)->work, $request->contour_data, $request->contour_price],
            [Work::find(4)->work, $request->longitudinal_data, $request->longitudinal_price],
            [Work::find(5)->work, $request->simple_orthphoto, $request->simple_orthphoto_price],
            [Work::find(6)->work, $request->mesh_soil_volume, $request->mesh_soil_volume_price],
            [Work::find(7)->work, $request->simple_accuracy_table, $request->simple_accuracy_price],
            [Work::find(8)->work, $request->public_accuracy_table, $request->public_accuracy_price],
        ];
        $data = [
            'company' => $project->client->company,
            'person' => $project->client->name,
            'created_date' => Carbon::now()->format('Y-m-d'),
            'delivery_date' => $project->delivery_date->format('Y-m-d'),
            'no' => $project->id,
            'name' => $project->title,
            'amount' => $project->amount,
            'subamount' => $request->subamount,
            'tax' => $project->tax,
            'title' => $project->title.'_発注請書',
        ];
        $path = base_path('public/img/apex.png');
        $type = pathinfo($path, PATHINFO_EXTENSION);
        $img = file_get_contents($path);
        $imgdata = 'data:image/' . $type . ';base64,' . base64_encode($img);

        try {
            $pdf = PDF::loadView('export_pdf', compact('data', 'subdata', 'imgdata'));
            $fname = $project->id . '_order.pdf';
            Storage::disk('s3')->put($project->id . '/' . $fname, $pdf->output());
            // Storage::put('public/pdf/'.$fname, $pdf->output());
        } catch (Exception $e) {
            return response()->json([
                'message' => $e,
            ], 200);
        }
        $project->purchase_order_link = $fname;
        $project->save();

        $email = new OrderNotiEmail();
        $email->title = '案件作成完了のお知らせ[Simple-Point]';
        $email->company = $project->client->company;
        $email->username = $project->client->name;
        $email->project = $project->title;
        $email->url = 'http://simple-point.net/admin/projectdetail/' . $project->id;
        $email->file = $project->id . '/' . $fname;

        $admin = User::find(1);
        Mail::to($project->client->email)->cc($admin->email)->send($email);

        return response()->json([
            'message' => 'success',
            'project' => $project
        ], 200);
    }

    public function update(Request $request)
    {

    }

    public function downloadOrder(Request $request, $projectId)
    {
        $user = auth('api')->user();
        $role = $user->roles->first();

        if ($role->name === 'Business')
            return response()->json([
                'message' => 'fail',
            ], 403);

        $project = Project::find($projectId);
        if ($project === null)
            return response()->json([
                'message' => 'fail',
            ], 404);

        $filePath = $projectId . '/' . $project->purchase_order_link;
        $contentType = Storage::disk('s3')->getMimeType($filePath);
        $headers = [
                'Content-Type'        => $contentType,
                'Content-Disposition' => 'attachment; filename="'. $project->purchase_order_link .'"',
        ];
        return response()->make(Storage::disk('s3')->get($filePath), 200, $headers);
    }

    public function downloadInvoice(Request $request, $projectId)
    {
        $user = auth('api')->user();
        $role = $user->roles->first();
        if ($role->name == 'Business')
            return response()->json([
                'message' => 'fail',
            ], 403);

        $project = Project::find($projectId);
        if ($project == null)
            return response()->json([
                'message' => 'fail',
            ], 404);

        $filePath = $projectId . '/' . $project->invoice_link;
        $contentType = Storage::disk('s3')->getMimeType($filePath);
        $headers = [
                'Content-Type'        => $contentType,
                'Content-Disposition' => 'attachment; filename="'. $project->invoice_link .'"',
        ];
        return response()->make(Storage::disk('s3')->get($filePath), 200, $headers);
    }

    public function getRequestData(Request $request, $projectId)
    {
        $data = RequestData::where('project_id', $projectId)->get();

        return response()->json([
            'message' => 'success',
            'data' => $data,
            'id' => $projectId
        ], 200);
    }

    public function checkTotalFileSizeOfUser(Request $request, $projectId)
    {
        $user = auth('api')->user();
        $role = $user->roles->first();
        $project = Project::find($projectId);
        $userData = $this->filterUserDataByType($user->id, $request->type);

        if (empty($userData['roleName']) || $role->name === $userData['roleName']) {
            return response()->json([
                'message' => 'fail',
            ], 401);
        } elseif ($project === null) {
            return response()->json([
                'message' => 'fail',
            ], 404);
        } elseif (($request->fileSize + $userData['totalFileSize']) > (int) config('const.max_total_files_size')) {
            return response()->json([
                'message' => 'アップロードできるデータの合計は上限が100GBです。他のファイルを削除して容量を空けるかファイル容量を下げてアップロードください。',
            ], 422);
        }

        return response()->json([
            'message' => 'success',
        ], 200);
    }

    /**
     * filterUserDataByType
     *
     * @param  int $userId
     * @param  int $dataType
     * @return mixed[]
     */
    private function filterUserDataByType(int $userId, int $dataType): array
    {
        if ($dataType) {
            $roleName = 'Client';
            $projectIdsOfUser = Project::whereClientId($userId)->pluck('id');
            $totalFileSize = DeliverableData::whereIn('project_id', $projectIdsOfUser)->sum('file_size');
        } else {
            $roleName = 'Business';
            $projectIdsOfUser = Project::whereBusinessId($userId)->pluck('id');
            $totalFileSize = DeliverableData::whereIn('project_id', $projectIdsOfUser)->sum('file_size');
        }
        return [
            'roleName' => $roleName ?? '',
            'totalFileSize' => $totalFileSize ?? 0
        ];
    }

    public function addRequestData(Request $request, $projectId)
    {
        $request_data = $this->projectServices->updateRequestData($projectId, $request->fileName, $request->fileSize);
        return response()->json([
            'message' => 'success',
            'request_data' => $request_data
        ], 200);
    }

    public function downloadRequestData(Request $request, $id)
    {
        $data = RequestData::find($id);

        if ($data == null)
            return response()->json([
                'message' => 'fail',
            ], 404);

        $filePath = $data->project_id . '/' . $data->request_data_link;
        $contentType = Storage::disk('s3')->getMimeType($filePath);
        $headers = [
            'Content-Type'        => $contentType,
            'Content-Disposition' => 'attachment; filename="'. $data->request_data_link .'"'
        ];
        return response()->make(Storage::disk('s3')->get($filePath), 200, $headers);
    }

    public function deleteRequestData(int $id)
    {
        DB::beginTransaction();
        try {
            $requestData = RequestData::findOrFail($id);
            $reqDataLink = $requestData->request_data_link;
            $project = Project::findOrFail($requestData->project_id);
            $filePath = $project->id . '/' . $reqDataLink;
            $requestData->delete();
            $s3 = Storage::disk('s3');
            if ($s3->exists($filePath)) {
                $s3->delete($filePath);
            }
            DB::commit();
            return response()->json([
                'message' => 'success',
                'project' => $project,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'error'
            ], 400);
        }
    }

    public function getDeliveryData(Request $request, $projectId)
    {
        $data = DeliverableData::where('project_id', $projectId)->get();

        return response()->json([
            'message' => 'success',
            'data' => $data,
            'id' => $projectId
        ], 200);
    }

    public function addDeliveryData(Request $request, $projectId)
    {
        $request_data = $this->projectServices->updateDeliverableData($projectId, $request->fileName, $request->fileSize);
        return response()->json([
            'message' => 'success',
            'request_data' => $request_data
        ], 200);
    }

    public function downloadDeliveryData(Request $request, $id)
    {
        $data = DeliverableData::find($id);

        if ($data == null)
            return response()->json([
                'message' => 'fail',
            ], 200);

        $filePath = $data->project_id . '/' . $data->deliverable_data_link;
        $contentType = Storage::disk('s3')->getMimeType($filePath);
        $headers = [
                'Content-Type'        => $contentType,
                'Content-Disposition' => 'attachment; filename="'. $data->deliverable_data_link .'"',
        ];
        return response()->make(Storage::disk('s3')->get($filePath), 200, $headers);
    }

    public function deleteDeliveryData($id)
    {
        DB::beginTransaction();
        try {
            $deliverableData = DeliverableData::findOrFail($id);
            $deliveryDataLink = $deliverableData->deliverable_data_link;
            $project = Project::findOrFail($deliverableData->project_id);
            $filePath = $project->id . '/' . $deliveryDataLink;
            $deliverableData->delete();
            $s3 = Storage::disk('s3');
            if ($s3->exists($filePath)) {
                $s3->delete($filePath);
            }
            DB::commit();
            return response()->json([
                'message' => 'success',
                'project' => $project,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'error'
            ], 400);
        }
    }

    public function assignProject(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'project_id' => 'required',
            'business_id' => 'required',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $project = Project::find($request->project_id);
        $project->business_id = $request->business_id;
        $project->save();

        $email = new AssignNotiEmail();
        $email->title = '作業依頼のお知らせ[Simple-Point]';
        $email->company = $project->business->company;
        $email->username = $project->business->name;
        $email->project = $project->title;
        $email->url = 'http://simple-point.net/admin/projectdetail/' . $project->id;
        Mail::to($project->business->email)->send($email);

        return response()->json([
            'message' => 'success',
            'project' => $project
        ], 200);
    }

    public function setStatus(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'project_id' => 'required',
            'status' => 'required',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $project = Project::find($request->project_id);
        $project->status = $request->status;
        $project->save();

        if ($request->status == '作業中') {
            $email = new StartNotiEmail();
            $email->title = '作業開始のお知らせ[Simple-Point]';
            $email->account = $project->business->name;
            $email->project = $project->title;
            $email->url = 'http://simple-point.net/admin/projectdetail/' . $project->id;

            $admin = User::find(1);
            Mail::to($admin->email)->send($email);
        }
        else if ($request->status == '納品中') {
            $email = new DeliveryNotiEmail();
            $email->title = '納品申請のお知らせ[Simple-Point]';
            $email->account = $project->business->name;
            $email->project = $project->title;
            $email->url = 'http://simple-point.net/admin/projectdetail/' . $project->id;

            $admin = User::find(1);
            Mail::to($admin->email)->send($email);
        }
        else if ($request->status == '検収中') {
            $email = new ConfirmNotiEmail();
            $email->title = '検収リクエストのお知らせ[Simple-Point]';
            $email->company = $project->client->company;
            $email->username = $project->client->name;
            $email->project = $project->title;
            $email->url = 'http://simple-point.net/admin/projectdetail/' . $project->id;
            Mail::to($project->client->email)->send($email);
        }
        else if ($request->status == '完了') {
            $detail = $project->detail;
            $subdata = [
                [Work::find(1)->work, $detail->ground_data, $detail->ground_price],
                [Work::find(2)->work, $detail->simplified_drawing, $detail->simplified_drawing_price],
                [Work::find(3)->work, $detail->contour_data, $detail->contour_price],
                [Work::find(4)->work, $detail->longitudinal_data, $detail->longitudinal_price],
                [Work::find(5)->work, $detail->simple_orthphoto, $detail->simple_orthphoto_price],
                [Work::find(6)->work, $detail->mesh_soil_volume, $detail->mesh_soil_volume_price],
                [Work::find(7)->work, $detail->simple_accuracy_table, $detail->simple_accuracy_price],
                [Work::find(8)->work, $detail->public_accuracy_table, $detail->public_accuracy_price],
            ];

            $data = [
                'company' => $project->client->company,
                'person' => $project->client->name,
                'created_date' => Carbon::now()->format('Y-m-d'),
                'payment_date' => Carbon::now()->addMonthsNoOverflow(1)->endOfMonth()->format('Y-m-d'),
                'no' => $project->id,
                'name' => $project->title,
                'amount' => $project->amount,
                'subamount' => $project->amount - $project->tax,
                'tax' => $project->tax,
                'title' => $project->title.'_請求書',
            ];
            $path = base_path('public/img/apex.png');
            $type = pathinfo($path, PATHINFO_EXTENSION);
            $img = file_get_contents($path);
            $imgdata = 'data:image/' . $type . ';base64,' . base64_encode($img);

            try {
                $pdf = PDF::loadView('export_invoice_pdf', compact('data', 'subdata', 'imgdata'));
                $fname = $project->id . '_invoice.pdf';
                Storage::disk('s3')->put($project->id . '/' . $fname, $pdf->output());
                // Storage::put('public/pdf/'.$fname, $pdf->output());
            } catch (Exception $e) {
                return response()->json([
                    'message' => $e,
                ], 200);
            }

            $project->invoice_link = $fname;
            $project->save();

            $email = new FinishNotiEmail();
            $email->title = '検収完了のお知らせ[Simple-Point]';
            $email->company = $project->client->company;
            $email->username = $project->client->name;
            $email->project = $project->title;
            $email->url = 'http://simple-point.net/admin/projectdetail/' . $project->id;
            $email->file = $project->id . '/' . $fname;

            $admin = User::find(1);
            Mail::to($project->client->email)->cc($admin->email)->send($email);
        }

        return response()->json([
            'message' => 'success',
            'project' => $project
        ], 200);
    }

    public function delete($projectId)
    {
        //delete Project
        $project = Project::find($projectId);
        $project -> delete();

        $projects = Project::all();
        foreach ($projects as $project) {
            $project->client;
            $project->business;
            // $project->detail;
            // $project->requestData;
            // $project->deliverableData;
        }

        return response()->json([
            'message' => 'success',
            'projects' => $projects
        ], 200);
    }
}
