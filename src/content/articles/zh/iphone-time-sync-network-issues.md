---
title: iPhone 圖片載入不出來，問題竟然是時間快了 30 秒
description: iPhone 的網路、DNS 和下載都正常，圖片卻無法顯示；最後在 time.is 發現時間快了 30.1 秒，開啟自動設定後恢復正常。
lang: zh
articleSlug: iphone-time-sync-network-issues
translationKey: iphone-time-sync-network-issues
category: 疑難排解
publishedAt: 2026-09-13
draft: false
featured: false
---

今天用 iPhone 上網時，我遇到一個很奇怪的問題：網頁上的圖片一直載入不出來。

我先檢查了網路連線和 DNS，也測試了下載，結果都沒有問題。明明網路可以正常使用，圖片卻始終無法顯示。

後來，我打開 [time.is](https://time.is)，才發現 iPhone 的時間竟然比實際時間快了 **30.1 秒**。

<div class="article-screenshot-pair" role="group" aria-label="校準前的 time.is 與 iPhone 日期和時間設定">
  <figure class="article-figure">
    <a href="/articles/iphone-time-sync-network-issues/time-is-30-seconds-ahead.jpg" target="_blank" rel="noopener noreferrer">
      <img src="/articles/iphone-time-sync-network-issues/time-is-30-seconds-ahead.jpg" alt="time.is 顯示 iPhone 時鐘快了 30.1 秒" width="1290" height="2796" loading="lazy" decoding="async" />
    </a>
    <figcaption>time.is 顯示 iPhone 時鐘快了 30.1 秒。點圖可查看原始尺寸。</figcaption>
  </figure>
  <figure class="article-figure">
    <a href="/articles/iphone-time-sync-network-issues/automatic-time-off-singapore.jpg" target="_blank" rel="noopener noreferrer">
      <img src="/articles/iphone-time-sync-network-issues/automatic-time-off-singapore.jpg" alt="iPhone 日期與時間設定中，自動設定已關閉，時區為 Singapore" width="1290" height="2796" loading="lazy" decoding="async" />
    </a>
    <figcaption>當時「自動設定」處於關閉狀態，時區設為 Singapore。</figcaption>
  </figure>
</div>

## 為什麼時間不同步會影響圖片載入？

手機時間不只是拿來顯示幾點。登入權杖、Cookie、憑證，以及部分圖片或檔案使用的限時簽名網址，都可能涉及「何時生效」與「何時過期」的判斷。

有些圖片並不是永久公開的網址，而是由網站、CDN 或物件儲存服務產生一個只在短時間內有效的連結。如果裝置上的時鐘偏快，網站或 App 的客戶端程式可能提早把權杖或網址判定為過期；帶有時間戳記的請求，也可能落在服務允許的時間範圍之外。這時網路和 DNS 仍然正常，但圖片請求可能被拒絕，所以看起來就像「只有圖片壞了」。

這種機制不是猜想：AWS 的官方文件說明，S3 會在收到請求時檢查簽名網址的到期時間，也提醒即使是很小的時鐘偏差，也可能讓簽名驗證失敗。[AWS：預簽署網址與到期時間](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html)

不過，我沒有保留當時圖片請求的錯誤碼，因此無法確認這次究竟是哪一層驗證失敗。可以確認的是：iPhone 時鐘快了 30.1 秒，而完成時間同步後，原本無法載入的圖片立即恢復正常。

## 開啟自動設定後，圖片恢復了

我進入 iPhone 的「設定」→「一般」→「日期與時間」，打開「自動設定」，讓系統重新取得日期、時間與時區。

設定完成後，時區從 Singapore 更新為 Beijing。再次查看 time.is，時間差異已縮小到 **-0.007 秒**，原本無法載入的圖片也恢復正常顯示。

<div class="article-screenshot-pair" role="group" aria-label="開啟自動設定後的 iPhone 日期和時間設定與 time.is 結果">
  <figure class="article-figure">
    <a href="/articles/iphone-time-sync-network-issues/automatic-time-on-beijing.jpg" target="_blank" rel="noopener noreferrer">
      <img src="/articles/iphone-time-sync-network-issues/automatic-time-on-beijing.jpg" alt="iPhone 日期與時間設定中，自動設定已開啟，時區顯示 Beijing" width="359" height="780" loading="lazy" decoding="async" />
    </a>
    <figcaption>開啟「自動設定」後，iPhone 重新取得日期、時間與時區。</figcaption>
  </figure>
  <figure class="article-figure">
    <a href="/articles/iphone-time-sync-network-issues/time-is-synchronized.jpg" target="_blank" rel="noopener noreferrer">
      <img src="/articles/iphone-time-sync-network-issues/time-is-synchronized.jpg" alt="time.is 顯示 iPhone 時間準確，差異為負 0.007 秒" width="359" height="780" loading="lazy" decoding="async" />
    </a>
    <figcaption>再次檢查時，time.is 顯示差異只剩 -0.007 秒。</figcaption>
  </figure>
</div>

Apple 的 iPhone 使用手冊也將日期與時間設定放在「設定」→「一般」→「日期與時間」，並說明 iPhone 的時區可以由系統自動設定。[Apple：更改 iPhone 的日期與時間](https://support.apple.com/guide/iphone/change-the-date-and-time-iph65f82af3e/ios)

## 時區相同，不代表時間已同步

有些軟體會偵測裝置時區，因此使用時可能需要將 iPhone 的時區改成 Singapore 或 Taipei。中國大陸、新加坡和台北目前同為 UTC+8，所以切換後，畫面上的小時和分鐘看起來通常沒有變化。

但「時區」和「時間同步」是兩件事：

- **時區**決定同一個時刻在當地顯示成幾點。
- **時間同步**決定手機時鐘與標準時間之間有沒有秒數偏差。

把時區設為 Singapore 或 Taipei，本身不會直接讓手機快 30 秒；真正容易被忽略的是，調整時區時可能關閉了「自動設定」，之後手機時間沒有持續校準。即使時區同為 UTC+8，時鐘仍可能慢慢產生偏差。

## 下次遇到類似問題，可以先做這三步

1. 打開 [time.is](https://time.is)，查看手機時間是否有明顯偏差。
2. 前往「設定」→「一般」→「日期與時間」，開啟「自動設定」。
3. 回到原本的 App 或網頁重新整理，確認圖片和其他資源是否恢復。

如果問題仍然存在，再繼續檢查網路、DNS、代理伺服器、VPN、快取或服務本身的狀態。

下次遇到「網路明明正常，圖片卻載入不出來」的情況，別忘了看一眼 iPhone 的時間。問題有時不在網速，而是藏在平常不會注意的那幾十秒裡。
