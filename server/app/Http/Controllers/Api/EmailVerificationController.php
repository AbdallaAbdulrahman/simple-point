<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EmailVerificationRequest;
use App\Mail\NotifyUserVerifySuccessEmail;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class EmailVerificationController extends Controller
{
    public function verify(EmailVerificationRequest $request): array
    {
        $user = User::find($request->userId);
        if ($user) {
            if ($user->hasVerifiedEmail()) {
                return [
                    'message' => __('email.verification.verified', [], 'ja')
                ];
            }

            $hash = md5($user->id . $user->name . $user->email);
            if ($hash === $request->hash && $user->markEmailAsVerified()) {
                event(new Verified($user));
                $this->sendEmailNotifyUserVerifySuccessfully($user->email);
                return [
                    'message' => __('email.verification.success', [], 'ja')
                ];
            }
        }
        return [
            'message' => __('email.verification.fail', [], 'ja')
        ];
    }

    private function sendEmailNotifyUserVerifySuccessfully(string $userEmail): void
    {
        $email = new NotifyUserVerifySuccessEmail();
        $email->title = __('email.register_title.verified_notify_to_user', [], 'ja');
        Mail::to($userEmail)->send($email);
    }
}
