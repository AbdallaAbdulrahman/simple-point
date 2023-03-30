<?php

namespace App\Http\Controllers\Api;

use App\Models\Message;
use App\Models\User;

use App\Mail\ContactEmail;
use App\Mail\ChatNotiEmail;
use Illuminate\Support\Facades\Mail;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Mail\ChatNotifyToReceiverEmail;
use App\Models\Project;
use Carbon\Carbon;
use Validator;

class ContactController extends Controller
{
    const CHAT_UNREAD_EXPIRY = 72;

    /**
     * Response all data
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $user = User::findOrFail($request->userId);
            $project = Project::findOrFail($request->projectId);
            if (!$user || !$project) {
                return response()->json([
                    'message' => 'error'
                ], 401);
            }
<<<<<<< HEAD
            $messages = $project->messages()
                ->where('ufrom', $user->id)
                ->orWhere('uto', $user->id)
=======
            $userRole = $user->roles->first();
            $receiverId = 0;
            if ($userRole && $userRole->name !== 'Admin') {
                $receiverId = $project->admin_id;
            } else {
                if ($request->receiverFlag) {
                    $receiverId = $project->client_id;
                } else {
                    $receiverId = $project->business_id;
                }
            }
            $messages = $project->messages()->where('ufrom', $user->id)->where('uto', $receiverId)
                ->orWhere('ufrom', $receiverId)->where('uto', $user->id)
>>>>>>> 8a42e00a9af7f07e86a02141368fed3b67471b95
                ->orderBy('created_at', 'asc')->get();
            return response()->json([
                'message' => 'success',
                'data' => $messages->toArray()
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'error',
            ], 400);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'company' => 'required',
            'name' => 'required',
            'phone' => 'required',
            'email' => 'required',
            'content' => 'required',
        ]);
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $email = new ContactEmail();
        $email->title = 'お問い合わせ通知[Simple-Point]';
        $email->company = $request->company;
        $email->username = $request->name;
        $email->phone = $request->phone;
        $email->email = $request->email;
        $email->content = $request->content;

        Mail::to('info@apex.tokyo')->send($email);

        return response()->json([
            'message' => 'success',
        ], 200);
    }

    public function createChatMessage(Request $request)
    {
        try {
            $user = User::findOrFail($request->sender['id']);
            $project = Project::findOrFail($request->projectId);
            $receiverId = 0;
            $userRole = $user->roles->first();
            if ($userRole->id !== 1) {
                $receiverId = $project->admin_id;
            } else {
                $receiverId = $request->receiverFlag ? $project->client_id : $project->business_id;
            }
            $message = Message::create([
                'project_id' => $project->id,
                'ufrom' => $user->id,
                'uto' => $receiverId,
                'message' => $request->body,
                'countdown' => self::CHAT_UNREAD_EXPIRY,
                'is_read' => 0,
                'is_notified' => 0,
                'created_at' => Carbon::now()
            ]);
            return response()->json([
                'message' => 'success',
                'data' => $message
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'error',
            ], 400);
        }
    }

    public function checkMessages()
    {
        $messages = Message::where([
            'is_read' => 0,
            'is_notified' => 0,
            'countdown' => 0
        ])->get();
        foreach ($messages as $message) {
            $message->countdown = $message->countdown--;
            $message->save();
        }
        return response()->json([
            'message' => 'success',
            'result' => $messages
        ], 200);
    }

    public function notifyChat(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $message = Message::find($request->id);
        $message->is_notified = 1;
        $message->save();

        $messages = Message::where('project_id', $message->project_id)
            ->where('is_notified', 0)->where('uto', $message->uto)->get();
        foreach ($messages as $key => $message) {
            $message->is_notified = 1;
            $message->save();
        }

        $user = User::find($message->uto);
        if ($user->roles[0]->name == 'Client') {
            $email = new ChatNotiEmail();
            $email->title = '未読チャットのお知らせ[Simple-Point]';
            $email->company = $user->company;
            $email->username = $user->name;
            $email->url = 'http://simple-point.net/admin/projectdetail/' . $message->project_id;

            Mail::to($user->email)->send($email);
        }

        return response()->json([
            'message' => 'success',
            'result' => $message
        ], 200);
    }

    public function markChatMessage($id)
    {
        $message = Message::find($id);
        $message->is_read = 1;
        $message->save();

        return response()->json([
            'message' => 'success',
            'result' => $message
        ], 200);
    }

    public function markChatMessageProject($projectId)
    {
        $messages = Message::where('project_id', $projectId)->where('is_read', 0)->get();
        foreach ($messages as $key => $message) {
            $message->is_read = 1;
            $message->save();
        }

        return response()->json([
            'message' => 'success',
        ], 200);
    }

    public function sendEmailToReceiver(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'project_id' => 'required',
            'ufrom' => 'required',
            'uto' => 'required',
            'message' => 'required'
        ]);
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $message = $this->updateNotified($request->all());

        if ($message) {
            $userFrom = User::find($message->ufrom);
            $userTo = User::find($message->uto);
            if ($this->allowSendEmailToReceiver($userFrom, $userTo)) {
                $this->actionSendEmailToReceiver($userTo, $message->project_id);
            }
        }
        return response()->json([
            'message' => 'success',
            'result' => $message ?? []
        ], 200);
    }

    private function updateNotified(array $data): ?Message
    {
        $messages = Message::where('project_id', $data['project_id'])
            ->where('is_read', 0)->where('is_notified', 0)
            ->where('uto', $data['uto'])->get();
        $message = (clone $messages)->where('ufrom', $data['ufrom'])
            ->where('message', $data['message'])->first();
        if ($message) {
            $message->update([
                'is_notified' => 1
            ]);
            foreach ((clone $messages) as $message) {
                $message->is_notified = 1;
                $message->save();
            }
        }
        return $message;
    }

    private function allowSendEmailToReceiver(User $userFrom, User $userTo): bool
    {
        if (
            isset($userFrom->roles[0]) && isset($userTo->roles[0])
            && (
                ($userFrom->roles[0]->name == 'Business' && $userTo->roles[0]->name == 'Client')
                || ($userFrom->roles[0]->name == 'Client' && $userTo->roles[0]->name == 'Business')
            )
        ) {
            return false;
        }
        return true;
    }

    private function actionSendEmailToReceiver(User $userTo, int $projectId): void
    {
        $frontEndUrl = config('app.front_end_url');
        if (substr($frontEndUrl, -1) === '/') {
            $frontEndUrl = substr($frontEndUrl, 0, -1);
        }
        $email = new ChatNotifyToReceiverEmail();
        $email->title = 'simple-point【チャット受信のお知らせ】';
        $email->username = $userTo->name;
        $email->url = $frontEndUrl . '/admin/projectdetail/' . $projectId;
        Mail::to($userTo->email)->send($email);
    }
}
