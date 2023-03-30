<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnFileSizeIntoTableRequestData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('request_data') && !Schema::hasColumn('request_data', 'file_size')) {
            Schema::table('request_data', function (Blueprint $table) {
                $table->bigInteger('file_size')->after('request_data_link')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('request_data') && Schema::hasColumn('request_data', 'file_size')) {
            Schema::table('request_data', function (Blueprint $table) {
                $table->dropColumn('file_size');
            });
        }
    }
}
