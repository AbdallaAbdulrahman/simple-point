@component('mail::layout', ['header' => '', 'footer' => ''])
    simple-pointに新しいユーザー登録認証依頼があります。<br/>
    認証する場合は内容を確認して認証URLから認証作業を行ってください。<br/>
    <br/>
    入力されたユーザー登録情報：<br/>
    ----------<br/>
    会社名：{{ $company }}<br/>
    担当者名：{{ $username }}<br/>
    電話番号：{{ $phone }}<br/>
    メールアドレス：{{ $email }}<br/>
    ----------<br/>
    @component('mail::button', ['url' => $url])
        アカウント登録認証
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
