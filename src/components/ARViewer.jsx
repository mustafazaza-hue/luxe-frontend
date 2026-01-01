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
  faCompressAlt
} from "@fortawesome/free-solid-svg-icons";

export default function ARViewer({ product, isOpen, onClose }) {
  const [loading, setLoading] = useState(true);
  const [arMode, setArMode] = useState(false);
  const [error, setError] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [scale, setScale] = useState(1);
  const modelViewerRef = useRef(null);
  
  // تحديد نوع الجهاز
  useEffect(() => {
    if (isOpen) {
      const ua = navigator.userAgent;
      setIsIOS(/iPad|iPhone|iPod/.test(ua));
      setIsAndroid(/Android/.test(ua));
    }
  }, [isOpen]);

  // تحميل مكتبة Model Viewer تلقائياً عند فتح AR
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setArMode(false);
      
      // تحميل مكتبة Model Viewer
      const loadModelViewer = () => {
        if (typeof window !== 'undefined' && !window.modelViewerLoaded) {
          const script = document.createElement('script');
          script.type = 'module';
          script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
          script.onload = () => {
            window.modelViewerLoaded = true;
            // تأخير بسيط ثم تشغيل AR تلقائياً
            setTimeout(() => {
              activateAR();
            }, 500);
          };
          script.onerror = () => {
            console.error('Failed to load Model Viewer library');
            setError('Failed to load AR library. Please try again.');
            setLoading(false);
          };
          document.head.appendChild(script);
        } else {
          // إذا المكتبة محملة مسبقاً، تشغيل AR مباشرة
          setTimeout(() => {
            activateAR();
          }, 300);
        }
      };

      loadModelViewer();
    }
  }, [isOpen]);

  // تشغيل AR تلقائياً
  const activateAR = () => {
    if (!product?.arGlb) {
      setError('No AR model available for this product');
      setLoading(false);
      return;
    }

    setLoading(false);
    
    // استخدام timeout للتأكد من تحميل عنصر model-viewer
    setTimeout(() => {
      const modelViewer = document.querySelector('model-viewer');
      if (modelViewer) {
        if (modelViewer.activateAR) {
          modelViewer.activateAR();
          setArMode(true);
        } else {
          // محاولة إيجاد زر AR وإضغاطه تلقائياً
          const shadowRoot = modelViewer.shadowRoot;
          if (shadowRoot) {
            const arButton = shadowRoot.querySelector('[ar-button], .ar-button, button[slot="ar-button"]');
            if (arButton) {
              arButton.click();
              setArMode(true);
            }
          }
          
          // محاولة أخرى للزر
          const arButton = modelViewer.querySelector('[slot="ar-button"], .ar-button');
          if (arButton) {
            arButton.click();
            setArMode(true);
          }
        }
      }
    }, 1000);
  };

  // إدارة زر الإغلاق
  const handleClose = () => {
    if (arMode) {
      // محاولة إغلاق وضع AR أولاً
      const modelViewer = document.querySelector('model-viewer');
      if (modelViewer && modelViewer.dismissPoster) {
        modelViewer.dismissPoster();
      }
      setArMode(false);
      setTimeout(onClose, 300);
    } else {
      onClose();
    }
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
          <p className="text-white/60 text-sm mt-2">AR will launch automatically</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-40">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-5xl mb-4" />
          <p className="text-white text-lg font-medium mb-2">AR Unavailable</p>
          <p className="text-white/60 text-center max-w-md mb-6">{error}</p>
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
            >
              Close
            </button>
            <button
              onClick={activateAR}
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
            ar-modes="scene-viewer quick-look webxr"
            ar-scale="fixed"
            camera-controls
            auto-rotate
            camera-orbit="0deg 75deg 105%"
            environment-image="neutral"
            exposure="1"
            shadow-intensity="1"
            style={{
              width: '100%',
              height: '100%',
              '--progress-bar-color': '#D4AF37',
              '--progress-bar-height': '3px',
              '--poster-color': 'transparent',
            }}
            // إعدادات إضافية لتفعيل AR تلقائياً
        
            autoplay
            xr-environment
          >
            {/* زر AR مخفي يتم الضغط عليه تلقائياً */}
            <button 
              slot="ar-button" 
              id="auto-ar-button"
              style={{ display: 'none' }}
            >
              Launch AR
            </button>
            
            {/* Progress Bar Customization */}
            <div className="progress-bar" slot="progress-bar">
              <div className="update-bar" style={{ 
                backgroundColor: '#D4AF37',
                height: '3px'
              }}></div>
            </div>
            
            {/* Custom AR Button with Auto-click */}
            <script type="module">
              {`
                setTimeout(() => {
                  const modelViewer = document.querySelector('model-viewer');
                  if (modelViewer) {
                    // محاولة تفعيل AR تلقائياً
                    setTimeout(() => {
                      const arButton = modelViewer.shadowRoot?.querySelector('[ar-button]');
                      if (arButton) {
                        arButton.click();
                      }
                    }, 1000);
                  }
                }, 500);
              `}
            </script>
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
              <p className="font-medium">AR will launch automatically</p>
              <p className="text-sm text-white/60 mt-1">If not, tap the AR button in the viewer</p>
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
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[var(--luxury-gold)] rounded-full mt-1 mr-2"></span>
                  <span>Use Chrome for Android AR</span>
                </li>
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