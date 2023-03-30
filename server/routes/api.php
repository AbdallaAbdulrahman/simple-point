<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PriceController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\EmailVerificationController;
use App\Http\Controllers\Api\ResetPasswordController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/* Contact */
Route::post('/contact', [ContactController::class, 'store']);
// Mark chat message as read
Route::get('/markChatMessage/{projectId}', [ContactController::class, 'markChatMessage']);
Route::get('/markChatMessageProject/{projectId}', [ContactController::class, 'markChatMessageProject']);
/* send email to receiver when chat realtime */
Route::post('/sendEmailToReceiver', [ContactController::class, 'sendEmailToReceiver']);

Route::group(['middleware' => 'socket.io'], function(){
    /* process unread chat message */
    Route::post('/notifyChat', [ContactController::class, 'notifyChat']);
    /* get chat messages */
    Route::post('/get-chat-messages', [ContactController::class, 'index']);
    /* create new chat messages */
    Route::post('/create-chat-messages', [ContactController::class, 'createChatMessage']);
    /* check messages */
    Route::post('/check-messages', [ContactController::class, 'checkMessages']);
});

Route::group(['middleware' => 'api'], function(){
    /* User register */
    Route::post('/register', [AuthController::class, 'register']);

    Route::post('/verify-email', [EmailVerificationController::class, 'verify'])->name('verification.verify');

    /* User login */
    Route::post('/login', [AuthController::class, 'login'])->name('login')->middleware('verify.email');
    /* Reset password */
    Route::post('/recover/password', [AuthController::class, 'resetPassword']);
    /* Check Expires Reset Password Token */
    Route::post('/reset/password/verify-token', [ResetPasswordController::class, 'checkExpiresResetPassToken']);
    /* Reset password */
    Route::post('/reset/password', [ResetPasswordController::class, 'resetPassword']);

    /* Refresh user's token */
    Route::get('/refresh', [AuthController::class, 'token']);
    /* User logout from system */
    Route::get('/logout', [AuthController::class, 'logout']);
    // Get auth user
    Route::get('/token/validate', [AuthController::class, 'auth']);

    // Get user's profile
    Route::get('/profile', [ProfileController::class, 'index']);
    // Update user's profile
    Route::put('/profile/update', [ProfileController::class, 'update']);
    Route::put('/profile/company', [ProfileController::class, 'updateCompany']);
    Route::put('/profile/name', [ProfileController::class, 'updateName']);
    Route::put('/profile/phone', [ProfileController::class, 'updatePhone']);
    Route::put('/profile/mail', [ProfileController::class, 'updateMail']);
    Route::put('/profile/passwd', [ProfileController::class, 'updatePasswd']);

    // Get all projects
    Route::get('/projects', [ProjectController::class, 'getAll']);
    /* Get project detail by id */
    Route::get('/project/{projectId}', [ProjectController::class, 'getById']);
    /* Check total file size of user */
    Route::post('/project/{projectId}/check-file-size', [ProjectController::class, 'checkTotalFileSizeOfUser']);
    /* Update project's status */
    Route::put('/project/set-status', [ProjectController::class, 'setStatus']);

    // Download order document
    Route::get('/project/order/download/{projectId}', [ProjectController::class, 'downloadOrder']);
    Route::get('/project/invoice/download/{projectId}', [ProjectController::class, 'downloadInvoice']);

    Route::get('/project/request/get/{projectId}', [ProjectController::class, 'getRequestData']);
    Route::get('/project/delivery/get/{projectId}', [ProjectController::class, 'getDeliveryData']);
    Route::get('/project/request/download/{dataId}', [ProjectController::class, 'downloadRequestData']);
    Route::get('/project/delivery/download/{dataId}', [ProjectController::class, 'downloadDeliveryData']);
    /* Add a new request data */
    Route::post('/project/request/add/{projectId}', [ProjectController::class, 'addRequestData']);
    /* Add a new deliverable data */
    Route::post('/project/delivery/add/{projectId}', [ProjectController::class, 'addDeliveryData']);

    // Get all projects
    Route::get('/work/formats', [ProjectController::class, 'getWorkFormats']);

    //Admin actions
    Route::group([ 'prefix' => 'admin', 'middleware' => 'isAdmin' ], function(){
        /* Get all users details*/
        Route::get('/users', [UserController::class, 'getAll']);
        /* Add a user */
        Route::post('/user/create', [UserController::class, 'create']);
        /* Update a user */
        Route::put('/user/update', [UserController::class, 'update']);
        /* Get user detail by id */
        Route::get('/user/{userId}', [UserController::class, 'getById']);
        /* delete user by id */
        Route::delete('/user/delete/{userId}', [UserController::class, 'delete']);

        /* Get all businesses*/
        Route::get('/businesses', [UserController::class, 'getAllBusinesses']);
        /* Get price list*/
        Route::get('/prices', [PriceController::class, 'index']);
        /* Update price list */
        Route::put('/price/update', [PriceController::class, 'update']);

        // Assign project to a business
        Route::put('/project/assign', [ProjectController::class, 'assignProject']);
        // delete project by id
        Route::delete('/project/{projectId}/delete', [ProjectController::class, 'delete']);
        // delete request data
        Route::delete('/project/request/delete/{dataId}', [ProjectController::class, 'deleteRequestData'])
            ->withoutMiddleware('isAdmin')->middleware('removeRequestData');
        // delete deliverable data
        Route::delete('/project/delivery/delete/{dataId}', [ProjectController::class, 'deleteDeliveryData'])
            ->withoutMiddleware('isAdmin')->middleware('removeDeliveryData');
    });

    //Client actions
    Route::group([ 'prefix' => 'client', 'middleware' => 'isClient' ], function(){
        /* Create a new project */
        Route::post('/project/create', [ProjectController::class, 'create']);
        /* Update a project detail */
        Route::put('/project/update', [ProjectController::class, 'update']);
        /* Get price list*/
        Route::get('/prices', [PriceController::class, 'index']);
    });

    //Business actions
    Route::group([ 'prefix' => 'business', 'middleware' => 'isBusiness' ], function(){
    });
});
