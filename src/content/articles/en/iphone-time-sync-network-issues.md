---
title: My iPhone would not load images because its clock was 30 seconds fast
description: My iPhone had a working connection, DNS, and downloads, but images would not load. time.is revealed a 30.1-second clock error, and automatic time fixed it.
lang: en
articleSlug: iphone-time-sync-network-issues
translationKey: iphone-time-sync-network-issues
category: Troubleshooting
publishedAt: 2026-09-13
draft: false
featured: false
---

I ran into a strange problem while browsing on my iPhone today: images on a webpage would not load.

I checked the network connection and DNS, then tested a download. Everything appeared to be working, but the images still refused to display.

I eventually opened [time.is](https://time.is) and found the clue: my iPhone clock was **30.1 seconds ahead**.

<div class="article-screenshot-pair" role="group" aria-label="time.is and iPhone Date and Time settings before synchronization">
  <figure class="article-figure">
    <a href="/articles/iphone-time-sync-network-issues/time-is-30-seconds-ahead.jpg" target="_blank" rel="noopener noreferrer">
      <img src="/articles/iphone-time-sync-network-issues/time-is-30-seconds-ahead.jpg" alt="time.is reporting that the iPhone clock is 30.1 seconds ahead" width="1290" height="2796" loading="lazy" decoding="async" />
    </a>
    <figcaption>time.is reported that the iPhone clock was 30.1 seconds ahead. Open the image to see it at full size.</figcaption>
  </figure>
  <figure class="article-figure">
    <a href="/articles/iphone-time-sync-network-issues/automatic-time-off-singapore.jpg" target="_blank" rel="noopener noreferrer">
      <img src="/articles/iphone-time-sync-network-issues/automatic-time-off-singapore.jpg" alt="iPhone Date and Time settings with Set Automatically off and the time zone set to Singapore" width="1290" height="2796" loading="lazy" decoding="async" />
    </a>
    <figcaption>Set Automatically was off, and the time zone was set to Singapore.</figcaption>
  </figure>
</div>

## Why can an incorrect clock break image loading?

Your phone's clock does more than display the time. Sign-in tokens, cookies, certificates, and time-limited signed links for images or files may all depend on checks for when something becomes valid or expires.

Some images do not use permanent public URLs. A website, CDN, or object-storage service may issue a link that works for only a short period. If the device clock is fast, client-side code in the website or app may decide that a token or URL has already expired. A timestamped request can also fall outside a service's accepted time window. The network and DNS can still work normally while the image request itself is rejected, making it look as though only the images are broken.

This is a documented failure mode. AWS explains that S3 checks a signed URL's expiration time when it receives a request and warns that even small clock differences can invalidate signatures. [AWS: Download and upload objects with presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html)

I did not save the failed image request's error code, so I cannot identify the exact validation layer that failed in this case. What I could verify was simple: the iPhone clock was 30.1 seconds fast, and the images began loading immediately after I synchronized it.

## The images returned after I enabled automatic time

I opened Settings → General → Date & Time and enabled Set Automatically, allowing iOS to refresh the date, time, and time zone.

The time zone changed from Singapore to Beijing. When I checked time.is again, the difference had fallen to **-0.007 seconds**, and the missing images displayed normally.

<div class="article-screenshot-pair" role="group" aria-label="iPhone Date and Time settings and time.is after synchronization">
  <figure class="article-figure">
    <a href="/articles/iphone-time-sync-network-issues/automatic-time-on-beijing.jpg" target="_blank" rel="noopener noreferrer">
      <img src="/articles/iphone-time-sync-network-issues/automatic-time-on-beijing.jpg" alt="iPhone Date and Time settings with Set Automatically on and the time zone showing Beijing" width="359" height="780" loading="lazy" decoding="async" />
    </a>
    <figcaption>After I enabled Set Automatically, the iPhone refreshed its date, time, and time zone.</figcaption>
  </figure>
  <figure class="article-figure">
    <a href="/articles/iphone-time-sync-network-issues/time-is-synchronized.jpg" target="_blank" rel="noopener noreferrer">
      <img src="/articles/iphone-time-sync-network-issues/time-is-synchronized.jpg" alt="time.is reporting that the iPhone time is exact, with a difference of minus 0.007 seconds" width="359" height="780" loading="lazy" decoding="async" />
    </a>
    <figcaption>On the second check, time.is reported a difference of just -0.007 seconds.</figcaption>
  </figure>
</div>

Apple places these controls under Settings → General → Date & Time and explains that iPhone can set its time zone automatically. [Apple: Change the date and time on iPhone](https://support.apple.com/guide/iphone/change-the-date-and-time-iph65f82af3e/ios)

## The same time zone does not mean the clock is synchronized

Some software checks the device's time zone, so you may occasionally change an iPhone to Singapore or Taipei before using it. Mainland China, Singapore, and Taipei currently use UTC+8, so the displayed hour and minute usually look unchanged after switching between them.

Time zone and time synchronization are separate settings:

- **Time zone** determines how a moment is displayed locally.
- **Time synchronization** determines whether the phone's clock matches standard time down to the seconds.

Choosing Singapore or Taipei does not directly make an iPhone run 30 seconds fast. The easy-to-miss part is that changing the time zone may involve turning off Set Automatically. If it stays off, the phone no longer keeps correcting the manually set clock, so it can drift even though the selected time zone is still UTC+8.

## Three checks to try next time

1. Open [time.is](https://time.is) and check whether the phone clock has a noticeable offset.
2. Go to Settings → General → Date & Time and enable Set Automatically.
3. Return to the app or webpage, reload it, and see whether the images and other resources return.

If the problem remains, continue checking the connection, DNS, proxy, VPN, cache, and the service's own status.

The next time your network appears healthy but images will not load, remember to check the iPhone clock. Sometimes the fault is hiding in a few seconds that you would never notice by glancing at the status bar.
