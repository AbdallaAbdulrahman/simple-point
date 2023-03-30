<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SocketIO
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
        if ($request->key === config('app.chat_server_key')) {
            return $next($request);
        }
        return response()->json(['error' => 'Unauthorized'], 403);
    }
}
