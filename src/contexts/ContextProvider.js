import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

const initialState = {
  chat: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState('#e3af32');
  const [currentPOC, setCurrentPOC] = useState(null);
  const [pocs, setPocs] = useState([]);
  const [assets, setAssets] = useState([]);
  const [currentAssetType, setCurrentAssetType] = useState(null);
  const [currentAssetTypeAction, setCurrentAssetTypeAction] = useState(null);
  const [currentMode, setCurrentMode] = useState('Dark');
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [currentAsset, setCurrentAsset] = useState(null);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [countries, setCountries] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [currentSector, setCurrentSector] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [termsAndConditions, setTermsAndConditions] = useState([]);
  const [show, setShow] = useState(true);
  const [currentContract, setCurrentContract] = useState(null);
  const [bdr, setBdr] = useState(null);
  const [assetIssues, setAssetIssues] = useState([]);
  const [scannerBusy, setScannerBusy] = useState(false);
  const [decommissionedAssets, setDecommissionedAssets] = useState([]);

  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem('themeMode', e.target.value);
  };

  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem('colorMode', color);
  };

  const handleClick = (clicked) => setIsClicked({ ...initialState, [clicked]: true });

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider value={{
      currentColor,
      currentPOC,
      currentAssetType,
      currentAssetTypeAction,
      currentMode,
      activeMenu,
      screenSize,
      setScreenSize,
      handleClick,
      isClicked,
      initialState,
      setIsClicked,
      setActiveMenu,
      setCurrentColor,
      setCurrentPOC,
      setCurrentAssetType,
      setCurrentAssetTypeAction,
      setCurrentMode,
      setMode,
      setColor,
      themeSettings,
      setThemeSettings,
      sidebarCollapsed,
      setSidebarCollapsed,
      longitude,
      latitude,
      setLongitude,
      setLatitude,
      currentAsset,
      setCurrentAsset,
      user,
      setUser,
      userRole,
      setUserRole,
      countries,
      setCountries,
      permissions,
      setPermissions,
      dateRange,
      setDateRange,
      sectors,
      setSectors,
      currentSector,
      setCurrentSector,
      termsAndConditions,
      setTermsAndConditions,
      show,
      setShow,
      currentContract,
      setCurrentContract,
      pocs,
      setPocs,
      assets,
      setAssets,
      bdr,
      setBdr,
      assetIssues,
      setAssetIssues,
      scannerBusy,
      setScannerBusy,
      decommissionedAssets,
      setDecommissionedAssets,
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
