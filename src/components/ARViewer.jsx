"use client";

import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTimes, 
  faCube, 
  faMobileAlt,
  faDesktop,
  faSpinner,
  faExclamationTriangle,
  faDownload,
  faArrowsAlt,
  faCompressAlt,
  faInfoCircle,
  faCamera,
  faArrowRotateRight
} from "@fortawesome/free-solid-svg-icons";

export default function ARViewer({ product, isOpen, onClose }) {
  const [loading, setLoading] = useState(true);
  const [arMode, setArMode] = useState(false);
  const [error, setError] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [browser, setBrowser] = useState("");
  const [scale, setScale] = useState(1);
  const [webXRSupported, setWebXRSupported] = useState(false);
  const [requiresHTTPS, setRequiresHTTPS] = useState(false);
  const [manualActivation, setManualActivation] = useState(false);
  const modelViewerRef = useRef(null);
  
  // تحديد نوع الجهاز والمتصفح
  useEffect(() => {
    if (isOpen) {
      const ua = navigator.userAgent;
      const isIOSDevice = /iPad|iPhone|iPod/.test(ua);
      const isAndroidDevice = /Android/.test(ua);
      
      setIsIOS(isIOSDevice);
      setIsAndroid(isAndroidDevice);
      
      // تحديد المتصفح
      if (ua.includes("Chrome")) setBrowser("Chrome");
      else if (ua.includes("Safari") && !ua.includes("Chrome")) setBrowser("Safari");
      else if (ua.includes("Firefox")) setBrowser("Firefox");
      else if (ua.includes("Edge")) setBrowser("Edge");
      
      // التحقق من دعم WebXR
      if ('xr' in navigator) {
        navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
          setWebXRSupported(supported);
          console.log("WebXR supported:", supported);
        }).catch(() => setWebXRSupported(false));
      } else {
        setWebXRSupported(false);
      }
      
      // التحقق من HTTPS
      const isHTTPS = window.location.protocol === 'https:';
      if (isAndroid && !isHTTPS) {
        setRequiresHTTPS(true);
        setError('AR requires HTTPS on Android. Please access via HTTPS://');
      }
    }
  }, [isOpen]);

  // تحميل مكتبة Model Viewer
  useEffect(() => {
    if (isOpen && !requiresHTTPS) {
      setLoading(true);
      setError(null);
      setManualActivation(false);
      
      // Cleanup function
      const cleanup = () => {
        const scripts = document.querySelectorAll('script[src*="model-viewer"]');
        scripts.forEach(script => script.remove());
        window.modelViewerLoaded = false;
      };
      
      // تحميل مكتبة Model Viewer
      const loadModelViewer = () => {
        cleanup();
        
        if (typeof window !== 'undefined' && !window.modelViewerLoaded) {
          const script = document.createElement('script');
          script.type = 'module';
          script.src = 'https://unpkg.com/@google/model-viewer@1.12.0/dist/model-viewer.min.js';
          script.crossOrigin = 'anonymous';
          script.onload = () => {
            window.modelViewerLoaded = true;
            console.log('Model Viewer loaded successfully');
            setTimeout(() => {
              initializeARViewer();
            }, 500);
          };
          script.onerror = () => {
            console.error('Failed to load Model Viewer library');
            setError('Failed to load AR library. Please try again.');
            setLoading(false);
          };
          document.head.appendChild(script);
        } else {
          setTimeout(() => {
            initializeARViewer();
          }, 300);
        }
      };

      loadModelViewer();
      
      // Cleanup on unmount
      return cleanup;
    }
  }, [isOpen, requiresHTTPS]);

  // تهيئة AR Viewer
  const initializeARViewer = () => {
    if (!product?.arGlb) {
      setError('No AR model available for this product');
      setLoading(false);
      return;
    }

    setLoading(false);
    
    // تأخير للتأكد من تحميل العنصر
    setTimeout(() => {
      const modelViewer = document.querySelector('model-viewer');
      if (modelViewer) {
        console.log('Model Viewer element found');
        
        // إعدادات AR
        modelViewer.setAttribute('ar', 'true');
        modelViewer.setAttribute('ar-modes', isAndroid ? 'webxr scene-viewer' : 'scene-viewer quick-look');
        modelViewer.setAttribute('camera-controls', 'true');
        modelViewer.setAttribute('auto-rotate', 'true');
        modelViewer.setAttribute('interaction-prompt', 'when-focused');
        
        // إضافة حدث click للزر اليدوي
        const manualARButton = document.getElementById('manual-ar-button');
        if (manualARButton) {
          manualARButton.addEventListener('click', () => {
            try {
              if (modelViewer.activateAR) {
                modelViewer.activateAR();
                setArMode(true);
              }
            } catch (error) {
              console.error('Failed to activate AR:', error);
              setError('Failed to activate AR. Please check permissions.');
            }
          });
        }
        
        // محاولة تفعيل AR تلقائياً بعد تأخير
        setTimeout(() => {
          try {
            // محاولة الوصول إلى زر AR في shadow DOM
            const shadowRoot = modelViewer.shadowRoot;
            if (shadowRoot) {
              const arButton = shadowRoot.querySelector('[ar-button]');
              if (arButton) {
                console.log('AR button found in shadow DOM');
                arButton.click();
                setArMode(true);
                return;
              }
            }
            
            // إذا لم يتم العثور على زر، عرض زر يدوي
            setManualActivation(true);
            console.log('Manual activation required');
            
          } catch (error) {
            console.log('Error accessing shadow DOM:', error);
            setManualActivation(true);
          }
        }, 2000);
      } else {
        setError('Failed to initialize AR viewer');
        setLoading(false);
      }
    }, 1000);
  };

  // تفعيل AR يدوياً
  const handleManualActivate = () => {
    const modelViewer = document.querySelector('model-viewer');
    if (modelViewer) {
      try {
        modelViewer.activateAR();
        setArMode(true);
        setManualActivation(false);
      } catch (error) {
        console.error('Manual activation failed:', error);
        setError('Failed to activate AR. Please ensure camera permissions are granted.');
      }
    }
  };

  // إدارة زر الإغلاق
  const handleClose = () => {
    if (arMode) {
      const modelViewer = document.querySelector('model-viewer');
      if (modelViewer && modelViewer.dismissPoster) {
        modelViewer.dismissPoster();
      }
      setArMode(false);
    }
    
    // تنظيف
    const scripts = document.querySelectorAll('script[src*="model-viewer"]');
    scripts.forEach(script => script.remove());
    window.modelViewerLoaded = false;
    
    setTimeout(onClose, 300);
  };

  // إعادة المحاولة
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setManualActivation(false);
    
    setTimeout(() => {
      // إعادة تحميل المكتبة
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@google/model-viewer@1.12.0/dist/model-viewer.min.js';
      script.onload = () => {
        window.modelViewerLoaded = true;
        setTimeout(initializeARViewer, 500);
      };
      document.head.appendChild(script);
    }, 500);
  };

  // كود الحالة الافتراضية
  const defaultARModel = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-r from-black/80 to-purple-900/80 backdrop-blur-sm p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <FontAwesomeIcon icon={faCube} className="text-white text-xl" />
          <div>
            <h2 className="text-white font-bold text-lg">AR Experience</h2>
            <p className="text-white/80 text-sm">{product?.name || 'Product Preview'}</p>
          </div>
        </div>
        
        <button
          onClick={handleClose}
          className="bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          aria-label="Close AR viewer"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-40">
          <div className="w-16 h-16 border-4 border-white/30 border-t-[var(--luxury-gold)] rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg font-medium">Loading AR Experience...</p>
          <p className="text-white/60 text-sm mt-2">
            {isAndroid ? "Using WebXR for Android" : "Preparing AR environment"}
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-40">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-5xl mb-4" />
          <p className="text-white text-lg font-medium mb-2">AR Experience</p>
          <p className="text-white/60 text-center max-w-md mb-4">{error}</p>
          
          {/* إظهار معلومات تقنية */}
          <div className="bg-black/50 p-4 rounded-lg mb-4 max-w-md">
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faInfoCircle} className="text-[var(--luxury-gold)] mr-2" />
              <span className="text-white font-medium">Technical Info:</span>
            </div>
            <div className="text-white/70 text-sm space-y-1">
              <div>Device: {isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop'}</div>
              <div>Browser: {browser}</div>
              <div>WebXR Supported: {webXRSupported ? 'Yes' : 'No'}</div>
              <div>HTTPS: {window.location.protocol === 'https:' ? 'Yes' : 'No'}</div>
              <div>Protocol: {window.location.protocol}</div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleClose}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
            >
              Close
            </button>
            <button
              onClick={handleRetry}
              className="bg-[var(--luxury-gold)] hover:bg-opacity-90 text-white px-6 py-2 rounded-lg"
            >
              <FontAwesomeIcon icon={faArrowRotateRight} className="mr-2" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* زر التنشيط اليدوي */}
      {manualActivation && !loading && !error && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-50">
          <button
            id="manual-ar-button"
            onClick={handleManualActivate}
            className="bg-gradient-to-r from-[var(--luxury-gold)] to-[var(--luxury-copper)] text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-2xl animate-pulse flex items-center space-x-3"
          >
            <FontAwesomeIcon icon={faCamera} className="text-xl" />
            <span>CLICK TO ACTIVATE AR</span>
          </button>
        </div>
      )}

      {/* Main AR Viewer */}
      {!loading && !error && (
        <>
          <model-viewer
            ref={modelViewerRef}
            src={product?.arGlb || defaultARModel}
            alt={`AR Model of ${product?.name || 'Product'}`}
            ar
            ar-modes={isAndroid ? "webxr scene-viewer" : "scene-viewer quick-look"}
            ar-scale="auto"
            camera-controls
            auto-rotate
            camera-orbit="0deg 75deg 105%"
            environment-image="neutral"
            exposure="1"
            shadow-intensity="1"
            interaction-prompt="when-focused"
            style={{
              width: '100%',
              height: '100%',
              '--progress-bar-color': '#D4AF37',
              '--progress-bar-height': '3px',
              '--poster-color': 'transparent',
              '--ar-button-background': '#D4AF37',
              '--ar-button-color': '#000',
            }}
          >
            {/* زر AR مخفي للاستخدام اليدوي */}
            <button 
              slot="ar-button" 
              id="manual-ar-button"
              style={{ display: 'none' }}
            >
              Activate AR
            </button>
          </model-viewer>

          {/* Instructions Overlay */}
          {arMode ? (
            <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-black/70 text-white p-4 rounded-xl max-w-sm text-center animate-pulse">
              <FontAwesomeIcon icon={faMobileAlt} className="text-xl mb-2" />
              <p className="font-medium">Move your device around to place the product</p>
              <p className="text-sm text-white/60 mt-1">Tap on surfaces to place the model</p>
            </div>
          ) : manualActivation ? (
            <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-black/70 text-white p-4 rounded-xl max-w-sm text-center">
              <FontAwesomeIcon icon={faDesktop} className="text-xl mb-2" />
              <p className="font-medium">Click the yellow button to activate AR</p>
              <p className="text-sm text-white/60 mt-1">Make sure to allow camera access</p>
            </div>
          ) : (
            <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-black/70 text-white p-4 rounded-xl max-w-sm text-center">
              <FontAwesomeIcon icon={faDesktop} className="text-xl mb-2" />
              <p className="font-medium">AR is loading...</p>
              <p className="text-sm text-white/60 mt-1">Please wait a moment</p>
            </div>
          )}

          {/* Device Specific Instructions */}
          <div className="absolute top-20 left-4 bg-black/60 text-white p-3 rounded-xl max-w-xs">
            <p className="font-medium text-sm mb-1">Instructions:</p>
            <ul className="text-xs space-y-1 text-white/80">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[var(--luxury-gold)] rounded-full mt-1 mr-2"></span>
                <span>Allow camera access when prompted</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[var(--luxury-gold)] rounded-full mt-1 mr-2"></span>
                <span>Move slowly for better tracking</span>
              </li>
              {requiresHTTPS && (
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-1 mr-2"></span>
                  <span className="text-red-300">HTTPS required for Android AR</span>
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}