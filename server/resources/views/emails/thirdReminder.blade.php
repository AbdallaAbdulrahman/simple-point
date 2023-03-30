@component('mail::message',
    ['name' => $details['name'],
    'company' => $details['company'],
    'project_name' => $details['project_name'],
    'url' => $details['url']])

# {{$details['company']}}
# {{$details['name']}}様

いつも simple-point をご利用いただきまして誠にありがとうございます。
{{$details['project_name']}} の解析分につきまして本日が検収最終日となります。<br>
成果物の内容をご確認いただき、下記の URL からログイン後に検収ボタンから検
収完了をお願いいたします。<br>
また {{$details['acceptance_date']}} を過ぎますと成果に不備はなかったとして自動的に検収完了
となりますのでご注意ください。


@component('mail::button', ['url' => $details['url']])
案件
@endcomponent

引き続き simple-point をよろしくお願いします。

Simple-Point運営<br>
※このメールはシステムからの自動送信になります

@endcomponent
