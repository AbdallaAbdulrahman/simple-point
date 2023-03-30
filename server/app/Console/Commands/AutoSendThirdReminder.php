<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\Jobs\SendThirdMailJob;
use App\Models\Project;

class AutoSendThirdReminder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send-third-reminder';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sending Third Reminder, Checked Daily';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        /*
            have to change server's cron config to run this task automaticly
            * * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
        */
        // check data with status 検収中
        $projects = Project::where('status', '検収中')
            ->whereDate('updated_at', Carbon::now()->addDays(-14))
            ->get();
        foreach($projects as $item){
            $details3 = [
                'to' => $item->client->email,
                'project_name' => $item->title,
                'company' => $item->client->company,
                'name' => $item->client->name,
                'url' => 'http://simple-point.net/admin/projectdetail/' . $item->id,
                'subject' => $item->title. ' の検収に関するご案内',
                'acceptance_date' => $item->updated_at->addDays(14)->format('d/m/Y')
            ];
            SendThirdMailJob::dispatch($details3);
        }
    }
}
