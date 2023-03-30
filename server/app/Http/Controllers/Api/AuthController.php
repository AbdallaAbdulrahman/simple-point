<?php

namespace App\Http\Controllers\Api;
use Illuminate\Http\Request;
use App\Models\User;
use Validator;
use App\Http\Controllers\Controller;
use App\Mail\AdminVerifyUserEmail;
use App\Mail\CreatedEmail;
use App\Mail\RecoverPassEmail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct() {
        $this->middleware('auth:api', ['except' => ['login', 'register', 'resetPassword']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request){
    	$validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // $credentials = request(['email', 'password']);

        // if (! $token = auth()->attempt($credentials)) {
        //     return response()->json(['error' => 'Unauthorized'], 401);
        // }

        // return $this->createNewToken($token);

        // For showing of correct error message
        $users = User::where('email', $request->email)->get();
        if (count($users) > 0) {
            $user = $users[0];
            if (! $token = auth()->attempt($validator->validated())) {
                return response()->json([
                    'message' => '入力されたパスワードが正しくありません。',
                ], 401);
            }
            return $this->createNewToken($token);
        } else {
            return response()->json([
                'message' => '入力されたメールアドレスが正しくありません。',
            ], 401);
        }
    }

    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'company' => 'required|string',
            'phone' => 'required|string',
            'email' => 'required|email|max:100|unique:users',
            // 'password' => 'required|confirmed|min:8|max:16',
            'password' => 'required|min:8|max:16',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 422);
        }

        DB::beginTransaction();
        try {
            $user = User::create(array_merge(
                $validator->validated(),
                ['password' => bcrypt($request->password)]
            ));
            $user->roles()->attach([2]);    // Default role is client on registration

            // $details = [
            //     'greeting' => 'Hi Artisan',
            //     'body' => 'This is my first notification from ItSolutionStuff.com',
            //     'thanks' => 'Thank you for using ItSolutionStuff.com tuto!',
            //     'actionText' => 'View My Site',
            //     'actionURL' => url('/'),
            //     'order_id' => 101
            // ];
            // Notification::send($user, new AlertNotification($details));

            // Send email into registered user
            $this->sendEmailToRegisteredUser($request->email);

            // Send email into admin to confirm for user
            $this->sendEmailToAdmin($user);
            DB::commit();
            return response()->json([
                'message' => 'success',
                'user' => $user
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'error'
            ], 400);
        }

    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:100',
            // 'password' => 'required|confirmed|min:8|max:16',
            // 'password' => 'required|min:8|max:16',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 422);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'message' => '入力されたメールアドレスが正しくありません。',
            ], 401);
        }

        $this->sendEmailForgotPass($user);
        return response()->json([
            'message' => __('email.recover_pass.send_email_success', [], 'ja'),
            'user' => $user
        ], 200);
    }


    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout() {
        auth()->logout();

        return response()->json(['message' => 'User successfully signed out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh() {
        return $this->createNewToken(auth()->refresh());
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function userProfile() {
        return response()->json(auth()->user());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function createNewToken($token){
        auth()->user()->roles;
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60000,
            'user' => auth()->user()
        ]);
    }

    /**
     * Get auth user
     *
     * @return App\Models\User
     */
    public function auth() {
        // return response()->json('date');
        return response()->json(auth()->user());
    }

    /**
     * sendEmailToRegisteredUser
     *
     * @param  string $userEmail
     */
    private function sendEmailToRegisteredUser(string $userEmail): void
    {
        $email = new CreatedEmail();
        $email->title = __('email.register_title.notify_to_user', [], 'ja');
        Mail::to($userEmail)->send($email);
    }

    /**
     * sendEmailToAdmin
     *
     * @param  User $newUser
     */
    private function sendEmailToAdmin(User $newUser): void
    {
        $adminEmail = config('mail.from.address');
        $email = new AdminVerifyUserEmail();
        $email->title = __('email.register_title.notify_to_admin', [], 'ja');
        $email->url = $this->renderVerificationUrl($newUser->id, $newUser->name, $newUser->email);
        $email->company = $newUser->company;
        $email->username = $newUser->name;
        $email->phone = $newUser->phone;
        $email->email = $newUser->email;
        Mail::to($adminEmail)->send($email);
    }

    /**
     * renderVerificationUrl
     *
     * @param  int $userId
     * @param  string $userName
     * @param  string $userEmail
     */
    private function renderVerificationUrl(int $userId, string $userName, string $userEmail): string
    {
        $hash = md5($userId . $userName . $userEmail);
        $frontEnd = config('app.front_end_url');
        if (substr($frontEnd, -1) === '/') {
            $frontEnd = substr($frontEnd, 0, -1);
        }
        return $frontEnd . '/auth/verify-email/' . $userId . '?hash=' . $hash;
    }

    /**
     * sendEmailForgotPass
     *
     * @param  User $user
     */
    private function sendEmailForgotPass(User $user): void
    {
        $token = bcrypt($user->email);
        $cacheKey = config('cache.reset_pass_key') . $user->id;
        Cache::put($cacheKey, $token, config('cache.reset_pass_ttl'));

        $email = new RecoverPassEmail();
        $email->title = __('email.recover_pass.title', [], 'ja');
        $email->url = $this->renderRecoverPassUrl($user->id, $token);
        Mail::to($user->email)->send($email);
    }

    /**
     * renderRecoverPassUrl
     *
     * @param  int $userId
     * @param  string $token
     */
    private function renderRecoverPassUrl(int $userId, string $token): string
    {
        $hash = md5($userId . $token);
        $frontEnd = config('app.front_end_url');
        if (substr($frontEnd, -1) === '/') {
            $frontEnd = substr($frontEnd, 0, -1);
        }
        return $frontEnd . '/auth/new-password/' . $userId . '/' . $hash . '?token=' . $token;
    }
}
