<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExpiresResetPassTokenRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\JsonResponse;

class ResetPasswordController extends Controller
{
    public function checkExpiresResetPassToken(ExpiresResetPassTokenRequest $request): JsonResponse
    {
        $cacheKey = $this->getCacheKey($request->userId);
        if (Cache::has($cacheKey) && Cache::get($cacheKey) === $request->token) {
            return response()->json([
                'message' => 'success'
            ], 200);
        }
        return response()->json([
            'message' => 'error'
        ], 400);
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $user = User::find($request->userId);
        if ($user) {
            $hash = md5($user->id . $request->token);
            if ($request->hash === $hash) {
                $user->update([
                    'password' => bcrypt($request->password)
                ]);
                $cacheKey = $this->getCacheKey($user->id);
                Cache::forget($cacheKey);
                return response()->json([
                    'message' => __('email.reset_pass_success', [], 'ja')
                ], 200);
            }
        }
        return response()->json([
            'message' => 'error'
        ], 404);
    }

    private function getCacheKey(int $userId): string
    {
        return config('cache.reset_pass_key') . $userId;
    }
}
