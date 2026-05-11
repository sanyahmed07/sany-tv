/** 
 * CloudAds SDK - Sany-TV Optimized
 * Fixed for 10 Images (1.png to 10.png)
 */
(function (window, document) {
    'use strict';

    window.cloudAdsQueue = window.cloudAdsQueue || [];

    // আপনার GitHub Pages ডোমেইন এবং সঠিক ফোল্ডার পাথ
    const baseUrl = "https://sanyahmed07.github.io/sany-tv/cloud-ads";

    // ব্যানার অ্যাডের লিস্ট
    const bannerAds = [
        {
            type: 'custom',
            // ১০টি ছবির জন্য Math.random() * 10 ব্যবহার করা হয়েছে
            imageUrl: () => `${baseUrl}/images/banner/${Math.floor(Math.random() * 10) + 1}.png`,
            clickUrl: 'https://smelthrsfranz.com/uqq3t3j3e?key=bc70b66536f04e1b94b75ed2bc6a9bf3'
        },
        {
            type: 'adsterra',
            adsterraKey: 'b23a36a52899c1f2850767e2019e1a41',
            adsterraSrc: 'https://smelthrsfranz.com/b23a36a52899c1f2850767e2019e1a41/invoke.js',
            width: 320,
            height: 50
        }
    ];

    // ফুলস্ক্রিন অ্যাডের লিস্ট
    const fullscreenAds = [
        { 
            imageUrl: () => `${baseUrl}/images/fullscreen/${Math.floor(Math.random() * 10) + 1}.png`,
            clickUrl: 'https://smelthrsfranz.com/uqq3t3j3e?key=bc70b66536f04e1b94b75ed2bc6a9bf3' 
        }
    ];

    const injectCSS = () => {
        if (document.getElementById('cloudads-sdk-styles')) return;
        const style = document.createElement('style');
        style.id = 'cloudads-sdk-styles';
        style.innerHTML = `
            .cloudads-fs-wrapper { position: fixed; inset: 0; width: 100%; height: 100%; background-color: #000; display: flex; flex-direction: column; justify-content: space-between; z-index: 999999; font-family: sans-serif; }
            .cloudads-header { background: #d32f2f; color: white; text-align: center; padding: 10px; font-weight: bold; }
            .cloudads-body { flex: 1; display: flex; align-items: center; justify-content: center; background: #1a1a1a; border: none; cursor: pointer; }
            .cloudads-img { max-width: 100%; max-height: 100%; object-fit: contain; }
            .cloudads-footer { background: #222; display: flex; justify-content: space-between; padding: 15px; border-top: 1px solid #444; }
            .cloudads-btn { cursor: pointer; font-weight: bold; padding: 5px 10px; border-radius: 4px; }
            .cloudads-close { color: #ff5252; border: 1px solid #ff5252; }
            .cloudads-open { color: #4caf50; border: 1px solid #4caf50; }
        `;
        document.head.appendChild(style);
    };

    function displayAd(config, selectedAd, triggerEvent) {
        const isFullscreen = !config.container;

        if (isFullscreen) {
            injectCSS();
            const adWrapper = document.createElement('div');
            adWrapper.id = 'cloudads-main-fs';
            adWrapper.innerHTML = `
                <div class="cloudads-fs-wrapper">
                    <div class="cloudads-header">Sponsored</div>
                    <div class="cloudads-body" id="ad-body-click">
                        <img src="${selectedAd.imageUrl()}" class="cloudads-img">
                    </div>
                    <div class="cloudads-footer">
                        <div class="cloudads-btn cloudads-close" id="ad-close-btn">CLOSE</div>
                        <div class="cloudads-btn cloudads-open" id="ad-open-btn">OPEN</div>
                    </div>
                </div>`;
            document.body.appendChild(adWrapper);

            const openLink = () => { window.open(selectedAd.clickUrl, '_blank'); };
            const closeAd = () => { document.body.removeChild(adWrapper); triggerEvent('close'); };

            document.getElementById('ad-body-click').onclick = openLink;
            document.getElementById('ad-open-btn').onclick = openLink;
            document.getElementById('ad-close-btn').onclick = closeAd;

        } else {
            // ব্যানার অ্যাড লজিক
            config.container.innerHTML = '';
            if (selectedAd.type === 'adsterra') {
                window.atOptions = { 'key': selectedAd.adsterraKey, 'format': 'iframe', 'height': 50, 'width': 320, 'params': {} };
                const script = document.createElement('script');
                script.src = selectedAd.adsterraSrc;
                config.container.appendChild(script);
            } else {
                const img = document.createElement('img');
                img.src = selectedAd.imageUrl();
                img.style.cssText = "width:100%; cursor:pointer; border-radius:5px;";
                img.onclick = () => window.open(selectedAd.clickUrl, '_blank');
                config.container.appendChild(img);
            }
        }
        triggerEvent('display');
    }

    window.getCloudAd = function (config) {
        setTimeout(() => {
            const targetInventory = !config.container ? fullscreenAds : bannerAds;
            const selectedAd = { ...targetInventory[Math.floor(Math.random() * targetInventory.length)] };
            
            const events = {};
            const triggerEvent = (name) => { if (events[name]) events[name](); };
            
            const adInstance = {
                on: (name, cb) => { events[name] = cb; },
                call: (cmd) => { if (cmd === 'display') displayAd(config, selectedAd, triggerEvent); }
            };
            if (config.onready) config.onready(adInstance);
        }, 500);
    };

})(window, document);

// সোশ্যাল বার অ্যাড লোড করা (আপনার দেওয়া লিঙ্ক অনুযায়ী)
(function() {
    const s1 = document.createElement('script');
    s1.src = 'https://smelthrsfranz.com/bb/07/10/bb071059998ee5789736f512369c69db.js';
    document.body.appendChild(s1);

    const s2 = document.createElement('script');
    s2.src = 'https://smelthrsfranz.com/6a/ee/70/6aee7076b0ab460344f62d8913d8b304.js';
    document.body.appendChild(s2);
})();
