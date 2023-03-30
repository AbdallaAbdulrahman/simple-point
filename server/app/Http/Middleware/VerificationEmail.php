<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;

class VerificationEmail
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $user = User::where('email', $request->email)->first();
        if ($user && !$user->email_verified_at) {
            return response()->json([
                'status' => 'error',
                'message' => __('email.verification.unverified', [], 'ja')
            ], 403);
        }
        return $next($request);
    }
}
