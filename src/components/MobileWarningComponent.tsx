import { useState, useEffect } from "react";

export function MobileWarning({ onContinue }: { onContinue: () => {} }) {
  return (
    <div className="flex items-center justify-center min-h-screen px-5 bg-gray-900">
      <div className="max-w-md text-center p-8 bg-gray-800 rounded-xl shadow-2xl">
        <div className="text-5xl mb-6">⚠️</div>
        
        <h2 className="text-2xl font-bold text-white mb-5">
          Aviso Importante
        </h2>
        
        <p className="text-gray-300 leading-relaxed mb-4">
          Este software utiliza <strong className="text-white">renderização e animações 3D</strong> e 
          pode ser muito pesado para dispositivos móveis, podendo causar travamentos ou 
          lentidão.
        </p>
        
        <p className="text-gray-300 leading-relaxed mb-8">
          <strong className="text-white">Recomendo fortemente</strong> que você acesse 
          este aplicativo em um <strong className="text-white">notebook ou computador desktop</strong> para 
          ter a melhor experiência possível.
        </p>
        
        <button
          onClick={onContinue}
          className="w-full py-3 px-6 text-base font-bold bg-red-500 text-white rounded-lg 
                     hover:bg-red-600 active:bg-red-700 transition-colors duration-200"
        >
          Entendo, continuar mesmo assim
        </button>
      </div>
    </div>
  );
}

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword));
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 1024;
      
      return (isMobileDevice || isTouchDevice) && isSmallScreen;
    };

    setIsMobile(checkMobile());
  }, []);

  return isMobile;
}