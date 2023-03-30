@component('mail::layout', ['header' => '', 'footer' => ''])
    APEX株式会社のsimple-pointをご利用いただきありがとうございます。<br/>
    アカウント情報の登録が完了しました。<br/>
    このあとアカウント登録内容を確認いたします。<br/>
    認証作業が完了しましたら<br/>
    アカウント本登録が完了となります。<br/>
    審査完了となりましたら、メールにて登録完了のお知らせを通知いたします。<br/>
    審査には1-2日程度お時間をいただく場合がございます。<br/>
    何卒よろしくお願いします。
    @slot('subcopy')
        @component('mail::subcopy')
            APEX株式会社<br/>
            <br/>
            Address:<br/>
            150-0002<br/>
            東京都渋谷区渋谷3-6-2　<br/>
            エクラート渋谷5F<br/>
            e-mail:info@apex.tokyo<br/>
            Web: https://www.apex.tokyo/
        @endcomponent
    @endslot
@endcomponent
