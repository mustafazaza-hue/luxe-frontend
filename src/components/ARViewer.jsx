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
  faInfoCircle
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
      }
    }
  }, [isOpen]);

  // تحميل مكتبة Model Viewer تلقائياً عند فتح AR
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      
      // Cleanup function
      const cleanup = () => {
        const scripts = document.querySelectorAll('script[src*="model-viewer"]');
        scripts.forEach(script => script.remove());
        window.modelViewerLoaded = false;
      };
      
      // تحميل مكتبة Model Viewer
      const loadModelViewer = () => {
        cleanup(); // تنظيف أي نسخ سابقة
        
        if (typeof window !== 'undefined' && !window.modelViewerLoaded) {
          const script = document.createElement('script');
          script.type = 'module';
          script.src = 'https://unpkg.com/@google/model-viewer@1.12.0/dist/model-viewer.min.js';
          script.crossOrigin = 'anonymous';
          script.onload = () => {
            window.modelViewerLoaded = true;
            console.log('Model Viewer loaded successfully');
            
            // إضافة شهادة SSL للـ WebXR على Android
            if (isAndroid && window.location.protocol !== 'https:') {
              console.warn('AR requires HTTPS on Android. Currently using:', window.location.protocol);
            }
            
            // تشغيل AR بعد تحميل المكتبة
            setTimeout(() => {
              activateAR();
            }, 800);
          };
          script.onerror = () => {
            console.error('Failed to load Model Viewer library');
            setError('Failed to load AR library. Please try again.');
            setLoading(false);
          };
          document.head.appendChild(script);
        } else {
          setTimeout(() => {
            activateAR();
          }, 500);
        }
      };

      loadModelViewer();
      
      // Cleanup on unmount
      return cleanup;
    }
  }, [isOpen]);

  // تشغيل AR مع تحسينات للـ Android
  const activateAR = () => {
    if (!product?.arGlb) {
      setError('No AR model available for this product');
      setLoading(false);
      return;
    }

    setLoading(false);
    
    // تأخير للتأكد من تحميل عنصر model-viewer
    setTimeout(() => {
      const modelViewer = document.querySelector('model-viewer');
      if (modelViewer) {
        
        // إعدادات خاصة للـ Android
        if (isAndroid) {
          modelViewer.setAttribute('ar', 'true');
          modelViewer.setAttribute('ar-modes', 'webxr scene-viewer');
          modelViewer.setAttribute('webxr', '');
          modelViewer.setAttribute('interaction-prompt', 'auto');
          
          // محاولة تفعيل AR تلقائياً
          setTimeout(() => {
            if (modelViewer.canActivateAR) {
              modelViewer.activateAR();
              setArMode(true);
            } else {
              // محاولة يدوية للزر
              try {
                const shadowRoot = modelViewer.shadowRoot;
                if (shadowRoot) {
                  const arButton = shadowRoot.querySelector('[ar-button], .ar-button');
                  if (arButton) {
                    arButton.click();
                    setArMode(true);
                    return;
                  }
                }
                
                // إذا فشل، إظهار تعليمات للمستخدم
                setError('AR requires manual activation on Android. Please tap the AR button when it appears.');
              } catch (err) {
                console.log('Error accessing shadow DOM:', err);
              }
            }
          }, 1500);
          
        } else {
          // إعدادات iOS والأنظمة الأخرى
          modelViewer.setAttribute('ar-modes', 'scene-viewer quick-look webxr');
          
          if (modelViewer.activateAR) {
            modelViewer.activateAR();
            setArMode(true);
          } else {
            setTimeout(() => {
              const arButton = document.querySelector('#auto-ar-button');
              if (arButton) arButton.click();
              setArMode(true);
            }, 1200);
          }
        }
      }
    }, 1000);
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
    
    // تنظيف وإغلاق
    const scripts = document.querySelectorAll('script[src*="model-viewer"]');
    scripts.forEach(script => script.remove());
    window.modelViewerLoaded = false;
    
    setTimeout(onClose, 300);
  };

  // كود الحالة الافتراضية عند عدم وجود مودل AR
  const defaultARModel = "/ar-models/glb/low_poly__sofa.glb";

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
          
          {/* إظهار معلومات تقنية للمستخدم */}
          <div className="bg-black/50 p-4 rounded-lg mb-4 max-w-md">
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faInfoCircle} className="text-[var(--luxury-gold)] mr-2" />
              <span className="text-white font-medium">Technical Info:</span>
            </div>
            <div className="text-white/70 text-sm space-y-1">
              <div>Device: {isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop'}</div>
              <div>Browser: {browser}</div>
              <div>WebXR Supported: {webXRSupported ? 'Yes' : 'No'}</div>
              <div>HTTPS: {window.location.protocol === 'https:' ? 'Yes' : 'No (required for Android AR)'}</div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
            >
              Close
            </button>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                setTimeout(activateAR, 500);
              }}
              className="bg-[var(--luxury-gold)] hover:bg-opacity-90 text-white px-6 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
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
            ar-modes={isAndroid ? "webxr scene-viewer" : "scene-viewer quick-look webxr"}
            ar-scale="fixed"
            camera-controls
            auto-rotate
            camera-orbit="0deg 75deg 105%"
            environment-image="neutral"
            exposure="1"
            shadow-intensity="1"
            interaction-prompt="auto"
            interaction-policy="allow-when-focused"
            style={{
              width: '100%',
              height: '100%',
              '--progress-bar-color': '#D4AF37',
              '--progress-bar-height': '3px',
              '--poster-color': 'transparent',
              '--ar-button-background': '#D4AF37',
              '--ar-button-color': '#000',
            }}
            autoplay
            xr-environment
          >
            {/* زر AR مخفي يتم الضغط عليه تلقائياً */}
            <button 
              slot="ar-button" 
              id="auto-ar-button"
              style={{ 
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                zIndex: '1000',
                backgroundColor: '#D4AF37',
                color: '#000',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: isAndroid ? 'block' : 'none'
              }}
              onClick={(e) => {
                e.preventDefault();
                const modelViewer = document.querySelector('model-viewer');
                if (modelViewer && modelViewer.activateAR) {
                  modelViewer.activateAR();
                  setArMode(true);
                }
              }}
            >
              {isAndroid ? 'TAP FOR AR' : 'LAUNCH AR'}
            </button>
            
            <div className="progress-bar" slot="progress-bar">
              <div className="update-bar"></div>
            </div>
          </model-viewer>

          {/* Instructions Overlay */}
          {arMode ? (
            <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-black/70 text-white p-4 rounded-xl max-w-sm text-center animate-pulse">
              <FontAwesomeIcon icon={faMobileAlt} className="text-xl mb-2" />
              <p className="font-medium">Move your device around to place the product</p>
              <p className="text-sm text-white/60 mt-1">Tap on surfaces to place the model</p>
            </div>
          ) : (
            <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-black/70 text-white p-4 rounded-xl max-w-sm text-center">
              <FontAwesomeIcon icon={faDesktop} className="text-xl mb-2" />
              {isAndroid ? (
                <>
                  <p className="font-medium">AR requires manual activation</p>
                  <p className="text-sm text-white/60 mt-1">
                    {webXRSupported 
                      ? 'Tap the yellow AR button to start' 
                      : 'Your browser may not support WebXR'
                    }
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium">AR will launch automatically</p>
                  <p className="text-sm text-white/60 mt-1">If not, tap the AR button in the viewer</p>
                </>
              )}
            </div>
          )}

          {/* Controls Panel */}
          <div className="absolute bottom-4 left-4 flex flex-col space-y-2">
            <button
              onClick={() => setScale(prev => Math.min(prev + 0.1, 2))}
              className="bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm"
              aria-label="Zoom in"
            >
              <FontAwesomeIcon icon={faArrowsAlt} />
            </button>
            <button
              onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
              className="bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm"
              aria-label="Zoom out"
            >
              <FontAwesomeIcon icon={faCompressAlt} />
            </button>
            {product?.arUsdz && isIOS && (
              <a
                href={product.arUsdz}
                download
                className="bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm"
                aria-label="Download USDZ for iOS"
              >
                <FontAwesomeIcon icon={faDownload} />
              </a>
            )}
          </div>

          {/* Device Specific Instructions */}
          <div className="absolute top-20 left-4 bg-black/60 text-white p-3 rounded-xl max-w-xs">
            <p className="font-medium text-sm mb-1">Instructions:</p>
            <ul className="text-xs space-y-1 text-white/80">
              {isIOS && (
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[var(--luxury-gold)] rounded-full mt-1 mr-2"></span>
                  <span>For best experience, use Safari on iOS</span>
                </li>
              )}
              {isAndroid && (
                <>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-[var(--luxury-gold)] rounded-full mt-1 mr-2"></span>
                    <span>Use Chrome 81+ for Android AR</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-[var(--luxury-gold)] rounded-full mt-1 mr-2"></span>
                    <span>HTTPS connection required</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-[var(--luxury-gold)] rounded-full mt-1 mr-2"></span>
                    <span>Tap the yellow AR button</span>
                  </li>
                </>
              )}
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[var(--luxury-gold)] rounded-full mt-1 mr-2"></span>
                <span>Allow camera access when prompted</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-[var(--luxury-gold)] rounded-full mt-1 mr-2"></span>
                <span>Move slowly for better tracking</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}