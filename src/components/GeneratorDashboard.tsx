/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import JSZip from "jszip";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Download, 
  RefreshCw, 
  FileText, 
  Layers, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  Sliders, 
  Shuffle, 
  Info, 
  CreditCard, 
  Phone, 
  FileSpreadsheet, 
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Eye,
  Laptop,
  Building2,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import DocumentCanvas, { DocType, BackgroundStyle, CustomOverlay, getCanvasDimensions } from "./DocumentCanvas";
import { 
  generateMockBusinessLicense, 
  generateMockResidentIdCard, 
  generateMockHKBR, 
  generateMockHomeReturnPermit,
  generateCitizenIdNumber,
  generateSocialCreditCode,
  generatePhoneNumber,
  generateHKBRNumber,
  generateHKCRNumber,
  generateHomeReturnPermitNumber,
  generateBankCardNumber,
  generateEnterpriseName,
  generateEnterpriseNameOnly,
  EnterpriseNamingStyle,
  BusinessLicenseFields,
  ResidentIdCardFields,
  HKBusinessRegistrationFields,
  HomeReturnPermitFields
} from "../utils/generators";

// Define local persistence keys if we want to save previous configurations
type ActiveTab = "one_click" | "custom_design" | "code_generator";

export default function GeneratorDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("one_click");

  // --- ONE-CLICK STATE ---
  const [oneClickLicense, setOneClickLicense] = useState<BusinessLicenseFields | null>(null);
  const [oneClickIdFront, setOneClickIdFront] = useState<ResidentIdCardFields | null>(null);
  const [oneClickIdBack, setOneClickIdBack] = useState<ResidentIdCardFields | null>(null);
  const [oneClickActiveDoc, setOneClickActiveDoc] = useState<DocType>("mainland_business_license");
  const [oneClickBackgroundStyle, setOneClickBackgroundStyle] = useState<BackgroundStyle>("paper");
  const [oneClickNamingStyle, setOneClickNamingStyle] = useState<EnterpriseNamingStyle>("all");
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [isZipping, setIsZipping] = useState(false);

  // --- CUSTOM DESIGN STATE ---
  const [customDocType, setCustomDocType] = useState<DocType>("mainland_business_license");
  const [customFields, setCustomFields] = useState<any>({});
  const [customBackgroundStyle, setCustomBackgroundStyle] = useState<BackgroundStyle>("scan");
  const [overlays, setOverlays] = useState<CustomOverlay[]>([]);
  const [selectedOverlayId, setSelectedOverlayId] = useState<string | null>(null);

  // --- CODE GENERATOR STATE ---
  const [singleCodes, setSingleCodes] = useState({
    enterpriseName: "",
    uscc: "",
    idCard: "",
    phone: "",
    hkBr: "",
    hkCr: "",
    homeReturn: "",
    bankCard: ""
  });
  
  const [bulkType, setBulkType] = useState<keyof typeof singleCodes>("enterpriseName");
  const [bulkCount, setBulkCount] = useState<number>(20);
  const [bulkOutput, setBulkOutput] = useState<string>("");

  // Initialize data on mount
  useEffect(() => {
    handleGenerateOneClickSuite();
    handleRandomizeCustomFields("mainland_business_license");
    handleGenerateSingleCodes();
  }, []);

  // Sync state when custom document type changes
  useEffect(() => {
    handleRandomizeCustomFields(customDocType);
    setOverlays([]);
    setSelectedOverlayId(null);
  }, [customDocType]);

  // Handle Clipboard Copy visual feedback
  const triggerCopyFeedback = (key: string) => {
    setCopiedStates((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [key]: false }));
    }, 1500);
  };

  // --- GENERATOR LOGIC HANDLERS ---

  // 1. One-Click suite generator with anti-collision high-entropy engine
  const handleGenerateOneClickSuite = (styleOverride?: EnterpriseNamingStyle) => {
    const style = styleOverride || oneClickNamingStyle;
    // Generate Business License first with guaranteed unique name
    const license = generateMockBusinessLicense(style);
    const division = license._meta?.division;
    
    // Create matching ID Front where name matches legal representative of business license
    const idFront = generateMockResidentIdCard("M", division, license.legalRep);
    
    // Extract district/city matching details so authority aligns perfectly
    const idBack = generateMockResidentIdCard("M", division, license.legalRep);
    idBack.authority = `${license.registrationAuthority.replace("市场监督管理局", "公安局")}`;
    idBack.validityStart = "2020.06.12";
    idBack.validityEnd = "2040.06.12";

    setOneClickLicense(license);
    setOneClickIdFront(idFront);
    setOneClickIdBack(idBack);
  };

  // 1.1 Dedicated Anti-Collision Enterprise Name Regenerator (Only changes enterprise name & matching location/USCC, keeps legal rep)
  const handleRegenerateOneClickEnterpriseName = () => {
    if (!oneClickLicense) return;
    const newEnt = generateEnterpriseName(oneClickNamingStyle);
    const newUSCC = generateSocialCreditCode(newEnt.division.code);
    const roomNum = `${Math.floor(Math.random() * 3 + 1)}栋${Math.floor(Math.random() * 2000 + 101)}室`;
    const newAddress = `${newEnt.division.addressPrefix}${Math.floor(Math.random() * 888 + 1)}号${roomNum}`;
    const newAuth = `${newEnt.division.city}${newEnt.division.district}市场监督管理局`;

    setOneClickLicense((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        uscc: newUSCC,
        name: newEnt.fullName,
        address: newAddress,
        businessScope: newEnt.scope,
        registrationAuthority: newAuth,
        _meta: {
          brandName: newEnt.brandName,
          division: newEnt.division,
          industry: newEnt.industry,
          structure: newEnt.structure
        }
      };
    });

    // Sync authority on ID Back
    setOneClickIdBack((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        authority: `${newEnt.division.city}公安局${newEnt.division.district}分局`
      };
    });

    triggerCopyFeedback("reRollNameToast");
  };

  // 2. Custom designer randomizer
  const handleRandomizeCustomFields = (type: DocType) => {
    let mockData: any = {};
    switch (type) {
      case "mainland_business_license":
        mockData = generateMockBusinessLicense("all");
        break;
      case "mainland_id_front":
        mockData = generateMockResidentIdCard();
        break;
      case "mainland_id_back":
        // Needs a corresponding ID card template fields
        const temp = generateMockResidentIdCard();
        mockData = {
          authority: temp.authority,
          validityStart: temp.validityStart,
          validityEnd: temp.validityEnd
        };
        break;
      case "hk_business_registration":
        mockData = generateMockHKBR();
        break;
      case "hk_home_return_permit":
      case "hk_home_return_permit_back":
        mockData = generateMockHomeReturnPermit();
        break;
    }
    setCustomFields(mockData);
  };

  // 3. Single Codes Randomizer
  const handleGenerateSingleCodes = () => {
    setSingleCodes({
      enterpriseName: generateEnterpriseNameOnly(oneClickNamingStyle),
      uscc: generateSocialCreditCode(),
      idCard: generateCitizenIdNumber(),
      phone: generatePhoneNumber(),
      hkBr: generateHKBRNumber(),
      hkCr: generateHKCRNumber(),
      homeReturn: generateHomeReturnPermitNumber(),
      bankCard: generateBankCardNumber()
    });
  };

  // Generate specific individual code
  const handleRegenerateCode = (key: keyof typeof singleCodes) => {
    let val = "";
    switch (key) {
      case "enterpriseName": val = generateEnterpriseNameOnly(oneClickNamingStyle); break;
      case "phone": val = generatePhoneNumber(); break;
      case "idCard": val = generateCitizenIdNumber(); break;
      case "uscc": val = generateSocialCreditCode(); break;
      case "hkBr": val = generateHKBRNumber(); break;
      case "hkCr": val = generateHKCRNumber(); break;
      case "homeReturn": val = generateHomeReturnPermitNumber(); break;
      case "bankCard": val = generateBankCardNumber(); break;
    }
    setSingleCodes((prev) => ({ ...prev, [key]: val }));
  };

  // Copy code utility
  const handleCopyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    triggerCopyFeedback(key);
  };

  // 4. Bulk Code Generator
  const handleGenerateBulkCodes = () => {
    const list: string[] = [];
    const count = Math.min(200, Math.max(1, bulkCount));
    
    for (let i = 0; i < count; i++) {
      let code = "";
      switch (bulkType) {
        case "enterpriseName": code = generateEnterpriseNameOnly(); break;
        case "phone": code = generatePhoneNumber(); break;
        case "idCard": code = generateCitizenIdNumber(); break;
        case "uscc": code = generateSocialCreditCode(); break;
        case "hkBr": code = generateHKBRNumber(); break;
        case "hkCr": code = generateHKCRNumber(); break;
        case "homeReturn": code = generateHomeReturnPermitNumber(); break;
        case "bankCard": code = generateBankCardNumber(); break;
      }
      list.push(code);
    }
    
    setBulkOutput(list.join("\n"));
  };

  // --- DOWNLOAD CANVAS UTILITY ---

  const downloadCanvasAsImage = (canvasId: string, filename: string) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) {
      alert("无法定位证件预览，请先确认预览是否加载。");
      return;
    }
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = dataURL;
    link.click();
  };

  const downloadAllOneClickSuite = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const items = [
        { id: "ocr-canvas-mainland_business_license", name: "01_中国大陆企业营业执照" },
        { id: "ocr-canvas-mainland_id_front", name: "02_法人身份证_个人信息面" },
        { id: "ocr-canvas-mainland_id_back", name: "03_法人身份证_国徽面" }
      ];

      let count = 0;
      for (const item of items) {
        const canvas = document.getElementById(item.id) as HTMLCanvasElement | null;
        if (canvas) {
          const dataURL = canvas.toDataURL("image/png");
          const base64Data = dataURL.split(",")[1];
          zip.file(`${item.name}.png`, base64Data, { base64: true });
          count++;
        }
      }

      if (count === 0) {
        alert("无法定位证件预览，请先确认预览是否加载。");
        setIsZipping(false);
        return;
      }

      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.download = "一键基础材料全部打包.zip";
      link.href = URL.createObjectURL(content);
      link.click();
    } catch (err) {
      console.error("打包下载失败:", err);
      alert("打包下载失败，请重试。");
    } finally {
      setIsZipping(false);
    }
  };

  // --- OVERLAY LAYER ACTIONS ---

  const handleAddOverlay = () => {
    const newOverlay: CustomOverlay = {
      id: "overlay_" + Date.now(),
      text: "指定测试字符",
      xPercent: 50,
      yPercent: 50,
      fontSize: 24,
      color: "#E63946",
      bold: true,
      italic: false,
      fontFamily: "SimHei"
    };
    setOverlays((prev) => [...prev, newOverlay]);
    setSelectedOverlayId(newOverlay.id);
  };

  const handleUpdateOverlayField = (id: string, field: keyof CustomOverlay, val: any) => {
    setOverlays((prev) =>
      prev.map((o) => (o.id === id ? { ...o, [field]: val } : o))
    );
  };

  const handleDeleteOverlay = (id: string) => {
    setOverlays((prev) => prev.filter((o) => o.id !== id));
    if (selectedOverlayId === id) {
      setSelectedOverlayId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* HEADER BAR */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded text-white shadow-sm">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              测试材料生成器 <span className="text-slate-400 font-normal text-xs bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded ml-1">v2.1.0</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              融资业务日常测试专用工具 • 支持大陆执照/身份证、香港BR/通行证、特定位置特定字符覆盖
            </p>
          </div>
        </div>
        
        {/* TAB BUTTONS */}
        <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-lg gap-1">
          <button
            onClick={() => setActiveTab("one_click")}
            className={`px-4 py-1.5 rounded text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeTab === "one_click"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <Shuffle className="w-4 h-4" />
            一键基础材料
          </button>
          <button
            onClick={() => setActiveTab("custom_design")}
            className={`px-4 py-1.5 rounded text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeTab === "custom_design"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <Layers className="w-4 h-4" />
            自定义设计 & 覆字
          </button>
          <button
            onClick={() => setActiveTab("code_generator")}
            className={`px-4 py-1.5 rounded text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeTab === "code_generator"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            合规编码生成器
          </button>
        </div>
      </header>

      {/* CORE WORKSPACE */}
      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <AnimatePresence mode="wait">
          {/* 1. ONE-CLICK GENERATOR */}
          {activeTab === "one_click" && (
            <motion.div
              key="one_click"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left Control Column */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {/* Intro Card */}
                <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold mb-3">
                    <Shuffle className="w-5 h-5" />
                    <h2 className="text-sm uppercase tracking-wider">一键生成基础测试材料</h2>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    在日常融资业务测试中，最频繁使用的材料就是<b>“中国大陆企业营业执照”</b>和相应的<b>“法人身份证两面”</b>。
                  </p>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    此功能可以<b>一键同步生成</b>全套互相关联的基础材料，保证营业执照上的“法定代表人”名字与身份证名字完全相同，登记机关高度关联，满足系统逻辑比对。
                  </p>

                  {/* Actions */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-3">
                    <button
                      onClick={() => handleGenerateOneClickSuite()}
                      className="w-full bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 font-semibold py-3 px-4 rounded text-sm border border-indigo-100 shadow-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4 animate-spin-hover" />
                      重新一键同步生成全套 (3张)
                    </button>
                    
                    <button
                      onClick={downloadAllOneClickSuite}
                      disabled={isZipping}
                      className={`w-full font-semibold py-3 px-4 rounded text-sm shadow-md transition-colors flex items-center justify-center gap-2 ${
                        isZipping 
                          ? "bg-slate-400 text-slate-100 cursor-not-allowed" 
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                    >
                      {isZipping ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          正在打包压缩中...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          一键打包下载全部
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Anti-collision Enterprise Name Control Card */}
                <div className="bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 border border-indigo-200 p-6 rounded-lg shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-900 font-bold">
                      <ShieldCheck className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-xs uppercase tracking-wider">企业名称防重机制 (反拦截)</h3>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle className="w-3 h-3" />
                      防重已激活
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    已接入<b>500亿+ 组合空间高熵企业名称引擎</b>，覆盖全国45+重点行政区划、150+合规字号词素笛卡尔积及5大产业细分，<b>彻底解决自动化建号时的名称判重拦截</b>。
                  </p>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1.5 block">
                      企业命名风格偏好
                    </label>
                    <select
                      value={oneClickNamingStyle}
                      onChange={(e) => {
                        const newStyle = e.target.value as EnterpriseNamingStyle;
                        setOneClickNamingStyle(newStyle);
                        handleGenerateOneClickSuite(newStyle);
                      }}
                      className="w-full bg-white border border-indigo-200 px-3 py-2 rounded text-xs outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 font-semibold shadow-xs"
                    >
                      <option value="all">🎲 全部随机 (超高熵防重 · 空间超500亿)</option>
                      <option value="tech">💻 硬核前沿科技 / 人工智能 / 云计算</option>
                      <option value="commerce">🌐 国际商贸 / 跨境电商 / 现代供应链</option>
                      <option value="manufacturing">⚙️ 先进智造 / 新能源 / 新材料</option>
                      <option value="creative">🎨 文化传媒 / 数字创意 / 品牌策划</option>
                      <option value="corporate_4char">💎 四字大气品牌 / 吉祥成语名</option>
                    </select>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={handleRegenerateOneClickEnterpriseName}
                      className="w-full bg-white hover:bg-indigo-50 text-indigo-700 font-semibold py-2.5 px-3 rounded text-xs border border-indigo-200 shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-98"
                      title="只换企业名称，保持法定代表人等证件关联一致"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      ⚡ 独立换个防重企业名称 (保持法人证件)
                    </button>
                    {copiedStates["reRollNameToast"] && (
                      <p className="text-[10px] text-emerald-600 font-bold text-center mt-1 animate-pulse">
                        ✓ 已生成全新防重企业名称，营业执照已实时更新！
                      </p>
                    )}
                  </div>
                </div>

                {/* Background Styles Card */}
                <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3 block">
                    切换 OCR 测试场景 (图像风格)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["clean", "paper", "scan"] as BackgroundStyle[]).map((style) => (
                      <button
                        key={style}
                        onClick={() => setOneClickBackgroundStyle(style)}
                        className={`py-2 px-3 rounded text-xs font-semibold border transition-all ${
                          oneClickBackgroundStyle === style
                            ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        {style === "clean" && "完美矢量面"}
                        {style === "paper" && "轻度纸质感"}
                        {style === "scan" && "高仿真扫描"}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    * 推荐使用<b>“高仿真扫描”</b>：带有透视倾斜、日光反光折射、极弱噪点和暗角，能够绝佳验证自研 OCR 在真实移动端拍摄/扫描件下的泛化与鲁棒识别能力！
                  </p>
                </div>

                {/* Synchronized Metadata values */}
                <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm flex-1">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3 block">
                    当前同步生成的关联要素 (OCR真值)
                  </label>
                  <div className="space-y-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded border border-slate-200">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                          企业名称 / 住所
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleRegenerateOneClickEnterpriseName}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                            title="快速单独刷新企业名称以防重"
                          >
                            <Sparkles className="w-3 h-3" />
                            防重换名
                          </button>
                          <button
                            onClick={() => {
                              if (oneClickLicense?.name) {
                                handleCopyCode(oneClickLicense.name, "oneClickName");
                              }
                            }}
                            className="text-[10px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
                          >
                            {copiedStates["oneClickName"] ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            {copiedStates["oneClickName"] ? "已复制" : "复制"}
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-900 select-all font-mono font-bold text-xs break-all leading-snug">{oneClickLicense?.name}</p>
                      {oneClickLicense?._meta && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px]">
                          <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 font-medium">区划: {oneClickLicense._meta.division.shortCity || oneClickLicense._meta.division.city}</span>
                          <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 font-medium">字号: {oneClickLicense._meta.brandName}</span>
                          <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 font-medium">行业: {oneClickLicense._meta.industry}</span>
                          <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100 font-medium">结构: {oneClickLicense._meta.structure}</span>
                        </div>
                      )}
                      <p className="text-slate-500 mt-2 select-all font-mono text-[11px] break-all">{oneClickLicense?.address}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded border border-slate-200 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">法定代表人</p>
                        <p className="text-indigo-600 font-bold select-all font-mono">{oneClickLicense?.legalRep}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">证件性别 / 民族</p>
                        <p className="text-slate-800 select-all font-mono font-semibold">{oneClickIdFront?.gender} / {oneClickIdFront?.ethnicity}族</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded border border-slate-200">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">统一社会信用代码 (USCC)</p>
                      <p className="text-indigo-600 font-bold select-all font-mono break-all">{oneClickLicense?.uscc}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded border border-slate-200">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">公民身份证号 (ID No.)</p>
                      <p className="text-indigo-600 font-bold select-all font-mono">{oneClickIdFront?.idNumber}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Canvas Column */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                {/* Document Type Selector Tabs */}
                <div className="flex bg-white p-1 border border-slate-200 rounded-lg justify-between shadow-sm">
                  {[
                    { id: "mainland_business_license", label: "中国大陆企业营业执照", d: oneClickLicense },
                    { id: "mainland_id_front", label: "身份证(个人信息面)", d: oneClickIdFront },
                    { id: "mainland_id_back", label: "身份证(国徽签发面)", d: oneClickIdBack }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setOneClickActiveDoc(tab.id as DocType)}
                      className={`flex-1 py-2 rounded text-xs md:text-sm font-semibold transition-all ${
                        oneClickActiveDoc === tab.id
                          ? "bg-slate-800 text-white shadow"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Dynamic Canvas Container */}
                <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-center items-center relative min-h-[450px] shadow-sm">
                  <div className={`w-full flex justify-center ${oneClickActiveDoc === "mainland_business_license" ? "block" : "hidden"}`}>
                    {oneClickLicense && (
                      <DocumentCanvas
                        docType="mainland_business_license"
                        fields={oneClickLicense}
                        overlays={[]}
                        backgroundStyle={oneClickBackgroundStyle}
                        selectedOverlayId={null}
                        onSelectOverlay={() => {}}
                      />
                    )}
                  </div>
                  <div className={`w-full flex justify-center ${oneClickActiveDoc === "mainland_id_front" ? "block" : "hidden"}`}>
                    {oneClickIdFront && (
                      <DocumentCanvas
                        docType="mainland_id_front"
                        fields={oneClickIdFront}
                        overlays={[]}
                        backgroundStyle={oneClickBackgroundStyle}
                        selectedOverlayId={null}
                        onSelectOverlay={() => {}}
                      />
                    )}
                  </div>
                  <div className={`w-full flex justify-center ${oneClickActiveDoc === "mainland_id_back" ? "block" : "hidden"}`}>
                    {oneClickIdBack && (
                      <DocumentCanvas
                        docType="mainland_id_back"
                        fields={oneClickIdBack}
                        overlays={[]}
                        backgroundStyle={oneClickBackgroundStyle}
                        selectedOverlayId={null}
                        onSelectOverlay={() => {}}
                      />
                    )}
                  </div>

                  {/* Actions under preview */}
                  <div className="w-full flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-400">
                      分辨率：1200x1600 (高解度 OCR 识别版)
                    </span>
                    <button
                      onClick={() => {
                        let fName = "营业执照";
                        if (oneClickActiveDoc === "mainland_id_front") fName = "身份证面";
                        if (oneClickActiveDoc === "mainland_id_back") fName = "身份证国徽";
                        downloadCanvasAsImage(`ocr-canvas-${oneClickActiveDoc}`, `oneclick_${fName}`);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      下载当前单张 PNG
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. CUSTOM DESIGNER WITH OVERLAYS */}
          {activeTab === "custom_design" && (
            <motion.div
              key="custom_design"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left Settings/Fields Panel */}
              <div className="lg:col-span-4 flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-1">
                {/* Template Selector & Scenario */}
                <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 block">
                      选择测试证件模板
                    </label>
                    <select
                      value={customDocType}
                      onChange={(e) => setCustomDocType(e.target.value as DocType)}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="mainland_business_license">中国大陆企业营业执照 (Mainland BL)</option>
                      <option value="mainland_id_front">中国大陆居民身份证 (信息面)</option>
                      <option value="mainland_id_back">中国大陆居民身份证 (国徽面)</option>
                      <option value="hk_business_registration">香港企业商业登记证 (Hong Kong BR)</option>
                      <option value="hk_home_return_permit">港澳居民来往内地通行证 (正面)</option>
                      <option value="hk_home_return_permit_back">港澳居民来往内地通行证 (背面)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 block">
                      图像质量风格 (OCR 暗室/纸质过滤)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["clean", "paper", "scan"] as BackgroundStyle[]).map((style) => (
                        <button
                          key={style}
                          onClick={() => setCustomBackgroundStyle(style)}
                          className={`py-2 px-2 rounded text-xs font-semibold border transition-all ${
                            customBackgroundStyle === style
                              ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >
                          {style === "clean" && "无噪洁净"}
                          {style === "paper" && "纸制背景"}
                          {style === "scan" && "拍照扫描"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleRandomizeCustomFields(customDocType)}
                      className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      随机全套字段
                    </button>
                  </div>
                </div>

                {/* Form Editor for standard fields */}
                <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-1 flex justify-between items-center">
                    <span>模版要素参数自定义</span>
                    <span className="text-xs text-slate-400 font-normal">支持直接在线修改</span>
                  </h3>

                  <div className="space-y-3.5">
                    {Object.keys(customFields).map((fieldKey) => {
                      // Get human label mapping
                      let label = fieldKey;
                      if (fieldKey === "uscc") label = "统一社会信用代码";
                      else if (fieldKey === "name") label = "名称/姓名";
                      else if (fieldKey === "type") label = "类型";
                      else if (fieldKey === "legalRep") label = "法定代表人";
                      else if (fieldKey === "registeredCapital") label = "注册资本";
                      else if (fieldKey === "establishmentDate") label = "成立日期";
                      else if (fieldKey === "businessTerm") label = "营业期限";
                      else if (fieldKey === "address") label = "住所/地址";
                      else if (fieldKey === "businessScope") label = "经营范围";
                      else if (fieldKey === "registrationAuthority") label = "登记机关";
                      else if (fieldKey === "issueDate") label = "发照日期";
                      else if (fieldKey === "gender") label = "性别";
                      else if (fieldKey === "ethnicity") label = "民族";
                      else if (fieldKey === "birthYear") label = "出生年";
                      else if (fieldKey === "birthMonth") label = "出生月";
                      else if (fieldKey === "birthDay") label = "出生日";
                      else if (fieldKey === "idNumber") label = "证件号码";
                      else if (fieldKey === "authority") label = "签发机关/管理局";
                      else if (fieldKey === "validityStart") label = "有效期起";
                      else if (fieldKey === "validityEnd") label = "有效期止";
                      else if (fieldKey === "brNumber") label = "商业登记证号 (BR)";
                      else if (fieldKey === "nameEnglish") label = "英文名称";
                      else if (fieldKey === "nameChinese") label = "中文名称";
                      else if (fieldKey === "natureEnglish") label = "英文业务性质";
                      else if (fieldKey === "natureChinese") label = "中文业务性质";
                      else if (fieldKey === "statusEnglish") label = "英文法律地位";
                      else if (fieldKey === "statusChinese") label = "中文法律地位";
                      else if (fieldKey === "commencementDate") label = "生效日期 (DD/MM/YYYY)";
                      else if (fieldKey === "expiryDate") label = "届满日期 (DD/MM/YYYY)";
                      else if (fieldKey === "fee") label = "登记费";
                      else if (fieldKey === "levy") label = "征费";
                      else if (fieldKey === "total") label = "合计金额";
                      else if (fieldKey === "birthDate") label = "出生日期 (YYYY.MM.DD)";
                      else if (fieldKey === "validityPeriod") label = "有效期限 (Start - End)";
                      else if (fieldKey === "placeOfIssue") label = "签发地点";
                      else if (fieldKey === "renewalCount") label = "换证次数";
                      else if (fieldKey === "hkidNumber") label = "香港身份证号码";
                      else if (fieldKey === "hkNameTraditional") label = "香港身份证姓名(繁体)";

                      return (
                        <div key={fieldKey} className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{label}</label>
                            {/* Random button for this particular code */}
                            {fieldKey === "name" && customDocType === "mainland_business_license" && (
                              <button
                                onClick={() => {
                                  const ent = generateEnterpriseName("all");
                                  const newUSCC = generateSocialCreditCode(ent.division.code);
                                  const roomNum = `${Math.floor(Math.random() * 3 + 1)}栋${Math.floor(Math.random() * 2000 + 101)}室`;
                                  const newAddress = `${ent.division.addressPrefix}${Math.floor(Math.random() * 888 + 1)}号${roomNum}`;
                                  setCustomFields((prev: any) => ({
                                    ...prev,
                                    name: ent.fullName,
                                    address: newAddress,
                                    businessScope: ent.scope,
                                    registrationAuthority: `${ent.division.city}${ent.division.district}市场监督管理局`,
                                    uscc: newUSCC
                                  }));
                                }}
                                className="text-indigo-600 hover:text-indigo-800 text-[10px] font-semibold flex items-center gap-1"
                                title="生成全新高熵防重名称并更新关联信息"
                              >
                                <Sparkles className="w-3 h-3" />
                                随机高熵防重名称
                              </button>
                            )}
                            {["uscc", "idNumber", "brNumber", "phone"].includes(fieldKey) && (
                              <button
                                onClick={() => {
                                  let rVal = "";
                                  if (fieldKey === "uscc") rVal = generateSocialCreditCode();
                                  else if (fieldKey === "idNumber") rVal = generateCitizenIdNumber();
                                  else if (fieldKey === "brNumber") rVal = generateHKBRNumber();
                                  setCustomFields((prev: any) => ({ ...prev, [fieldKey]: rVal }));
                                }}
                                className="text-indigo-600 hover:text-indigo-700 text-[10px] font-semibold"
                              >
                                随机编码
                              </button>
                            )}
                          </div>
                          {fieldKey === "businessScope" ? (
                            <textarea
                              rows={3}
                              value={customFields[fieldKey] || ""}
                              onChange={(e) => setCustomFields((prev: any) => ({ ...prev, [fieldKey]: e.target.value }))}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded text-xs font-mono text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          ) : (
                            <input
                              type="text"
                              value={customFields[fieldKey] || ""}
                              onChange={(e) => setCustomFields((prev: any) => ({ ...prev, [fieldKey]: e.target.value }))}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded text-xs font-mono text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Specific Character Overlay System */}
                <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      特定位置覆字层 (Overlays)
                    </h3>
                    <button
                      onClick={handleAddOverlay}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      新覆字
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    可用于在特定坐标<b>故意叠覆错误字元</b>、<b>特殊罕见字</b>或<b>超长乱码</b>，以此极限挑战您的 OCR 的校准性能与错字率指标。
                  </p>

                  <AnimatePresence>
                    {overlays.length === 0 ? (
                      <div className="text-center py-6 border border-dashed border-slate-200 rounded text-xs text-slate-400">
                        暂无叠覆文字。点击上方“新覆字”添加。
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {overlays.map((o) => (
                          <div
                            key={o.id}
                            className={`p-3.5 rounded border transition-all ${
                              selectedOverlayId === o.id
                                ? "bg-indigo-50/50 border-indigo-300"
                                : "bg-slate-50 border-slate-200 hover:border-slate-300"
                            }`}
                            onClick={() => setSelectedOverlayId(o.id)}
                          >
                            <div className="flex justify-between items-center gap-2 mb-2">
                              <input
                                type="text"
                                value={o.text}
                                onChange={(e) => handleUpdateOverlayField(o.id, "text", e.target.value)}
                                placeholder="覆叠文字内容"
                                className="bg-white border border-slate-200 px-2.5 py-1 rounded text-xs text-slate-800 outline-none w-2/3 focus:ring-1 focus:ring-indigo-500"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteOverlay(o.id);
                                }}
                                className="text-slate-400 hover:text-red-500 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {/* Font options */}
                              <div>
                                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">字体</label>
                                <select
                                  value={o.fontFamily}
                                  onChange={(e) => handleUpdateOverlayField(o.id, "fontFamily", e.target.value)}
                                  className="w-full bg-white border border-slate-200 px-2 py-1 rounded text-[10px] text-slate-700 focus:ring-1 focus:ring-indigo-500"
                                >
                                  <option value="SimHei">黑体 (Gothic)</option>
                                  <option value="SimSun">宋体 (Serif)</option>
                                  <option value="Microsoft YaHei">微软雅黑</option>
                                  <option value="Arial">Arial (英)</option>
                                  <option value="Courier New">Courier New (宽)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">字号 ({o.fontSize}px)</label>
                                <input
                                  type="range"
                                  min="10"
                                  max="72"
                                  value={o.fontSize}
                                  onChange={(e) => handleUpdateOverlayField(o.id, "fontSize", parseInt(e.target.value))}
                                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                              </div>
                            </div>

                            {/* Coordinates and visual control */}
                            <div className="grid grid-cols-2 gap-2 mt-2.5">
                              <div>
                                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">X轴比重 ({o.xPercent}%)</label>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={o.xPercent}
                                  onChange={(e) => handleUpdateOverlayField(o.id, "xPercent", parseFloat(e.target.value))}
                                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Y轴比重 ({o.yPercent}%)</label>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={o.yPercent}
                                  onChange={(e) => handleUpdateOverlayField(o.id, "yPercent", parseFloat(e.target.value))}
                                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                              </div>
                            </div>

                            {/* Styling toggles */}
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleUpdateOverlayField(o.id, "bold", !o.bold)}
                                className={`flex-1 py-0.5 rounded text-[10px] border font-bold transition-all ${
                                  o.bold 
                                    ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
                                    : "bg-white border-slate-200 text-slate-400"
                                }`}
                              >
                                粗体 B
                              </button>
                              <button
                                onClick={() => handleUpdateOverlayField(o.id, "italic", !o.italic)}
                                className={`flex-1 py-0.5 rounded text-[10px] border italic transition-all ${
                                  o.italic 
                                    ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
                                    : "bg-white border-slate-200 text-slate-400"
                                }`}
                              >
                                斜体 I
                              </button>
                              <input
                                type="color"
                                value={o.color}
                                onChange={(e) => handleUpdateOverlayField(o.id, "color", e.target.value)}
                                className="w-8 h-5 rounded border border-slate-200 bg-transparent cursor-pointer p-0"
                                title="文字颜色"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Interactive Preview Panel */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm flex flex-col justify-center items-center relative min-h-[500px]">
                  
                  {/* Canvas component call */}
                  <DocumentCanvas
                    docType={customDocType}
                    fields={customFields}
                    overlays={overlays}
                    backgroundStyle={customBackgroundStyle}
                    selectedOverlayId={selectedOverlayId}
                    onSelectOverlay={setSelectedOverlayId}
                    onUpdateOverlayPosition={(id, x, y) => {
                      handleUpdateOverlayField(id, "xPercent", x);
                      handleUpdateOverlayField(id, "yPercent", y);
                    }}
                  />

                  {/* Canvas instructions */}
                  <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mt-5 pt-4 border-t border-slate-100 gap-3">
                    <div className="space-y-0.5">
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>分辨率：{getCanvasDimensions(customDocType).width}x{getCanvasDimensions(customDocType).height} px (PNG 32位无损)</span>
                      </p>
                      {overlays.length > 0 && (
                        <p className="text-[10px] text-slate-500">
                          * 拖拽提示：在预览图上直接点击文字，可出现红色选框进行位置拖拽微调。
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => {
                        let label = "证件";
                        if (customDocType === "mainland_business_license") label = "营业执照";
                        else if (customDocType.startsWith("mainland_id")) label = "大陆身份证";
                        else if (customDocType === "hk_business_registration") label = "香港商业登记证";
                        else if (customDocType === "hk_home_return_permit") label = "回乡证正面";
                        else if (customDocType === "hk_home_return_permit_back") label = "回乡证背面";
                        downloadCanvasAsImage(`ocr-canvas-${customDocType}`, `custom_${label}`);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded text-xs flex items-center gap-2 shrink-0 shadow-md transition-all active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      下载当前自定义图片
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. CODES GENERATOR LAB */}
          {activeTab === "code_generator" && (
            <motion.div
              key="code_generator"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6"
            >
              {/* Left Column: Single generators list */}
              <div className="md:col-span-6 bg-white border border-slate-200 p-6 rounded-lg shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-1">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Shuffle className="w-5 h-5 text-indigo-600" />
                    官方合规规则 • 单条随机生成器
                  </h3>
                  <button
                    onClick={handleGenerateSingleCodes}
                    className="text-slate-500 hover:text-slate-800 text-xs flex items-center gap-1 font-semibold"
                    title="全部随机换一换"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    一键换新
                  </button>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  所有代码均严格匹配国家及各管理局<b>官方编码规范</b>（校验和校验算法如 Mod-11/Luhn/Mod-31 ），确保能够轻易通过任何前置校验程序。
                </p>

                {/* Generator list */}
                <div className="space-y-3.5">
                  {[
                    { key: "enterpriseName", name: "企业全称 (全国抗碰撞防重)", val: singleCodes.enterpriseName, rule: "500亿+ 组合空间 · 全国企业名称防重标准" },
                    { key: "uscc", name: "统一社会信用代码 (Mainland USCC)", val: singleCodes.uscc, rule: "GB 32100-2015 算法校验 (Mod 31)" },
                    { key: "idCard", name: "公民身份号码 (Mainland Resident ID)", val: singleCodes.idCard, rule: "GB 11643-1999 算法校验 (Mod 11)" },
                    { key: "phone", name: "手机号 (Mainland Phone Number)", val: singleCodes.phone, rule: "3位合法号段 + 8位随机序列" },
                    { key: "hkBr", name: "香港商业登记号码 (HK BR No.)", val: singleCodes.hkBr, rule: "8位主体-3位分支-2位税务生效代码" },
                    { key: "hkCr", name: "香港公司注册号码 (HK CR No.)", val: singleCodes.hkCr, rule: "7位递增官方注册号" },
                    { key: "homeReturn", name: "港澳居民来往内地通行证号", val: singleCodes.homeReturn, rule: "H/M开头 + 8位号 + 2位换证次数" },
                    { key: "bankCard", name: "中国银联银行卡卡号", val: singleCodes.bankCard, rule: "标准LUHN(模10)算法校验" }
                  ].map((item) => (
                    <div key={item.key} className="bg-slate-50 border border-slate-200 rounded p-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-800">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.rule}</p>
                        <p className="text-base font-mono font-bold text-indigo-600 select-all tracking-wider mt-1.5 break-all">
                          {item.val}
                        </p>
                      </div>

                      <div className="flex gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleRegenerateCode(item.key as any)}
                          className="p-2 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 rounded transition-all"
                          title="重新生成"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCopyCode(item.val, item.key)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1.5 px-3 rounded text-xs flex items-center gap-1 shadow-sm transition-all active:scale-95"
                        >
                          {copiedStates[item.key] ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              已复制
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              复制
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Bulk Generator */}
              <div className="md:col-span-6 flex flex-col gap-6">
                <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm flex-1 flex flex-col">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                    <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900">批量合规测试编码生成器</h3>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    适用于测试团队进行性能压测、并发流程跑批等大批量数据准备阶段。最多支持一键生成并导出<b>200条</b>校验合规代码。
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 block">生成类型</label>
                      <select
                        value={bulkType}
                        onChange={(e) => setBulkType(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded text-xs outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 font-semibold"
                      >
                        <option value="enterpriseName">企业全称 (全国抗碰撞防重 · 500亿空间)</option>
                        <option value="uscc">统一社会信用代码 (Mainland USCC)</option>
                        <option value="idCard">身份证号 (Mainland Resident ID)</option>
                        <option value="phone">手机号 (Mainland Phone)</option>
                        <option value="hkBr">香港商业登记号 (HK BR No.)</option>
                        <option value="hkCr">香港公司注册号 (HK CR No.)</option>
                        <option value="homeReturn">通行证号 (Home Return Permit)</option>
                        <option value="bankCard">银行卡号 (UnionPay Card)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 block">生成数量 (1-200)</label>
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={bulkCount}
                        onChange={(e) => setBulkCount(parseInt(e.target.value) || 20)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded text-xs outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateBulkCodes}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded text-xs flex justify-center items-center gap-1.5 shadow-md mb-4 active:scale-95 transition-all"
                  >
                    <Shuffle className="w-4 h-4" />
                    开始批量随机生成
                  </button>

                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">输出结果列表 ({bulkOutput.split("\n").filter(Boolean).length} 条)</label>
                      {bulkOutput && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(bulkOutput);
                            triggerCopyFeedback("bulk");
                          }}
                          className="text-[10px] text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
                        >
                          {copiedStates["bulk"] ? (
                            <>
                              <Check className="w-3 h-3" />
                              已复制
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              复制全部列表
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <textarea
                      readOnly
                      rows={10}
                      value={bulkOutput}
                      placeholder="批量生成后在此输出，支持一键复制，或直接用于测试脚本..."
                      className="w-full flex-1 bg-slate-55 border border-slate-200 p-3 rounded text-xs font-mono leading-relaxed outline-none focus:ring-1 focus:ring-indigo-500 resize-none text-slate-800 shadow-inner bg-slate-50"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-6 px-6 text-center text-xs text-slate-500 shrink-0 bg-white">
        <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto gap-3">
          <span>
            测试材料生成器 © 2026 • 所有生成的图片和代码均为模拟测试专用，无实际信用与法律效力。
          </span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>GB 32100-2015 兼容</span>
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>GB 11643-1999 兼容</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
