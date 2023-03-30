<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnFileSizeIntoTableDeliverableData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('deliverable_data') && !Schema::hasColumn('deliverable_data', 'file_size')) {
            Schema::table('deliverable_data', function (Blueprint $table) {
                $table->bigInteger('file_size')->after('deliverable_data_link')->nullable();
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
        if (Schema::hasTable('deliverable_data') && Schema::hasColumn('deliverable_data', 'file_size')) {
            Schema::table('deliverable_data', function (Blueprint $table) {
                $table->dropColumn('file_size');
            });
        }
    }
}
