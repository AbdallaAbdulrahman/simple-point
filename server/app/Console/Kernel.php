<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
        Commands\DemoCron::class,
        Commands\AutoTicketing::class,
<<<<<<< HEAD
=======
        Commands\AutoSendReminder::class,
        Commands\AutoSendThirdReminder::class,
>>>>>>> 8a42e00a9af7f07e86a02141368fed3b67471b95
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('demo:cron')->everyMinute();
        $schedule->command('auto-ticketing')->hourly();
        $schedule->command('auto-year-plan')->yearly();
<<<<<<< HEAD
=======

        $schedule->command('send-second-reminder')->daily();
        $schedule->command('send-third-reminder')->daily();
>>>>>>> 8a42e00a9af7f07e86a02141368fed3b67471b95
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
