// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    
    // FAQアコーディオン機能
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // 他のFAQを閉じる（オプション：複数開けたい場合はコメントアウト）
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // クリックされたFAQの開閉
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
    
    // スムーススクロール（内部リンク）
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 予約フォーム送信処理
    const reservationForm = document.querySelector('.reservation-form');
    
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // フォームデータを取得
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // 簡単なバリデーション
            if (!data.name || !data.phone || !data.date || !data.time) {
                alert('必須項目を入力してください。');
                return;
            }
            
            // 電話番号の簡単なバリデーション
            const phoneRegex = /^[0-9-+().\s]+$/;
            if (!phoneRegex.test(data.phone)) {
                alert('有効な電話番号を入力してください。');
                return;
            }
            
            // 実際の送信処理はここに実装
            // 例: fetch('/api/reservation', { method: 'POST', body: formData })
            
            alert('予約フォームを送信しました。確認のお電話をさせていただきます。');
            this.reset();
        });
    }
    
    // 電話番号リンクのクリック追跡（分析用）
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Google Analytics等でイベント追跡
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                    'event_category': 'contact',
                    'event_label': this.getAttribute('href')
                });
            }
        });
    });
    
    // スクロールに応じたヘッダーの表示制御
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 下にスクロール時はヘッダーを隠す
            header.style.transform = 'translateY(-100%)';
        } else {
            // 上にスクロール時はヘッダーを表示
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // 固定CTAボタンの表示制御（モバイルのみ）
    const fixedCta = document.querySelector('.fixed-cta');
    const footerCta = document.querySelector('.footer-cta');
    
    if (fixedCta && footerCta) {
        window.addEventListener('scroll', function() {
            const footerCtaRect = footerCta.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // フッターCTAが見えている時は固定CTAを隠す
            if (footerCtaRect.top < windowHeight) {
                fixedCta.style.display = 'none';
            } else {
                fixedCta.style.display = 'flex';
            }
        });
    }
    
    // 画像の遅延読み込み（Intersection Observer）
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // アニメーションの実行（Intersection Observer使用）
    const animateElements = document.querySelectorAll('.pain-item, .solution-item, .review-item, .menu-item');
    
    if (animateElements.length > 0) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animateElements.forEach(element => {
            element.style.animationPlayState = 'paused';
            animationObserver.observe(element);
        });
    }
    
    // 現在時刻に基づく診療状況表示
    function updateClinicStatus() {
        const now = new Date();
        const day = now.getDay(); // 0=日曜, 1=月曜, ..., 6=土曜
        const hour = now.getHours();
        const minute = now.getMinutes();
        const currentTime = hour * 60 + minute;
        
        const morningStart = 9 * 60; // 9:00
        const morningEnd = 12 * 60 + 30; // 12:30
        const afternoonStart = 14 * 60; // 14:00
        const weekdayEnd = 18 * 60; // 18:00（平日）
        const weekendEnd = 17 * 60; // 17:00（土日）
        
        let status = '';
        let statusClass = '';
        
        if (day >= 1 && day <= 5) { // 平日
            if ((currentTime >= morningStart && currentTime < morningEnd) || 
                (currentTime >= afternoonStart && currentTime < weekdayEnd)) {
                status = '診療中';
                statusClass = 'status-open';
            } else {
                status = '診療時間外';
                statusClass = 'status-closed';
            }
        } else if (day === 6 || day === 0) { // 土日
            if ((currentTime >= morningStart && currentTime < morningEnd) || 
                (currentTime >= afternoonStart && currentTime < weekendEnd)) {
                status = '診療中';
                statusClass = 'status-open';
            } else {
                status = '診療時間外';
                statusClass = 'status-closed';
            }
        }
        
        // ステータス表示要素があれば更新
        const statusElement = document.querySelector('.clinic-status');
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.className = `clinic-status ${statusClass}`;
        }
    }
    
    // 初回実行と定期更新
    updateClinicStatus();
    setInterval(updateClinicStatus, 60000); // 1分ごとに更新
    
    // パフォーマンス測定（Core Web Vitals）
    if ('web-vital' in window) {
        // LCP, FID, CLSの測定
        import('https://unpkg.com/web-vitals@3/dist/web-vitals.js').then(({ getCLS, getFID, getLCP }) => {
            getCLS(console.log);
            getFID(console.log);
            getLCP(console.log);
        });
    }
});

// ページ読み込み完了時の処理
window.addEventListener('load', function() {
    // ローディング状態の解除
    document.body.classList.add('loaded');
    
    // 遅延読み込み画像の最終チェック
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        if (img.getBoundingClientRect().top < window.innerHeight) {
            img.loading = 'eager';
        }
    });
});

// リサイズ時の処理
window.addEventListener('resize', function() {
    // モバイルメニューの調整等
    if (window.innerWidth >= 768) {
        // タブレット以上の場合の処理
        const fixedCta = document.querySelector('.fixed-cta');
        if (fixedCta) {
            fixedCta.style.display = 'none';
        }
    }
});

// エラーハンドリング
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // 必要に応じてエラー報告サービスに送信
});

// 右クリック禁止（画像保護、オプション）
/*
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});
*/

// 開発用：コンソールでの診療時間テスト
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    window.testClinicHours = function(day, hour, minute) {
        const testDate = new Date();
        testDate.setDay(day);
        testDate.setHours(hour);
        testDate.setMinutes(minute);
        console.log(`Test time: ${testDate.toLocaleString()}`);
        // テスト用の時間でステータス更新をシミュレート
    };
}