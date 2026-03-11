/**
 * GA4 이벤트 추적 스크립트
 * - 버튼/링크 클릭 추적
 * - 섹션 조회 추적
 * - 섹션 체류 시간 추적
 */
(function () {
  'use strict';

  // gtag 존재 확인
  if (typeof gtag !== 'function') return;

  // 현재 페이지 식별
  var path = location.pathname;
  var pageName = 'unknown';
  if (path.includes('partnership')) pageName = 'partnership';
  else if (path.includes('unlimited-pt')) pageName = 'unlimited-pt';
  else if (path.includes('premium-pt')) pageName = 'premium-pt';
  else if (path.includes('spinning')) pageName = 'spinning';
  else if (path.includes('tumbler')) pageName = 'tumbler';
  else if (path.includes('powerbelt')) pageName = 'powerbelt';
  else if (path.includes('gym')) pageName = 'gym';
  else pageName = 'home';

  // =============================================
  // 1. 클릭 추적
  // =============================================

  // 추적할 버튼/링크 선택자
  var clickTargets = [
    // 공통 버튼 클래스
    '.hero-btn', '.cta-btn', '.hero-buy-btn', '.final-btn',
    '.consult-btn', '.submit-btn', '.buy-btn',
    // 폼 제출
    '.form-submit',
    // 메인 페이지 버튼
    '.btn', '.quick-consult-btn', '.slideshow-open-btn',
    '.btn-naver-review',
    // 서브페이지 CTA
    '.cta-opt',
    // 링크 타입
    'a[href^="tel:"]', 'a[href*="kakao"]', 'a[href*="pf.kakao"]',
    'a[href*="naver.me"]', 'a[href*="map.naver"]',
    // 네비게이션
    '.nav a', '.nav-link', '.logo',
    // 카드/프로그램 클릭
    '.program-card', '.goods-card', '.trainer-card',
    '.price-card', '.pricing-card',
    // 폼 관련
    '.modal-close', '.checkbox-label',
    // 기타 인터랙티브 요소
    'button', '[onclick]',
    // 굿즈 관련
    '.goods-detail-btn', '.goods-info a',
    // 공유 버튼
    '.kakao-share-btn', '[onclick*="shareKakao"]'
  ];

  document.addEventListener('click', function (e) {
    var el = e.target;

    // 클릭된 요소 또는 부모에서 매칭되는 요소 찾기
    var matched = null;
    var current = el;
    for (var i = 0; i < 6; i++) {
      if (!current) break;
      for (var j = 0; j < clickTargets.length; j++) {
        try {
          if (current.matches && current.matches(clickTargets[j])) {
            matched = current;
            break;
          }
        } catch (ex) { }
      }
      if (matched) break;
      current = current.parentElement;
    }

    if (!matched) return;

    // 클릭 정보 수집
    var label = matched.textContent ? matched.textContent.trim().substring(0, 50) : '';
    var tag = matched.tagName || '';
    var cls = matched.className ? String(matched.className).trim().substring(0, 80) : '';
    var href = matched.getAttribute('href') || '';
    var onclick = matched.getAttribute('onclick') || '';

    // 카테고리 분류
    var category = 'button';
    if (href.startsWith('tel:')) category = 'phone_call';
    else if (href.includes('kakao')) category = 'kakao';
    else if (href.includes('naver.me/xuMjKn40')) category = 'naver_booking';
    else if (href.includes('naver.me')) category = 'naver_place';
    else if (href.includes('map.naver')) category = 'naver_map';
    else if (matched.matches('a') && href) category = 'link';
    else if (cls.includes('card')) category = 'card';
    else if (cls.includes('checkbox') || tag === 'INPUT') category = 'form';
    else if (cls.includes('nav') || cls.includes('logo')) category = 'navigation';
    else if (cls.includes('modal') || cls.includes('close')) category = 'modal';
    else if (onclick.includes('consult') || onclick.includes('Consult')) category = 'consult';
    else if (cls.includes('submit') || cls.includes('consult') || cls.includes('form-submit')) category = 'consult';
    else if (cls.includes('buy') || cls.includes('goods')) category = 'purchase';
    else if (cls.includes('share') || onclick.includes('shareKakao')) category = 'share';
    else if (cls.includes('slideshow')) category = 'slideshow';
    else if (cls.includes('naver-review')) category = 'naver_review';

    gtag('event', 'click', {
      event_category: category,
      event_label: label,
      page_name: pageName,
      element_class: cls,
      element_tag: tag,
      link_url: href || onclick || undefined
    });
  }, true); // useCapture로 모든 클릭 캡처


  // =============================================
  // 2. 섹션 조회 + 체류 시간 추적
  // =============================================

  if (!('IntersectionObserver' in window)) return;

  // 섹션 선택자 (각 페이지별 섹션 구조 커버)
  var sectionSelectors = [
    'section', '.sec', '.hero', '.hero-sec',
    '.cta', '.cta-sec', '.story-sec',
    '.chapter', '.quote-sec', '.pricing-sec',
    '.specs-sec', '.features-sec', '.daily-sec',
    '.identity-sec', '.philosophy-sec', '.product-reveal',
    '.opening', '.final-cta', '.package-sec',
    '.trainers', '.facility', '.goods', '.map-sec',
    '.consult', '.partners', '.programs',
    '[class*="-sec"]'
  ];

  // 모든 섹션 수집
  var allSections = [];
  sectionSelectors.forEach(function (sel) {
    try {
      var els = document.querySelectorAll(sel);
      els.forEach(function (el) {
        if (allSections.indexOf(el) === -1 && el.offsetHeight > 50) {
          allSections.push(el);
        }
      });
    } catch (ex) { }
  });

  // 섹션 이름 추출
  function getSectionName(el) {
    // id 우선
    if (el.id) return el.id;
    // data-section 속성
    if (el.dataset && el.dataset.section) return el.dataset.section;
    // 첫 번째 헤딩 텍스트
    var heading = el.querySelector('h1, h2, h3, .section-tag, .sec-tag, .tag');
    if (heading) {
      var text = heading.textContent.trim().substring(0, 40);
      if (text) return text;
    }
    // 클래스명
    var cls = el.className || '';
    if (typeof cls === 'string') {
      var main = cls.split(' ')[0];
      if (main) return main;
    }
    // 인덱스
    return 'section_' + allSections.indexOf(el);
  }

  // 추적 상태
  var sectionViewed = {};     // 조회 이벤트 발생 여부
  var sectionEnterTime = {};  // 진입 시간
  var sectionTotalTime = {};  // 누적 체류 시간

  var observer = new IntersectionObserver(function (entries) {
    var now = Date.now();

    entries.forEach(function (entry) {
      var el = entry.target;
      var name = getSectionName(el);
      var key = pageName + '::' + name;

      if (entry.isIntersecting) {
        // 섹션 진입
        sectionEnterTime[key] = now;

        // 최초 조회 이벤트
        if (!sectionViewed[key]) {
          sectionViewed[key] = true;
          gtag('event', 'section_view', {
            event_category: 'engagement',
            event_label: name,
            page_name: pageName
          });
        }
      } else {
        // 섹션 이탈 — 체류 시간 계산
        if (sectionEnterTime[key]) {
          var duration = Math.round((now - sectionEnterTime[key]) / 1000);
          if (!sectionTotalTime[key]) sectionTotalTime[key] = 0;
          sectionTotalTime[key] += duration;
          delete sectionEnterTime[key];

          // 2초 이상 체류한 경우만 이벤트 전송
          if (duration >= 2) {
            gtag('event', 'section_dwell', {
              event_category: 'engagement',
              event_label: name,
              page_name: pageName,
              value: duration,
              dwell_seconds: duration
            });
          }
        }
      }
    });
  }, {
    threshold: [0.2]  // 20% 이상 보일 때 감지
  });

  // 모든 섹션 관찰 시작
  allSections.forEach(function (el) {
    observer.observe(el);
  });


  // =============================================
  // 3. 페이지 이탈 시 남은 체류 시간 전송
  // =============================================

  function flushDwellTimes() {
    var now = Date.now();
    Object.keys(sectionEnterTime).forEach(function (key) {
      var duration = Math.round((now - sectionEnterTime[key]) / 1000);
      if (duration >= 2) {
        var name = key.split('::')[1] || key;
        gtag('event', 'section_dwell', {
          event_category: 'engagement',
          event_label: name,
          page_name: pageName,
          value: duration,
          dwell_seconds: duration
        });
      }
    });
    sectionEnterTime = {};
  }

  // beforeunload + visibilitychange 둘 다 사용
  window.addEventListener('beforeunload', flushDwellTimes);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      flushDwellTimes();
    }
  });


  // =============================================
  // 4. 스크롤 깊이 추적
  // =============================================

  var scrollMilestones = { 25: false, 50: false, 75: false, 100: false };

  function checkScrollDepth() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight <= 0) return;
    var percent = Math.round((scrollTop / docHeight) * 100);

    [25, 50, 75, 100].forEach(function (milestone) {
      if (percent >= milestone && !scrollMilestones[milestone]) {
        scrollMilestones[milestone] = true;
        gtag('event', 'scroll_depth', {
          event_category: 'engagement',
          event_label: milestone + '%',
          page_name: pageName,
          value: milestone
        });
      }
    });
  }

  var scrollTimer = null;
  window.addEventListener('scroll', function () {
    if (scrollTimer) return;
    scrollTimer = setTimeout(function () {
      scrollTimer = null;
      checkScrollDepth();
    }, 300);
  }, { passive: true });

})();
