@component('mail::layout', ['header' => '', 'footer' => ''])
    新たなパスワードに変更するため、URLをクリックしてください。
    @component('mail::button', ['url' => $url])
        パスワード変更
    @endcomponent
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
