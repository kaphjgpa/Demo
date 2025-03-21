import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Wifi, WifiOff } from "lucide-react";

function Header() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="flex bg-gray-100 rounded-md min-h-32 max-h-32 m-4 mr-0 flex-1 items-center justify-between px-4">
      <div className="flex items-center">
        <Image
          className="rounded-full"
          src="/logo.jpg"
          width={100}
          height={100}
          alt="Band Logo"
        />
      </div>
      <div className="font-medium text-2xl flex items-center gap-2">
        {isOnline ? (
          <>
            <Wifi className="text-green-500" />{" "}
            <span className="text-green-500">Online</span>
          </>
        ) : (
          <>
            <WifiOff className="text-red-500" />{" "}
            <span className="text-red-500">Offline</span>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
