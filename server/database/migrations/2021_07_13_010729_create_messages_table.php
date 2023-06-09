<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMessagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('ufrom')->constrained('users')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('uto')->constrained('users')->onUpdate('cascade')->onDelete('cascade');
            $table->string('message')->nullable();
            $table->tinyInteger('is_read')->default('0');
            $table->integer('countdown');
            $table->tinyInt('is_notified')->default('0');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('messages');
    }
}
