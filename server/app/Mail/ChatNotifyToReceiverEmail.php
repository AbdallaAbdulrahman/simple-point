<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ChatNotifyToReceiverEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $username;
    public $url;
    public $title;

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->title)->markdown('emails.chatNotifyToReceiver');
    }
}
