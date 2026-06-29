// ===================================
// 노네임피트니스 텔레그램 영업알림 전송
// 봇: @noname_sales_bot → 그룹 '재등록 영업알림'
// 모든 상담/제휴 신청 폼이 이 헬퍼로 텔레그램에 전송됩니다.
// ===================================
window.NONAME_TG = (function () {
    var TOKEN = '8892691839:AAF1WYC7wAZgqwKrASbnDr4O5h1Oeww8P28';
    var CHAT_ID = '-5265319848';
    var API = 'https://api.telegram.org/bot' + TOKEN + '/sendMessage';

    // HTML parse_mode 사용 시 특수문자 이스케이프
    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function now() {
        return new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    }

    // text: HTML 형식 문자열. ok가 아니면 reject.
    function send(text) {
        return fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: 'HTML' })
        }).then(function (r) {
            return r.json();
        }).then(function (j) {
            if (!j || !j.ok) throw new Error((j && j.description) || '텔레그램 전송 실패');
            return j;
        });
    }

    return { send: send, esc: esc, now: now };
})();
