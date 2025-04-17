import FingerprintJS from '@fingerprintjs/fingerprintjs';

let cachedFingerprint: string | null = null;

export const getDeviceFingerprint = async (): Promise<string> => {
  if (cachedFingerprint) {
    return cachedFingerprint;
  }

  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    
    // Thêm một số thông tin bổ sung để tăng độ chính xác
    const additionalData = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
    };

    // Kết hợp fingerprint với thông tin bổ sung
    cachedFingerprint = `${result.visitorId}-${JSON.stringify(additionalData)}`;
    return cachedFingerprint;
  } catch (error) {
    console.error('Error generating device fingerprint:', error);
    // Fallback to a basic fingerprint if FingerprintJS fails
    return `${navigator.userAgent}-${navigator.language}-${window.screen.width}x${window.screen.height}`;
  }
};

export const clearFingerprintCache = (): void => {
  cachedFingerprint = null;
};

// Sử dụng fingerprint để validate session
export const isValidSession = (storedFingerprint: string): Promise<boolean> => {
  return getDeviceFingerprint().then(currentFingerprint => 
    storedFingerprint === currentFingerprint
  );
};