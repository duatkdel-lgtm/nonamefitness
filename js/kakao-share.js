/**
 * 카카오톡 공유 스크립트
 * - Kakao SDK → Web Share API → URL 복사 순서로 폴백
 * - iframe 내부에서도 올바른 URL 공유
 * - GA 이벤트 자동 전송
 */
(function () {
  'use strict';

  // ── 카카오 앱 키 (발급 후 교체) ──
  var KAKAO_APP_KEY = '2cddec8893b9498426a35fd55935b6ea';

  // ── 공유 정보 수집 ──
  function getShareUrl() {
    var og = document.querySelector('meta[property="og:url"]');
    if (og && og.content) return og.content;
    var canon = document.querySelector('link[rel="canonical"]');
    if (canon && canon.href) return canon.href;
    if (window !== window.parent) {
      var file = location.pathname.split('/').pop();
      return 'https://nonamefitness.co.kr/' + file;
    }
    return location.href.split('#')[0];
  }

  function getShareTitle() {
    var og = document.querySelector('meta[property="og:title"]');
    return og ? og.content : document.title || '노네임피트니스';
  }

  function getShareDesc() {
    var og = document.querySelector('meta[property="og:description"]');
    return og ? og.content : '천안 두정동 프리미엄 피트니스';
  }

  function getShareImage() {
    var og = document.querySelector('meta[property="og:image"]');
    return og ? og.content : 'https://nonamefitness.co.kr/images/facility-main.jpg';
  }

  // ── Kakao SDK 로드 ──
  var kakaoReady = false;

  function initKakao() {
    if (!KAKAO_APP_KEY) return;
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) window.Kakao.init(KAKAO_APP_KEY);
      kakaoReady = true;
      return;
    }
    var s = document.createElement('script');
    s.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js';
    s.onload = function () {
      if (window.Kakao) {
        window.Kakao.init(KAKAO_APP_KEY);
        kakaoReady = true;
      }
    };
    document.head.appendChild(s);
  }

  // ── URL 복사 헬퍼 ──
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function () { });
      return;
    }
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { }
    document.body.removeChild(ta);
  }

  // ── 공유 실행 ──
  window.shareKakao = function () {
    var url = getShareUrl();
    var title = getShareTitle();
    var desc = getShareDesc();
    var img = getShareImage();
    var method = 'copy_link';

    // 1순위: Kakao SDK
    if (kakaoReady && window.Kakao && window.Kakao.Share) {
      try {
        window.Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: title,
            description: desc,
            imageUrl: img,
            link: { mobileWebUrl: url, webUrl: url }
          },
          buttons: [
            { title: '자세히 보기', link: { mobileWebUrl: url, webUrl: url } }
          ]
        });
        method = 'kakao';
      } catch (e) {
        // SDK 오류 시 폴백
        fallbackShare(url, title, desc);
        method = navigator.share ? 'web_share_api' : 'copy_link';
      }
    } else {
      fallbackShare(url, title, desc);
      method = navigator.share ? 'web_share_api' : 'copy_link';
    }

    // GA 이벤트
    if (typeof gtag === 'function') {
      gtag('event', 'share', {
        method: method,
        content_type: 'page',
        item_id: url
      });
    }
  };

  function fallbackShare(url, title, desc) {
    // 2순위: Web Share API (모바일)
    if (navigator.share) {
      navigator.share({ title: title, text: desc, url: url }).catch(function () { });
    } else {
      // 3순위: URL 복사
      copyToClipboard(url);
      alert('링크가 복사되었습니다!\n카카오톡에 붙여넣기 해주세요 💬');
    }
  }

  // SDK 미리 로드
  initKakao();

  // ── 독립 페이지 접근 시 홈 버튼 자동 삽입 ──
  var isIframe = (window !== window.parent);
  var isHome = /index\.html$/.test(location.pathname) && !location.pathname.includes('gym');
  var isMainPage = location.pathname === '/' || location.pathname === '' || isHome;

  if (!isIframe && !isMainPage) {
    var homeBtn = document.createElement('a');
    homeBtn.href = 'https://nonamefitness.co.kr';
    homeBtn.innerHTML = '← 홈으로';
    homeBtn.style.cssText = 'position:fixed;top:16px;right:16px;z-index:99999;background:rgba(255,255,255,.95);color:#111;padding:10px 18px;border-radius:50px;font-size:14px;font-weight:700;text-decoration:none;box-shadow:0 2px 12px rgba(0,0,0,.2);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);transition:all .3s ease;';
    homeBtn.addEventListener('mouseenter', function () {
      this.style.background = '#111';
      this.style.color = '#fff';
    });
    homeBtn.addEventListener('mouseleave', function () {
      this.style.background = 'rgba(255,255,255,.95)';
      this.style.color = '#111';
    });
    document.body.appendChild(homeBtn);
  }
})();
