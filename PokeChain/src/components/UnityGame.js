import React from 'react';
import { Unity, useUnityContext } from "react-unity-webgl";
import Navbar from './Navbar';
import Footer from './Footer';

const UnityGame = () => {
  const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl: "/assets/unity/Build/unity.loader.js",
    dataUrl: "/assets/unity/Build/unity.data",
    frameworkUrl: "/assets/unity/Build/unity.framework.js",
    codeUrl: "/assets/unity/Build/unity.wasm",
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Navbar />
      
      {/* Header Section */}
      <div className="w-full bg-[#4ECDC4] p-8 pt-32 border-y-2 border-black">
        <h1 className="text-4xl font-black text-center text-black">
          Decentralized Emulator
        </h1>
        <p className="text-center text-black mt-2 font-medium">
          Play your favorite Pokemon games in our decentralized environment
        </p>
      </div>

      {/* Game Container */}
      <div className="flex-grow flex justify-center items-center p-8">
        <div className="relative bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] 
                        p-4 transition-all duration-300 hover:shadow-none 
                        hover:translate-x-2 hover:translate-y-2">
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center 
                          bg-white border-2 border-black z-10">
              <div className="text-center">
                <p className="text-xl font-bold mb-2">Loading Game...</p>
                <div className="w-64 h-4 bg-gray-200 border-2 border-black">
                  <div 
                    className="h-full bg-[#4ECDC4]"
                    style={{ width: `${Math.round(loadingProgression * 100)}%` }}
                  ></div>
                </div>
                <p className="mt-2 font-medium">
                  {Math.round(loadingProgression * 100)}%
                </p>
              </div>
            </div>
          )}
          
          <Unity 
            unityProvider={unityProvider}
            style={{ 
              width: "960px", 
              height: "600px",
              visibility: isLoaded ? "visible" : "hidden"
            }}
          />
        </div>
      </div>

      {/* Game Instructions */}
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-[#FFE66D] border-2 border-black p-6 
                      shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-bold mb-4">How to Play</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Use arrow keys or WASD to move your character</li>
            <li>Press SPACE to interact with objects and NPCs</li>
            <li>Press ESC to open the menu</li>
            <li>Your progress is saved automatically to the blockchain</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UnityGame; 