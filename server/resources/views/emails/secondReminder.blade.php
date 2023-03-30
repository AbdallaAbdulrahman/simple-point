@component('mail::message',
    ['name' => $details['name'],
    'company' => $details['company'],
    'project_name' => $details['project_name'],
    'url' => $details['url']])

# {{$details['company']}}
# {{$details['name']}}様

{{$details['project_name']}} いつも simple-point をご利用いただきまして誠にありがとうございます。<br>
の解析分につきまして、検収がお済みの場合は検収完了ボタンを
押していただきますようにお願いします。
@component('mail::button', ['url' => $details['url']])
案件
@endcomponent
また {{$details['acceptance_date']}} を過ぎますと成果に不備はなかったとして自動的に検収完了
となりますのでご注意ください。<br>


引き続き simple-point をよろしくお願いします。

Simple-Point運営<br>
※このメールはシステムからの自動送信になります

@endcomponent
