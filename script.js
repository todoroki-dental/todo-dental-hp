// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    
    // 共通ヘッダーの読み込み
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('./header.html')
            .then(response => {
                console.log('Header fetch response:', response.status, response.statusText);
                if (!response.ok) {
                    throw new Error(`Header file not found: ${response.status} ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                headerPlaceholder.innerHTML = data;
                
                // ヘッダー読み込み後に少し待ってから初期化
                setTimeout(() => {
                    initializeHeaderFunctionality();
                    initializeScrollHeader();
                }, 100);
            })
            .catch(error => {
                console.error('Error loading header:', error);
                // フォールバック: 基本的なヘッダーを表示
                headerPlaceholder.innerHTML = `
<header class="header">

</header>
                `;
             // フォールバック後でも初期化を実行
                setTimeout(() => {
                initializeHeaderFunctionality();
                initializeScrollHeader();
                }, 100);
            });
    }
    
    // ヘッダー機能の初期化（ヘッダー読み込み後に実行）
    function initializeHeaderFunctionality() {
        // ハンバーガーメニューの機能
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        const mobileNav = document.querySelector('.mobile-nav');
        
        console.log('Hamburger menu element:', hamburgerMenu);
        console.log('Mobile nav element:', mobileNav);
        
        if (hamburgerMenu && mobileNav) {
            console.log('Setting up hamburger menu functionality');
            hamburgerMenu.addEventListener('click', function() {
                console.log('Hamburger menu clicked');
                // ハンバーガーメニューボタンとモバイルナビの切り替え
                hamburgerMenu.classList.toggle('active');
                mobileNav.classList.toggle('active');
                
                // ボディのスクロールを制御
                if (mobileNav.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });
            
            // モバイルナビ背景クリックで閉じる
            mobileNav.addEventListener('click', function(e) {
                if (e.target === mobileNav) {
                    hamburgerMenu.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
            
            // モバイルナビ内のリンククリックで閉じる
            const mobileNavLinks = mobileNav.querySelectorAll('a');
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', function() {
                    hamburgerMenu.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        } else {
            console.error('Hamburger menu or mobile nav not found:', {
                hamburgerMenu: !!hamburgerMenu,
                mobileNav: !!mobileNav
            });
        }
        
        // デスクトップドロップダウンメニューの制御
        const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
        console.log('Dropdown toggles found:', dropdownToggles.length);
        
        dropdownToggles.forEach(toggle => {
            const dropdown = toggle.closest('.nav-dropdown');
            
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Dropdown toggle clicked');
                
                // 他のドロップダウンを閉じる
                dropdownToggles.forEach(otherToggle => {
                    const otherDropdown = otherToggle.closest('.nav-dropdown');
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active', 'clicked');
                    }
                });
                
                // 現在のドロップダウンを切り替え
                dropdown.classList.toggle('active');
                dropdown.classList.add('clicked'); // クリックされたことを示すクラス
            });
        });
        
        // ドロップダウン外をクリックしたら閉じる
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-dropdown')) {
                dropdownToggles.forEach(toggle => {
                    const dropdown = toggle.closest('.nav-dropdown');
                    dropdown.classList.remove('active', 'clicked');
                });
            }
        });
    }
    
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
    
    // スクロールに応じたヘッダーの表示制御を初期化（ヘッダー読み込み後に実行）
    function initializeScrollHeader() {
        let lastScrollTop = 0;
        const header = document.querySelector('.header');
        
        console.log('initializeScrollHeader called, header found:', !!header);
        
        if (header) {
            console.log('Adding scroll event listener for header');
            window.addEventListener('scroll', function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                console.log('Scroll event:', scrollTop, 'lastScrollTop:', lastScrollTop);
                
                if (scrollTop > lastScrollTop && scrollTop > 50) {
                    // 下にスクロール時はヘッダーを隠す
                    console.log('Hiding header');
                    header.style.transform = 'translateY(-100%)';
                } else {
                    // 上にスクロール時はヘッダーを表示
                    console.log('Showing header');
                    header.style.transform = 'translateY(0)';
                }
                
                lastScrollTop = scrollTop;
            });
        } else {
            console.error('Header element not found for scroll control');
        }
    }
    
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
        const imageObserver = new IntersectionObserver((entries) => {
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
    
    // ホワイトニングページのタブ切り替え機能
    const flowTabs = document.querySelectorAll('.flow-tab');
    const flowContents = document.querySelectorAll('.flow-content');
    
    flowTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            
            // 全てのタブから active クラスを削除
            flowTabs.forEach(t => t.classList.remove('active'));
            // 全てのコンテンツから active クラスを削除
            flowContents.forEach(content => content.classList.remove('active'));
            
            // クリックされたタブに active クラスを追加
            this.classList.add('active');
            
            // 対応するコンテンツに active クラスを追加
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // 歯列矯正ページの年齢別タブ切り替え機能
    const ageTabs = document.querySelectorAll('.age-tab');
    const ageContents = document.querySelectorAll('.age-content');
    
    ageTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            
            // 全てのタブから active クラスを削除
            ageTabs.forEach(t => t.classList.remove('active'));
            // 全てのコンテンツから active クラスを削除
            ageContents.forEach(content => content.classList.remove('active'));
            
            // クリックされたタブに active クラスを追加
            this.classList.add('active');
            
            // 対応するコンテンツに active クラスを追加
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    
    // 現在時刻に基づく診療状況表示
    function updateClinicStatus() {
        const now = new Date();
        const day = now.getDay(); // 0=日曜, 1=月曜, ..., 6=土曜
        const hour = now.getHours();
        const minute = now.getMinutes();
        const currentTime = hour * 60 + minute;
        
        const morningStart = 9 * 60; // 9:30
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