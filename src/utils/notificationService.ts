// Audio chime using Web Audio API (cross-browser, no external mp3 needed)
export function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    
    // High-clarity double chime (E5 -> B5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now); // E5
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.12); // B5
    gain2.gain.setValueAtTime(0.3, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch (e) {
    // Audio context may be restricted by device policy
  }
}

// Request Notification Permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (e) {
    return 'default';
  }
}

// Check current permission state
export function getNotificationPermissionState(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

// Send system or service worker notification + dispatch in-app event
export async function sendPushNotification(title: string, body: string, iconUrl = '/logo.jpg'): Promise<boolean> {
  // Always trigger sound & in-app banner for guaranteed delivery
  playNotificationSound();

  // Dispatch in-app alert banner event
  try {
    window.dispatchEvent(new CustomEvent('app_push_alert', {
      detail: {
        id: `push-${Date.now()}`,
        title,
        body,
        time: new Date().toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit' })
      }
    }));
  } catch (e) {
    console.warn('Dispatch event failed:', e);
  }

  // 1. Android & PWA: Service Worker Notification (Most reliable for mobile)
  if ('serviceWorker' in navigator) {
    try {
      const reg = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 1000))
      ]);

      if (reg && 'showNotification' in reg) {
        await reg.showNotification(title, {
          body,
          icon: iconUrl,
          badge: iconUrl,
          dir: 'rtl',
          lang: 'ar',
          vibrate: [200, 100, 200, 100, 200],
          tag: `dalili-alert-${Date.now()}`,
          renotify: true
        } as NotificationOptions);
        return true;
      }
    } catch (e) {
      console.warn('Service worker notification failed:', e);
    }
  }

  // 2. Standard Notification API fallback (Desktop / Safari)
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: iconUrl,
        dir: 'rtl',
        lang: 'ar',
        tag: `dalili-${Date.now()}`
      });
      return true;
    } catch (e) {
      console.warn('Standard Notification API fallback failed:', e);
    }
  }

  return false;
}
