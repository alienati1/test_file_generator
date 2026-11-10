/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";
import { 
  BusinessLicenseFields, 
  ResidentIdCardFields, 
  HKBusinessRegistrationFields, 
  HomeReturnPermitFields 
} from "../utils/generators";

export type DocType = 
  | "mainland_business_license"
  | "mainland_id_front"
  | "mainland_id_back"
  | "hk_business_registration"
  | "hk_home_return_permit"
  | "hk_home_return_permit_back";

export type BackgroundStyle = "clean" | "paper" | "scan";

export interface CustomOverlay {
  id: string;
  text: string;
  xPercent: number; // 0 - 100
  yPercent: number; // 0 - 100
  fontSize: number; // in pixels
  color: string;
  bold: boolean;
  italic: boolean;
  fontFamily: "SimHei" | "SimSun" | "Microsoft YaHei" | "Arial" | "Courier New";
}

// Define reference dimensions (High DPI for OCR)
export const getCanvasDimensions = (type: DocType) => {
  switch (type) {
    case "mainland_business_license":
      return { width: 1200, height: 1600, aspect: "aspect-[3/4]" };
    case "hk_business_registration":
      return { width: 1200, height: 1200, aspect: "aspect-square" };
    case "mainland_id_front":
    case "mainland_id_back":
    case "hk_home_return_permit":
    case "hk_home_return_permit_back":
    default:
      return { width: 1000, height: 630, aspect: "aspect-[85.6/53.98]" };
  }
};

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

interface DocumentCanvasProps {
  docType: DocType;
  fields: any; // Dynamic based on docType
  overlays: CustomOverlay[];
  backgroundStyle: BackgroundStyle;
  selectedOverlayId: string | null;
  onSelectOverlay: (id: string | null) => void;
  onUpdateOverlayPosition?: (id: string, xPercent: number, yPercent: number) => void;
}

export default function DocumentCanvas({
  docType,
  fields,
  overlays,
  backgroundStyle,
  selectedOverlayId,
  onSelectOverlay,
  onUpdateOverlayPosition,
}: DocumentCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { width, height, aspect } = getCanvasDimensions(docType);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high resolution canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Save context
    ctx.save();

    // 1. Draw Document Background and Core Templates
    drawTemplate(ctx, docType, fields, backgroundStyle);

    // 2. Draw Custom Overlays
    drawOverlays(ctx, overlays, selectedOverlayId);

    // 3. Apply Camera/Noise/Scan Artifacts if requested
    if (backgroundStyle === "scan") {
      applyScanFilters(ctx, width, height);
    }

    ctx.restore();
  }, [docType, fields, overlays, backgroundStyle, selectedOverlayId, width, height]);

  // Handle click on canvas for dragging or selecting overlays
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Find if user clicked on any overlay (rough bounding box check)
    let foundId: string | null = null;
    for (const overlay of overlays) {
      // Approximate text bounds
      const xDiff = Math.abs(overlay.xPercent - clickX);
      const yDiff = Math.abs(overlay.yPercent - clickY);
      
      // If clicked close enough (within 8% in X, 3% in Y)
      if (xDiff < 8 && yDiff < 4) {
        foundId = overlay.id;
        break;
      }
    }

    onSelectOverlay(foundId);
  };

  // Drag overlay handling
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedOverlayId || !onUpdateOverlayPosition || e.buttons !== 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const xPercent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const yPercent = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    onUpdateOverlayPosition(selectedOverlayId, parseFloat(xPercent.toFixed(1)), parseFloat(yPercent.toFixed(1)));
  };

  // --- RENDERING TEMPLATES ---

  const drawTemplate = (
    ctx: CanvasRenderingContext2D,
    type: DocType,
    data: any,
    style: BackgroundStyle
  ) => {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    // Set base background color
    let bgColor = "#FFFFFF";
    if (style === "paper") {
      bgColor = type === "mainland_business_license" ? "#FAF4EB" : "#F4EFEB";
    } else if (type === "mainland_business_license") {
      bgColor = "#FDFCF7";
    } else if (type === "hk_business_registration") {
      bgColor = "#FCFAF2";
    } else if (type === "mainland_id_front" || type === "mainland_id_back" || type === "hk_home_return_permit" || type === "hk_home_return_permit_back") {
      bgColor = "#F0F5FA";
    }

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    // Apply light paper texture if paper style
    if (style === "paper") {
      ctx.fillStyle = "rgba(120, 90, 60, 0.03)";
      for (let i = 0; i < 500; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = Math.random() * 2 + 1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    switch (type) {
      case "mainland_business_license":
        drawMainlandBusinessLicense(ctx, w, h, data, style);
        break;
      case "mainland_id_front":
        drawMainlandIDFront(ctx, w, h, data, style);
        break;
      case "mainland_id_back":
        drawMainlandIDBack(ctx, w, h, data, style);
        break;
      case "hk_business_registration":
        drawHKBusinessRegistration(ctx, w, h, data, style);
        break;
      case "hk_home_return_permit":
        drawHKHomeReturnPermit(ctx, w, h, data, style);
        break;
      case "hk_home_return_permit_back":
        drawHKHomeReturnPermitBack(ctx, w, h, data, style);
        break;
    }
  };

  // 1. DRAW CHINA BUSINESS LICENSE
  const drawMainlandBusinessLicense = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    d: BusinessLicenseFields,
    style: BackgroundStyle
  ) => {
    // Elegant gold border
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#A4804E";
    ctx.strokeRect(30, 30, w - 60, h - 60);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#C4A26E";
    ctx.strokeRect(42, 42, w - 84, h - 84);

    // Draw localized national seal / emblem at top center
    const emblemX = w / 2;
    const emblemY = 130;
    ctx.save();
    ctx.beginPath();
    ctx.arc(emblemX, emblemY, 45, 0, Math.PI * 2);
    ctx.fillStyle = "#E63946";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#FFD700";
    ctx.stroke();

    // Star in the badge
    drawStar(ctx, emblemX, emblemY, 5, 20, 8, "#FFD700");
    // Outer golden leaves mock
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(emblemX, emblemY, 35, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
    ctx.restore();

    // Large Title: 营业执照
    ctx.fillStyle = "#111111";
    ctx.font = "bold 64px SimHei, 'Microsoft YaHei', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("营  业  执  照", w / 2, 230);

    ctx.font = "bold 24px SimSun, serif";
    ctx.fillText("（副  本）", w / 2, 280);

    // Draw Mock QR Code in upper right
    const qrSize = 130;
    const qrX = w - 180;
    const qrY = 100;
    drawMockQRCode(ctx, qrX, qrY, qrSize);
    ctx.font = "14px SimHei";
    ctx.fillStyle = "#555555";
    ctx.fillText("国家企业信用信息公示系统", qrX + qrSize / 2, qrY + qrSize + 25);

    // Left Panel Fields setup
    const leftX = 120;
    const valX = 340;
    let startY = 380;
    const rowHeight = 65;

    ctx.textAlign = "left";

    // 1. USCC Code (Huge and clear at the top of fields)
    ctx.fillStyle = "#111111";
    ctx.font = "bold 24px SimHei, sans-serif";
    ctx.fillText("统一社会信用代码", leftX, startY);
    ctx.font = "bold 26px 'Courier New', monospace, sans-serif";
    ctx.fillStyle = "#000000";
    ctx.fillText(d.uscc || "", valX, startY);

    startY += rowHeight + 15;

    const fieldsList = [
      { label: "名      称", val: d.name },
      { label: "类      型", val: d.type },
      { label: "法 定 代 表 人", val: d.legalRep },
      { label: "注 册 资 本", val: d.registeredCapital },
      { label: "成 立 日 期", val: d.establishmentDate },
      { label: "营 业 期 限", val: d.businessTerm },
      { label: "住      所", val: d.address },
    ];

    fieldsList.forEach((field) => {
      ctx.fillStyle = "#333333";
      ctx.font = "bold 22px SimHei, 'Microsoft YaHei', sans-serif";
      ctx.fillText(field.label, leftX, startY);

      ctx.fillStyle = "#111111";
      ctx.font = "22px SimSun, sans-serif";
      
      // If it's address, wrap it as it might be long
      if (field.label.includes("名      称")) {
        const textWidth = ctx.measureText(field.val || "").width;
        if (textWidth > 700) {
          ctx.font = "bold 20px SimSun, sans-serif";
        } else {
          ctx.font = "bold 22px SimSun, sans-serif";
        }
        ctx.fillText(field.val || "", valX, startY);
      } else if (field.label.includes("住所")) {
        wrapText(ctx, field.val, valX, startY, 740, 32);
      } else {
        ctx.fillText(field.val || "", valX, startY);
      }
      startY += rowHeight;
    });

    // 9. Business Scope
    startY += 10;
    ctx.fillStyle = "#333333";
    ctx.font = "bold 22px SimHei, 'Microsoft YaHei', sans-serif";
    ctx.fillText("经 营 范 围", leftX, startY);

    ctx.fillStyle = "#111111";
    ctx.font = "18px SimSun, sans-serif";
    wrapText(ctx, d.businessScope, valX, startY, 740, 28);

    // Registration Authority details (Bottom Right)
    const rightX = w - 150;
    const authY = h - 280;
    ctx.textAlign = "right";
    ctx.fillStyle = "#333333";
    ctx.font = "bold 22px SimHei, sans-serif";
    ctx.fillText("登记机关", rightX - 50, authY);

    ctx.fillStyle = "#111111";
    ctx.font = "22px SimSun, sans-serif";
    ctx.fillText(d.registrationAuthority || "", rightX - 50, authY + 40);
    ctx.fillText(d.issueDate || "", rightX - 50, authY + 110);

    // Draw RED OFFICIAL SEAL over the registration authority text!
    const sealX = rightX - 180;
    const sealY = authY + 50;
    drawOfficialRedSeal(ctx, sealX, sealY, d.registrationAuthority);
  };

  // Helper to draw a rounded rect path (extremely compatible)
  const pathRoundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  // 2. DRAW MAINLAND ID FRONT
  const drawMainlandIDFront = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    d: ResidentIdCardFields,
    style: BackgroundStyle
  ) => {
    // 1. Draw outer black boundary frame for perfect OCR edge contrast detection
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);

    // 2. Card bounds with 12px margin
    const pad = 12;
    const cardW = w - pad * 2;
    const cardH = h - pad * 2;
    const cardX = pad;
    const cardY = pad;
    const radius = 32;

    // Clip to rounded card rect
    ctx.save();
    pathRoundRect(ctx, cardX, cardY, cardW, cardH, radius);
    ctx.clip();

    // 3. Draw authentic horizontal gradient matching real ID card
    const grad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY);
    grad.addColorStop(0, "#C5DFF6");   // Light cyan-blue
    grad.addColorStop(0.25, "#DFF0FC");
    grad.addColorStop(0.5, "#FBE6E4");    // Light pink-red center
    grad.addColorStop(0.75, "#DFF0FC");
    grad.addColorStop(1, "#C5DFF6");   // Light cyan-blue
    ctx.fillStyle = grad;
    ctx.fillRect(cardX, cardY, cardW, cardH);

    // 4. Concentric circular guilloche grid pattern in center
    ctx.save();
    ctx.strokeStyle = "rgba(180, 80, 120, 0.07)"; // pink concentric circular grid
    ctx.lineWidth = 1;
    const centerX = cardX + cardW * 0.45;
    const centerY = cardY + cardH * 0.55;
    for (let r = 20; r < 360; r += 16) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Blue intersecting elliptical grid
    ctx.strokeStyle = "rgba(0, 140, 220, 0.05)";
    for (let r = 40; r < 460; r += 24) {
      ctx.beginPath();
      ctx.ellipse(centerX - 80, centerY, r, r * 0.8, Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // 5. High frequency wavy security lines across the card
    ctx.save();
    ctx.strokeStyle = "rgba(0, 110, 190, 0.06)";
    ctx.lineWidth = 1.2;
    for (let y = cardY - 40; y < cardY + cardH + 40; y += 22) {
      ctx.beginPath();
      ctx.moveTo(cardX, y);
      ctx.bezierCurveTo(cardX + cardW / 3, y + 35, cardX + (cardW * 2) / 3, y - 35, cardX + cardW, y);
      ctx.stroke();
    }
    // Intersecting pink wave pattern
    ctx.strokeStyle = "rgba(220, 80, 100, 0.05)";
    for (let x = cardX - 40; x < cardX + cardW + 40; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, cardY);
      ctx.bezierCurveTo(x + 35, cardY + cardH / 3, x - 35, cardY + (cardH * 2) / 3, x, cardY + cardH);
      ctx.stroke();
    }
    ctx.restore();

    // 6. Draw front side contents
    const labelX = cardX + 65; // ~77px from left boundary
    const valX = cardX + 175;  // ~187px from left boundary
    ctx.textAlign = "left";

    // Name Field
    ctx.fillStyle = "#0192D6"; // Authentic cyan-blue label color
    ctx.font = "bold 21px SimHei, 'Microsoft YaHei', sans-serif";
    ctx.fillText("姓  名", labelX, cardY + 75);
    ctx.fillStyle = "#111111";
    ctx.font = "bold 23px 'Microsoft YaHei', SimHei, sans-serif";
    ctx.fillText(d.name || "", valX, cardY + 75);

    // Gender & Ethnicity Field
    ctx.fillStyle = "#0192D6";
    ctx.font = "bold 21px SimHei, 'Microsoft YaHei', sans-serif";
    ctx.fillText("性  别", labelX, cardY + 135);
    ctx.fillStyle = "#111111";
    ctx.font = "bold 21px 'Microsoft YaHei', SimHei, sans-serif";
    const genderStr = d.gender || "男";
    ctx.fillText(genderStr, valX, cardY + 135);

    // Ethnicity Label and Value
    const ethLabelX = valX + 135;
    ctx.fillStyle = "#0192D6";
    ctx.font = "bold 21px SimHei, 'Microsoft YaHei', sans-serif";
    ctx.fillText("民  族", ethLabelX, cardY + 135);
    ctx.fillStyle = "#111111";
    ctx.font = "bold 21px 'Microsoft YaHei', SimHei, sans-serif";
    const ethnicityStr = d.ethnicity || "汉";
    ctx.fillText(ethnicityStr, ethLabelX + 75, cardY + 135);

    // Birth Year/Month/Day (Sequential drawing for perfect alignment without overlap)
    ctx.fillStyle = "#0192D6";
    ctx.font = "bold 21px SimHei, 'Microsoft YaHei', sans-serif";
    ctx.fillText("出  生", labelX, cardY + 195);

    let curX = valX;
    
    // Draw Year (e.g. 1990)
    ctx.fillStyle = "#111111";
    ctx.font = "bold 21px 'Microsoft YaHei', SimHei, sans-serif";
    const yearStr = d.birthYear || "1990";
    ctx.fillText(yearStr, curX, cardY + 195);
    curX += ctx.measureText(yearStr).width + 6;

    // Draw "年" label in cyan-blue
    ctx.fillStyle = "#0192D6";
    ctx.font = "bold 21px SimHei, 'Microsoft YaHei', sans-serif";
    ctx.fillText("年", curX, cardY + 195);
    curX += ctx.measureText("年").width + 12;

    // Draw Month (remove leading zero to match attachment "4" instead of "04")
    ctx.fillStyle = "#111111";
    ctx.font = "bold 21px 'Microsoft YaHei', SimHei, sans-serif";
    let monthStr = d.birthMonth || "1";
    if (monthStr.startsWith("0") && monthStr.length > 1) monthStr = monthStr.substring(1);
    ctx.fillText(monthStr, curX, cardY + 195);
    curX += ctx.measureText(monthStr).width + 6;

    // Draw "月" label in cyan-blue
    ctx.fillStyle = "#0192D6";
    ctx.font = "bold 21px SimHei, 'Microsoft YaHei', sans-serif";
    ctx.fillText("月", curX, cardY + 195);
    curX += ctx.measureText("月").width + 12;

    // Draw Day (remove leading zero to match attachment "19" or "1")
    ctx.fillStyle = "#111111";
    ctx.font = "bold 21px 'Microsoft YaHei', SimHei, sans-serif";
    let dayStr = d.birthDay || "1";
    if (dayStr.startsWith("0") && dayStr.length > 1) dayStr = dayStr.substring(1);
    ctx.fillText(dayStr, curX, cardY + 195);
    curX += ctx.measureText(dayStr).width + 6;

    // Draw "日" label in cyan-blue
    ctx.fillStyle = "#0192D6";
    ctx.font = "bold 21px SimHei, 'Microsoft YaHei', sans-serif";
    ctx.fillText("日", curX, cardY + 195);

    // Address Field
    ctx.fillStyle = "#0192D6";
    ctx.font = "bold 21px SimHei, 'Microsoft YaHei', sans-serif";
    ctx.fillText("住  址", labelX, cardY + 260);
    ctx.fillStyle = "#111111";
    ctx.font = "bold 21px 'Microsoft YaHei', SimHei, sans-serif";
    wrapText(ctx, d.address || "", valX, cardY + 260, 440, 32);

    // Citizen ID Number Label
    ctx.fillStyle = "#0192D6";
    ctx.font = "bold 22px SimHei, 'Microsoft YaHei', sans-serif";
    ctx.fillText("公民身份号码", labelX, cardY + 500);
    
    // Perfectly-spaced authentic Citizen ID Number in OCR-B font
    ctx.fillStyle = "#000000";
    ctx.font = "bold 38px 'OCR-B', 'JetBrains Mono', monospace";
    const cardId = d.idNumber || "";
    const startNumX = cardX + 320;
    const numStep = 32; // Standard exact monospaced spacing for OCR
    for (let i = 0; i < cardId.length; i++) {
      ctx.fillText(cardId[i], startNumX + i * numStep, cardY + 502);
    }

    // Draw Right side Portrait Photo inside safe bounds
    drawMockPortrait(ctx, cardX + 640, cardY + 65, 260, 340, d.gender === "男" ? "male" : "female");

    ctx.restore(); // Restore rounded corner clipping

    // 7. Draw card outer 3D border stroke for perfect high-fidelity edge aesthetics
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 2;
    pathRoundRect(ctx, cardX, cardY, cardW, cardH, radius);
    ctx.stroke();
  };

  // 3. DRAW MAINLAND ID BACK
  const drawMainlandIDBack = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    d: ResidentIdCardFields,
    style: BackgroundStyle
  ) => {
    // 1. Draw outer black boundary frame for perfect OCR edge contrast detection
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);

    // 2. Card bounds with 12px margin
    const pad = 12;
    const cardW = w - pad * 2;
    const cardH = h - pad * 2;
    const cardX = pad;
    const cardY = pad;
    const radius = 32;

    // Clip to rounded card rect
    ctx.save();
    pathRoundRect(ctx, cardX, cardY, cardW, cardH, radius);
    ctx.clip();

    // 3. Draw reverse side pink-centered authentic horizontal gradient
    const grad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY);
    grad.addColorStop(0, "#F5D6D3");   // Pink/red on the left
    grad.addColorStop(0.25, "#FCEAE8");
    grad.addColorStop(0.5, "#DCEEFC");    // Light blue center
    grad.addColorStop(0.75, "#FCEAE8");
    grad.addColorStop(1, "#F5D6D3");   // Pink/red on the right
    ctx.fillStyle = grad;
    ctx.fillRect(cardX, cardY, cardW, cardH);

    // 4. Concentric circular guilloche grid pattern in center
    ctx.save();
    ctx.strokeStyle = "rgba(0, 140, 220, 0.05)"; // Blue circular grid
    ctx.lineWidth = 1;
    const centerX = cardX + cardW * 0.5;
    const centerY = cardY + cardH * 0.5;
    for (let r = 30; r < 400; r += 18) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Intersecting pink wave pattern
    ctx.strokeStyle = "rgba(220, 80, 100, 0.04)";
    for (let r = 50; r < 500; r += 24) {
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, r * 1.15, r, Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // 5. High frequency wavy security lines across the card
    ctx.save();
    ctx.strokeStyle = "rgba(220, 80, 100, 0.06)";
    ctx.lineWidth = 1.2;
    for (let y = cardY - 40; y < cardY + cardH + 40; y += 22) {
      ctx.beginPath();
      ctx.moveTo(cardX, y);
      ctx.bezierCurveTo(cardX + cardW / 3, y - 35, cardX + (cardW * 2) / 3, y + 35, cardX + cardW, y);
      ctx.stroke();
    }
    ctx.restore();

    // 6. Great Wall background sketch on the right
    ctx.save();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.04)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const gwX = cardX + cardW * 0.52;
    const gwY = cardY + cardH * 0.45;
    ctx.moveTo(gwX, gwY + 110);
    ctx.lineTo(gwX + 40, gwY + 70);
    ctx.lineTo(gwX + 80, gwY + 80);
    ctx.lineTo(gwX + 120, gwY + 30);
    ctx.rect(gwX + 120, gwY + 10, 30, 20);
    ctx.moveTo(gwX + 150, gwY + 25);
    ctx.lineTo(gwX + 220, gwY + 60);
    ctx.rect(gwX + 220, gwY + 40, 30, 20);
    ctx.moveTo(gwX + 250, gwY + 55);
    ctx.lineTo(gwX + 320, gwY + 130);
    ctx.stroke();
    ctx.restore();

    // 7. Left side: High-fidelity Chinese National Emblem
    const emblemX = cardX + 200;
    const emblemY = cardY + 230;
    const r = 95;

    ctx.save();
    // Background red circle
    ctx.fillStyle = "#E63946";
    ctx.beginPath();
    ctx.arc(emblemX, emblemY, r, 0, Math.PI * 2);
    ctx.fill();

    // Golden border
    ctx.lineWidth = 9;
    ctx.strokeStyle = "#FFD700";
    ctx.stroke();

    // Golden Inner stars
    drawStar(ctx, emblemX, emblemY - 32, 5, 20, 9, "#FFD700"); // Big star
    // 4 small stars arc
    drawStar(ctx, emblemX - 42, emblemY - 12, 5, 8, 4, "#FFD700");
    drawStar(ctx, emblemX - 28, emblemY + 16, 5, 8, 4, "#FFD700");
    drawStar(ctx, emblemX + 28, emblemY + 16, 5, 8, 4, "#FFD700");
    drawStar(ctx, emblemX + 42, emblemY - 12, 5, 8, 4, "#FFD700");

    // Tiananmen representation
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(emblemX - 55, emblemY + 36, 110, 16);
    ctx.fillRect(emblemX - 35, emblemY + 22, 70, 14);
    ctx.restore();

    // 8. Right Side: Bold Texts
    ctx.textAlign = "left";
    ctx.fillStyle = "#111111";
    ctx.font = "bold 44px SimHei, 'Microsoft YaHei', sans-serif";
    ctx.fillText("中华人民共和国", cardX + 440, cardY + 125);
    
    // "居 民 身 份 证" with wide spaced letter matching the template exactly!
    ctx.fillStyle = "#111111";
    ctx.font = "bold 56px SimHei, 'Microsoft YaHei', sans-serif";
    ctx.fillText("居 民 身 份 证", cardX + 440, cardY + 225);

    // Issuer and Validity Fields at the bottom
    const fieldX = cardX + 445;
    const valOffsetX = 145; // Perfect gap
    const rowY1 = cardY + 380;
    const rowY2 = cardY + 460;

    ctx.fillStyle = "#222222"; // Authentic black/gray label text
    ctx.font = "bold 21px SimHei, 'Microsoft YaHei', sans-serif";
    ctx.fillText("签发机关", fieldX, rowY1);
    ctx.fillStyle = "#111111";
    ctx.font = "bold 21px 'Microsoft YaHei', SimHei, sans-serif";
    ctx.fillText(d.authority || "", fieldX + valOffsetX, rowY1);

    ctx.fillStyle = "#222222";
    ctx.font = "bold 21px SimHei, 'Microsoft YaHei', sans-serif";
    ctx.fillText("有效期限", fieldX, rowY2);
    ctx.fillStyle = "#111111";
    ctx.font = "bold 21px 'Microsoft YaHei', SimHei, sans-serif";
    const validityStr = `${d.validityStart || ""}-${d.validityEnd || ""}`; // Clean OCR validity format
    ctx.fillText(validityStr, fieldX + valOffsetX, rowY2);

    ctx.restore(); // Restore rounded corner clipping

    // 9. Draw card outer 3D border stroke for perfect high-fidelity edge aesthetics
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 2;
    pathRoundRect(ctx, cardX, cardY, cardW, cardH, radius);
    ctx.stroke();
  };

  // 4. DRAW HK BUSINESS REGISTRATION
  const drawHKBusinessRegistration = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    d: HKBusinessRegistrationFields,
    style: BackgroundStyle
  ) => {
    // 1. Clean white sheet background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, w, h);

    // 2. Top Red Instructions Guidelines (Crimson Red)
    ctx.textAlign = "left";
    ctx.fillStyle = "#D91B24";
    ctx.font = "bold 15px SimSun, 'Microsoft YaHei', SimHei, sans-serif";
    ctx.fillText("繳款後，請沿虛線剪下並將有效的商業/分行登記證展示在營業地點。", 60, 45);
    ctx.font = "bold 13px Arial, sans-serif";
    ctx.fillText("Please cut along the dotted line after making payment and display the valid business/branch registration certificate at business address.", 60, 68);

    // 3. Draw Outer Dotted Rectangle representing the cut-out section
    ctx.save();
    ctx.strokeStyle = "#444444";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 5]);
    ctx.strokeRect(60, 95, 1080, 1055);
    ctx.restore();

    // 4. Scissor Icon on top dotted line
    ctx.fillStyle = "#222222";
    ctx.font = "20px Arial";
    ctx.fillText("✂", 65, 102);

    // 5. Draw light greenish/cream security pattern paper background inside the cut-out portion
    ctx.fillStyle = "#FCFAF3";
    ctx.fillRect(61, 96, 1078, 1053);

    // Subtle secure wavy background pattern for OCR texture
    ctx.save();
    ctx.strokeStyle = "rgba(78, 117, 93, 0.02)";
    ctx.lineWidth = 1.5;
    for (let i = 120; i < 1100; i += 40) {
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, i, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // 6. Header Titles (Chinese & English)
    ctx.fillStyle = "#222222";
    ctx.textAlign = "left";
    ctx.font = "bold 14px SimHei, 'Microsoft YaHei', sans-serif";
    ctx.fillText("正    本", 100, 138);
    ctx.font = "bold 12px Arial, sans-serif";
    ctx.fillText("ORIGINAL", 100, 155);

    ctx.font = "12px 'Courier New', monospace";
    ctx.fillStyle = "#444444";
    ctx.fillText("XKXXXXXXX", 100, 180);
    ctx.fillText("XXKXXXXXX", 100, 196);

    // Center header titles
    ctx.textAlign = "center";
    ctx.fillStyle = "#111111";
    ctx.font = "bold 15px SimSun, SimHei, sans-serif";
    ctx.fillText("表格 2      FORM 2", (60 + 1100) / 2, 125);
    ctx.font = "bold 17px SimSun, serif";
    ctx.fillText("《商業登記條例》(第 310 章)", (60 + 1100) / 2, 146);
    ctx.font = "bold 14px Arial, sans-serif";
    ctx.fillText("BUSINESS REGISTRATION ORDINANCE (Chapter 310)", (60 + 1100) / 2, 166);
    ctx.font = "bold 15px SimSun, serif";
    ctx.fillText("《商業登記規例》", (60 + 1100) / 2, 186);
    ctx.font = "bold 12px Arial, sans-serif";
    ctx.fillText("BUSINESS REGISTRATION REGULATIONS", (60 + 1100) / 2, 204);

    // Regulation 5 label top-right
    ctx.textAlign = "right";
    ctx.fillStyle = "#222222";
    ctx.font = "bold 14px SimSun, sans-serif";
    ctx.fillText("[第 5 條]", 1100, 138);
    ctx.font = "bold 12px Arial, sans-serif";
    ctx.fillText("[regulation 5]", 1100, 155);

    // Business Registration Certificate title centered
    ctx.textAlign = "center";
    ctx.fillStyle = "#000000";
    ctx.font = "bold 20px SimSun, SimHei, sans-serif";
    ctx.fillText("商業登記證     Business Registration Certificate", (60 + 1100) / 2, 238);

    // 7. Wide Barcode
    const barcodeX = 200;
    const barcodeY = 255;
    const barcodeW = 800;
    const barcodeH = 50;
    drawBarcode(ctx, barcodeX, barcodeY, barcodeW, barcodeH, d.brNumber || "");

    // 8. Key-Value Fields Grid layout
    const labelX = 100;
    const valueX = 350;
    const fieldLabelFontChi = "bold 15px SimSun, sans-serif";
    const fieldLabelFontEng = "bold 13px Arial, sans-serif";
    const fieldValueFontChi = "bold 18px SimSun, SimHei, sans-serif";
    const fieldValueFontEng = "bold 18px Arial, sans-serif";
    const labelColor = "#333333";

    // Row 1: Name of Business / Corporation
    ctx.textAlign = "left";
    ctx.fillStyle = labelColor;
    ctx.font = fieldLabelFontChi;
    ctx.fillText("業務 / 法團所用名稱", labelX, 362);
    ctx.font = fieldLabelFontEng;
    ctx.fillText("Name of Business/", labelX, 378);
    ctx.fillText("Corporation", labelX, 393);

    ctx.fillStyle = "#111111";
    ctx.font = fieldValueFontChi;
    ctx.fillText(d.nameChinese || "", valueX, 365);
    ctx.font = fieldValueFontEng;
    ctx.fillText(d.nameEnglish || "", valueX, 390);

    // Row 2: Business / Branch Name (Typically printed as stars)
    ctx.fillStyle = labelColor;
    ctx.font = fieldLabelFontChi;
    ctx.fillText("業務 / 分行名稱", labelX, 442);
    ctx.font = fieldLabelFontEng;
    ctx.fillText("Business/", labelX, 458);
    ctx.fillText("Branch Name", labelX, 473);

    ctx.fillStyle = "#111111";
    ctx.font = "bold 18px 'Courier New', monospace";
    ctx.fillText("**************************************************", valueX, 445);
    ctx.fillText("**************************************************", valueX, 470);

    // Row 3: Address
    ctx.fillStyle = labelColor;
    ctx.font = fieldLabelFontChi;
    ctx.fillText("地址", labelX, 520);
    ctx.font = fieldLabelFontEng;
    ctx.fillText("Address", labelX, 536);

    ctx.fillStyle = "#111111";
    ctx.font = "bold 18px Arial, sans-serif";
    const addrLines = (d.address || "").split("\n");
    addrLines.forEach((line, idx) => {
      ctx.fillText(line.toUpperCase(), valueX, 520 + idx * 24);
    });

    // Row 4: Nature of Business
    const natureY = 640;
    ctx.fillStyle = labelColor;
    ctx.font = fieldLabelFontChi;
    ctx.fillText("業務性質", labelX, natureY);
    ctx.font = fieldLabelFontEng;
    ctx.fillText("Nature of Business", labelX, natureY + 16);

    ctx.fillStyle = "#111111";
    ctx.font = fieldValueFontChi;
    ctx.fillText(d.natureChinese || "", valueX, natureY + 3);
    ctx.font = fieldValueFontEng;
    ctx.fillText(d.natureEnglish || "", valueX, natureY + 26);

    // Row 5: Legal Status
    const statusY = 708;
    ctx.fillStyle = labelColor;
    ctx.font = fieldLabelFontChi;
    ctx.fillText("法律地位", labelX, statusY);
    ctx.font = fieldLabelFontEng;
    ctx.fillText("Status", labelX, statusY + 16);

    ctx.fillStyle = "#111111";
    ctx.font = fieldValueFontEng;
    ctx.fillText((d.statusEnglish || "BODY CORPORATE").toUpperCase(), valueX, statusY + 10);

    // Row 6: Dates, Certificate Number & Fee / Levy Grid
    const gridY = 770;
    
    // Column 1: Commencement Date
    ctx.fillStyle = labelColor;
    ctx.font = fieldLabelFontChi;
    ctx.fillText("生效日期", labelX, gridY);
    ctx.font = fieldLabelFontEng;
    ctx.fillText("Date of Commencement", labelX, gridY + 16);
    ctx.fillStyle = "#000000";
    ctx.font = "bold 22px 'Courier New', monospace";
    ctx.fillText(d.commencementDate || "", labelX, gridY + 45);

    // Column 2: Expiry Date
    const expiryX = 320;
    ctx.fillStyle = labelColor;
    ctx.font = fieldLabelFontChi;
    ctx.fillText("屆滿日期", expiryX, gridY);
    ctx.font = fieldLabelFontEng;
    ctx.fillText("Date of Expiry", expiryX, gridY + 16);
    ctx.fillStyle = "#000000";
    ctx.font = "bold 22px 'Courier New', monospace";
    ctx.fillText(d.expiryDate || "", expiryX, gridY + 45);

    // Column 3: Certificate No.
    const certX = 540;
    ctx.fillStyle = labelColor;
    ctx.font = fieldLabelFontChi;
    ctx.fillText("登記證號碼", certX, gridY);
    ctx.font = fieldLabelFontEng;
    ctx.fillText("Certificate No.", certX, gridY + 16);
    ctx.fillStyle = "#000000";
    ctx.font = "bold 22px 'Courier New', monospace";
    ctx.fillText(d.brNumber || "", certX, gridY + 45);

    // Column 4: Fee and Levy
    const feeX = 880;
    ctx.fillStyle = labelColor;
    ctx.font = fieldLabelFontChi;
    ctx.fillText("登記費及徵費", feeX, gridY);
    ctx.font = fieldLabelFontEng;
    ctx.fillText("Fee and Levy", feeX, gridY + 16);

    const cleanFee = d.fee ? d.fee.replace(/[^\d.,]/g, "") : "2,000.00";
    const cleanLevy = d.levy ? d.levy.replace(/[^\d.,]/g, "") : "150.00";
    const cleanTotal = d.total ? d.total.replace(/[^\d.,]/g, "") : "2,150.00";

    ctx.fillStyle = "#000000";
    ctx.font = "bold 24px Arial, sans-serif";
    ctx.fillText(`$${cleanTotal}`, feeX, gridY + 45);
    ctx.font = "12px SimSun, sans-serif";
    ctx.fillText(`（登記費 FEE = $${cleanFee}）`, feeX, gridY + 64);
    ctx.fillText(`（徵費 LEVY = $   ${cleanLevy.replace(".00", "")}）`, feeX, gridY + 80);

    // 9. Bilingual Notes Section from Ordinance
    const notesY = 895;
    ctx.fillStyle = "#111111";
    ctx.font = "bold 14px SimSun, SimHei, sans-serif";
    ctx.fillText("請注意下列《商業登記條例》的規定：", labelX, notesY);
    
    ctx.font = "bold 13px Arial, sans-serif";
    ctx.fillText("Please note the following requirements of the Business Registration Ordinance:", 560, notesY);

    // Note paragraphs in two parallel columns
    const chiSec1 = [
      "1. 第 6(6)條規定任何業務獲發商業登記證或",
      "   分行登記證，並不表示該業務或經營該業",
      "   務的人或受僱於該業務的僱員已遵守有關",
      "   的任何法律規定。"
    ];
    const chiSec2 = [
      "2. 第 12 條規定各業務須將其有效的商業登記",
      "   證或有效的分行登記證於每一營業地點展",
      "   示。"
    ];

    const engSec1 = [
      "1. Section 6(6) provides that the issue of a business",
      "   registration certificate or a branch registration certificate",
      "   shall not be deemed to imply that the requirements of any",
      "   law in relation to such business or to the persons carrying",
      "   on the same or employed therein have been complied with."
    ];
    const engSec2 = [
      "2. Section 12 provides that valid business registration",
      "   certificate or valid branch registration certificate shall be",
      "   displayed at every address where business is carried on."
    ];

    ctx.font = "12px SimSun, sans-serif";
    ctx.fillStyle = "#333333";
    chiSec1.forEach((line, idx) => ctx.fillText(line, labelX, notesY + 22 + idx * 18));
    chiSec2.forEach((line, idx) => ctx.fillText(line, labelX, notesY + 104 + idx * 18));

    ctx.font = "11px Arial, sans-serif";
    engSec1.forEach((line, idx) => ctx.fillText(line, 560, notesY + 22 + idx * 15));
    engSec2.forEach((line, idx) => ctx.fillText(line, 560, notesY + 104 + idx * 15));

    // 10. Bottom disclaimer rows
    const footerY = 1060;
    ctx.textAlign = "left";
    ctx.fillStyle = "#444444";
    ctx.font = "12px SimSun, sans-serif";
    ctx.fillText("繳款時將此商業登記證及繳款通知書完整交付。在付款後，本繳款通知書方成為有效的商業登記證。(請參閱背頁繳款辦法所載內容。)", labelX, footerY);
    ctx.font = "11px Arial, sans-serif";
    ctx.fillText("Please produce this certificate and demand note intact at time of payment. This demand note will only become a valid business/branch registration certificate upon payment. (Please see payment instructions overleaf.)", labelX, footerY + 16);
    
    ctx.fillStyle = "#222222";
    ctx.font = "bold 12px Arial, SimSun, sans-serif";
    ctx.fillText("機印所示登記費及徵費收訖。 RECEIVED FEE AND LEVY HERE STATED IN PRINTED FIGURES.", labelX, footerY + 36);

    // 11. Authentic Teal Monospace Machine-Printed Ink Row at the bottom
    const issueDateParts = (d.commencementDate || "").split("/");
    const payDate = issueDateParts.length === 3 ? `${issueDateParts[2].substring(2)}/${issueDateParts[1]}/${issueDateParts[0]}` : "25/11/23";
    const receiptNum = getRandomInt(10000000, 99999999);
    const codeNum = getRandomInt(100000, 999999);
    const printedText = `EP20201  ${payDate}  ${receiptNum} ${codeNum} CHQ         $${cleanTotal}   H`;

    ctx.font = "bold 16px 'Courier New', monospace";
    ctx.fillStyle = "#1D4173"; // Realistic deep blue-teal printed ink color
    ctx.fillText(printedText, labelX, footerY + 68);
  };

  // 5. DRAW HK HOME RETURN PERMIT
  const drawHKHomeReturnPermit = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    d: HomeReturnPermitFields,
    style: BackgroundStyle
  ) => {
    // 1. Black border for edge/contrast detection
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);

    const pad = 12;
    const cardW = w - pad * 2;
    const cardH = h - pad * 2;
    const cardX = pad;
    const cardY = pad;
    const radius = 32;

    // Clip to rounded card rect
    ctx.save();
    pathRoundRect(ctx, cardX, cardY, cardW, cardH, radius);
    ctx.clip();

    // 2. Main beautiful pinkish-blue background gradient (matching attachment)
    const grad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
    grad.addColorStop(0, "#FCEBEB"); // Soft lavender-pink top-left
    grad.addColorStop(0.3, "#E8EFFE"); // Soft blue-cyan center-left
    grad.addColorStop(0.7, "#FDE2E4"); // Soft pink center-right
    grad.addColorStop(1, "#E8F5FC"); // Soft blue-cyan bottom-right
    ctx.fillStyle = grad;
    ctx.fillRect(cardX, cardY, cardW, cardH);

    // 3. Pink/blue wave security lines (matching attachment)
    ctx.save();
    ctx.strokeStyle = "rgba(225, 85, 125, 0.08)"; // Pink security curves
    ctx.lineWidth = 1.2;
    for (let i = cardY - 50; i < cardY + cardH + 50; i += 22) {
      ctx.beginPath();
      ctx.moveTo(cardX, i);
      ctx.bezierCurveTo(cardX + cardW * 0.35, i + 45, cardX + cardW * 0.65, i - 45, cardX + cardW, i + 10);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(10, 115, 205, 0.05)"; // Blue security curves
    for (let i = cardY - 50; i < cardY + cardH + 50; i += 26) {
      ctx.beginPath();
      ctx.moveTo(cardX, i);
      ctx.bezierCurveTo(cardX + cardW * 0.45, i - 35, cardX + cardW * 0.75, i + 35, cardX + cardW, i - 15);
      ctx.stroke();
    }
    ctx.restore();

    // 4. Draw Header Title in dark crimson-red
    ctx.textAlign = "left";
    ctx.fillStyle = "#A22238"; // Real crimson/maroon red
    ctx.font = "bold 36px 'Microsoft YaHei', SimHei, sans-serif";
    ctx.fillText("港澳居民来往内地通行证", cardX + 298, cardY + 75);

    // 5. Draw Machine-Readable gold/green chip icon on the top right
    ctx.save();
    const chipX = cardX + 805;
    const chipY = cardY + 38;
    // Draw outer frame
    ctx.strokeStyle = "rgba(60, 120, 90, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.fillStyle = "rgba(225, 235, 220, 0.4)";
    pathRoundRect(ctx, chipX, chipY, 65, 45, 8);
    ctx.fill();
    ctx.stroke();
    // Draw concentric ring inside
    ctx.strokeStyle = "#C5A14E"; // gold color
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(chipX + 32.5, chipY + 22.5, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#C5A14E";
    ctx.beginPath();
    ctx.arc(chipX + 32.5, chipY + 22.5, 4, 0, Math.PI * 2);
    ctx.fill();
    // Inner chip horizontal lines
    ctx.strokeStyle = "rgba(60, 120, 90, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(chipX + 8, chipY + 22.5);
    ctx.lineTo(chipX + 20, chipY + 22.5);
    ctx.moveTo(chipX + 45, chipY + 22.5);
    ctx.lineTo(chipX + 57, chipY + 22.5);
    ctx.stroke();
    ctx.restore();

    // 6. Primary Portrait Photo on the LEFT
    drawMockPortrait(ctx, cardX + 48, cardY + 158, 210, 280, d.gender === "男" ? "male_hk" : "female_hk");

    // 7. Text Fields (strictly matching layout)
    // Chinese Name (large black text, no labels)
    ctx.textAlign = "left";
    ctx.fillStyle = "#111111";
    ctx.font = "bold 36px 'Microsoft YaHei', SimHei, sans-serif";
    ctx.fillText(d.nameChinese, cardX + 298, cardY + 152);

    // English Name
    ctx.fillStyle = "#111111";
    ctx.font = "bold 28px Arial, sans-serif";
    ctx.fillText(d.nameEnglish, cardX + 298, cardY + 202);

    // Columns of fields
    const labelColor = "#4A607A"; // Soft grey-blue label color
    const fieldLabelFont = "bold 15px SimHei, sans-serif";
    const fieldValueFont = "bold 28px 'Courier New', monospace, Arial";

    // Column 1: Birth Date
    ctx.fillStyle = labelColor;
    ctx.font = fieldLabelFont;
    ctx.fillText("出生日期", cardX + 298, cardY + 242);
    ctx.fillStyle = "#111111";
    ctx.font = fieldValueFont;
    ctx.fillText(d.birthDate, cardX + 298, cardY + 282);

    // Column 2: Gender
    ctx.fillStyle = labelColor;
    ctx.font = fieldLabelFont;
    ctx.fillText("性别", cardX + 638, cardY + 242);
    ctx.fillStyle = "#111111";
    ctx.font = "bold 28px 'Microsoft YaHei', SimHei, sans-serif";
    ctx.fillText(d.gender, cardX + 638, cardY + 282);

    // Validity Period
    ctx.fillStyle = labelColor;
    ctx.font = fieldLabelFont;
    ctx.fillText("有效期限", cardX + 298, cardY + 328);
    ctx.fillStyle = "#111111";
    ctx.font = fieldValueFont;
    ctx.fillText(d.validityPeriod, cardX + 298, cardY + 368);

    // Issuing Authority
    ctx.fillStyle = labelColor;
    ctx.font = fieldLabelFont;
    ctx.fillText("签发机关", cardX + 298, cardY + 414);
    ctx.fillStyle = "#111111";
    ctx.font = "bold 26px 'Microsoft YaHei', SimHei, sans-serif";
    ctx.fillText(d.authority, cardX + 298, cardY + 454);

    // Card Number and Renewal Count
    ctx.fillStyle = labelColor;
    ctx.font = fieldLabelFont;
    ctx.fillText("证件号码", cardX + 298, cardY + 500);
    ctx.fillStyle = "#133863"; // Deep slate-blue for card number
    ctx.font = "bold 32px 'Courier New', monospace, Arial";
    ctx.fillText(d.idNumber, cardX + 298, cardY + 544);

    ctx.fillStyle = labelColor;
    ctx.font = fieldLabelFont;
    ctx.fillText("换证次数", cardX + 638, cardY + 500);
    ctx.fillStyle = "#133863";
    ctx.font = "bold 32px 'Courier New', monospace, Arial";
    ctx.fillText(d.renewalCount, cardX + 638, cardY + 544);

    // 8. Faded Ghost Portrait on Bottom Right
    ctx.save();
    ctx.globalAlpha = 0.22; // beautiful high-fidelity faded ghost
    drawMockPortrait(ctx, cardX + 762, cardY + 372, 126, 168, d.gender === "男" ? "male_hk" : "female_hk");
    ctx.restore();

    // 9. Red Warning/Information text at the bottom center
    ctx.textAlign = "center";
    ctx.fillStyle = "#9C1A2F"; // Soft maroon-red
    ctx.font = "bold 13px Arial, sans-serif";
    ctx.fillText("THIS CARD IS INTENDED FOR ITS HOLDER TO TRAVEL TO THE MAINLAND OF CHINA", cardX + cardW / 2, cardY + 588);

    // 10. Outer gold/yellow card outline
    ctx.strokeStyle = "#ECC166";
    ctx.lineWidth = 6;
    pathRoundRect(ctx, cardX, cardY, cardW, cardH, radius);
    ctx.stroke();

    ctx.restore();
  };

  // 5b. DRAW HK HOME RETURN PERMIT BACK
  const drawHKHomeReturnPermitBack = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    d: HomeReturnPermitFields,
    style: BackgroundStyle
  ) => {
    // 1. Black border for edge/contrast detection
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);

    const pad = 12;
    const cardW = w - pad * 2;
    const cardH = h - pad * 2;
    const cardX = pad;
    const cardY = pad;
    const radius = 32;

    // Clip to rounded card rect
    ctx.save();
    pathRoundRect(ctx, cardX, cardY, cardW, cardH, radius);
    ctx.clip();

    // 2. Background gradient & security waves (exactly same as front to maintain style unity)
    const grad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
    grad.addColorStop(0, "#FCEBEB");
    grad.addColorStop(0.3, "#E8EFFE");
    grad.addColorStop(0.7, "#FDE2E4");
    grad.addColorStop(1, "#E8F5FC");
    ctx.fillStyle = grad;
    ctx.fillRect(cardX, cardY, cardW, cardH);

    ctx.save();
    ctx.strokeStyle = "rgba(225, 85, 125, 0.08)";
    ctx.lineWidth = 1.2;
    for (let i = cardY - 50; i < cardY + cardH + 50; i += 22) {
      ctx.beginPath();
      ctx.moveTo(cardX, i);
      ctx.bezierCurveTo(cardX + cardW * 0.35, i + 45, cardX + cardW * 0.65, i - 45, cardX + cardW, i + 10);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(10, 115, 205, 0.05)";
    for (let i = cardY - 50; i < cardY + cardH + 50; i += 26) {
      ctx.beginPath();
      ctx.moveTo(cardX, i);
      ctx.bezierCurveTo(cardX + cardW * 0.45, i - 35, cardX + cardW * 0.75, i + 35, cardX + cardW, i - 15);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Top Row: HK Name and HKID Number
    const labelColor = "#4A607A";
    ctx.textAlign = "left";

    // HK Chinese Traditional Name
    ctx.fillStyle = labelColor;
    ctx.font = "bold 15px SimHei, sans-serif";
    ctx.fillText("香港身份证件姓名", cardX + 48, cardY + 55);
    ctx.fillStyle = "#111111";
    ctx.font = "bold 28px 'Microsoft YaHei', SimHei, sans-serif";
    ctx.fillText(d.hkNameTraditional || d.nameChinese, cardX + 48, cardY + 95);

    // HKID Card Number
    ctx.fillStyle = labelColor;
    ctx.font = "bold 15px SimHei, sans-serif";
    ctx.fillText("香港身份证件号码", cardX + 608, cardY + 55);
    ctx.fillStyle = "#111111";
    ctx.font = "bold 28px 'Courier New', monospace, Arial";
    ctx.fillText(d.hkidNumber, cardX + 608, cardY + 95);

    // 4. Middle Section: Former permit details (very neat center box)
    ctx.fillStyle = "#333333";
    ctx.font = "bold 23px SimHei, 'Microsoft YaHei', sans-serif";
    ctx.fillText(`持证人曾持有号码为${d.idNumber}XX的通行证`, cardX + 85, cardY + 235);
    ctx.font = "18px SimHei, 'Microsoft YaHei', sans-serif";
    ctx.fillText(`(XX为从00至99的数字，表示换证次数)`, cardX + 85, cardY + 280);

    // 5. Vertical serial number on the right (highly authentic detail!)
    ctx.save();
    ctx.translate(cardX + cardW - 35, cardY + 245);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = "#444444";
    ctx.font = "14px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText("000000173", 0, 0);
    ctx.restore();

    // 6. Draw subtle pink divider strip above MRZ
    ctx.fillStyle = "rgba(225, 85, 125, 0.15)";
    ctx.fillRect(cardX, cardY + 355, cardW, 6);

    // 7. Bottom Section: High-fidelity Machine Readable Zone (MRZ)
    // Construct real dynamic TD1 3-line MRZ characters!
    let birthYYMMDD = "900101";
    if (d.birthDate) {
      const bParts = d.birthDate.split(".");
      if (bParts.length === 3) {
        birthYYMMDD = bParts[0].substring(2) + bParts[1] + bParts[2];
      }
    }

    let expiryYYMMDD = "291231";
    if (d.validityPeriod && d.validityPeriod.includes("-")) {
      const vParts = d.validityPeriod.split("-");
      if (vParts.length > 1) {
        const expDate = vParts[1].trim();
        const eParts = expDate.split(".");
        if (eParts.length === 3) {
          expiryYYMMDD = eParts[0].substring(2) + eParts[1] + eParts[2];
        }
      }
    }

    // Line 1: Type (CR) + Permit Num (H12345678) + Chk (3) + Renewal (10) + Chk (7) + Expiry (230101) + Chk (1) + Gender (F) + Birth (700228) + Chk (7)
    const genderLetter = d.gender === "男" ? "M" : "F";
    const line1 = `CR${d.idNumber}3${d.renewalCount}7${expiryYYMMDD}1${genderLetter}${birthYYMMDD}7`;

    // Line 2: HKID representation inside MRZ
    const hkidClean = d.hkidNumber.replace(/[()]/g, ""); // A12345678
    const line2 = `MBPFNMMGMALM<<<<AA${hkidClean}44`.padEnd(30, "<").substring(0, 30);

    // Line 3: English Name in ICAO MRZ format
    const formatEnglishNameMRZ = (engName: string): string => {
      const parts = engName.split(",");
      if (parts.length < 2) return engName.trim().replace(/ /g, "<").padEnd(30, "<").substring(0, 30);
      const surname = parts[0].trim().replace(/ /g, "<");
      const givenNames = parts[1].trim().replace(/ /g, "<");
      return `${surname}<<${givenNames}`.padEnd(30, "<").substring(0, 30);
    };
    const line3 = formatEnglishNameMRZ(d.nameEnglish);

    // Draw the 3 MRZ lines character-by-character with extra letter-spacing for maximum OCR clarity
    const drawMRZLine = (text: string, startY: number) => {
      ctx.save();
      ctx.font = "bold 32px 'Courier New', monospace";
      ctx.fillStyle = "#111111";
      ctx.textAlign = "left";
      const charWidth = 26; // perfect horizontal cell spacing
      const startX = cardX + 75;
      for (let i = 0; i < text.length; i++) {
        ctx.fillText(text[i], startX + i * charWidth, startY);
      }
      ctx.restore();
    };

    drawMRZLine(line1, cardY + 438);
    drawMRZLine(line2, cardY + 494);
    drawMRZLine(line3, cardY + 550);

    // 8. Outer gold/yellow card outline
    ctx.strokeStyle = "#ECC166";
    ctx.lineWidth = 6;
    pathRoundRect(ctx, cardX, cardY, cardW, cardH, radius);
    ctx.stroke();

    ctx.restore();
  };

  // --- SUB-DRAWERS (STAMPS, BARCODES, QR CODES) ---

  const drawStar = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number,
    color: string
  ) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  };

  // Draws a beautiful red mainland seal (公章) with curved text!
  const drawOfficialRedSeal = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    text: string
  ) => {
    ctx.save();
    
    // Slightly semi-transparent for realistic overlay feel
    ctx.strokeStyle = "rgba(230, 40, 40, 0.78)";
    ctx.fillStyle = "rgba(230, 40, 40, 0.78)";
    ctx.lineWidth = 5;

    // Draw outer circle
    const radius = 80;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw center star
    drawStar(ctx, cx, cy, 5, 20, 8, "rgba(230, 40, 40, 0.78)");

    // Draw curved text (from left to right along top half of circle)
    ctx.font = "bold 13px SimSun, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const characters = text ? text.split("") : "中国市场监督管理局".split("");
    const angleRange = Math.PI * 1.3; // arc length
    const startAngle = Math.PI * 1.5 - angleRange / 2;
    const angleStep = angleRange / (characters.length - 1);

    for (let i = 0; i < characters.length; i++) {
      const angle = startAngle + i * angleStep;
      ctx.save();
      ctx.translate(
        cx + Math.cos(angle) * (radius - 18),
        cy + Math.sin(angle) * (radius - 18)
      );
      // Rotate text to point outwards
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillText(characters[i], 0, 0);
      ctx.restore();
    }

    // Inner security star or serial number at the bottom of seal
    ctx.font = "10px SimSun";
    ctx.fillText("91440101M", cx, cy + radius - 25);

    ctx.restore();
  };

  // Draw HK Inland Revenue Stamp (Commissioner of Inland Revenue)
  const drawCommissionerStamp = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number
  ) => {
    ctx.save();
    // Blue stamp ink
    ctx.strokeStyle = "rgba(50, 60, 200, 0.65)";
    ctx.fillStyle = "rgba(50, 60, 200, 0.65)";
    ctx.lineWidth = 3;

    // Outer oval shape
    ctx.beginPath();
    ctx.ellipse(cx, cy, 75, 45, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Inside Stamp texts
    ctx.font = "9px Arial";
    ctx.textAlign = "center";
    ctx.fillText("INLAND REVENUE DEPARTMENT", cx, cy - 18);
    
    ctx.font = "bold 11px SimSun, Arial";
    ctx.fillText("★ 已缴费 / RECEIVED ★", cx, cy);

    ctx.font = "9px Arial";
    ctx.fillText("HONG KONG GOVERNMENT", cx, cy + 18);

    ctx.restore();
  };

  // Draws a highly realistic mock QR code
  const drawMockQRCode = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ) => {
    ctx.save();
    // QR Border
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x - 5, y - 5, size + 10, size + 10);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, size, size);

    ctx.fillStyle = "#000000";
    const cells = 25; // 25x25 grid
    const cellSize = size / cells;

    // Draw anchors at three corners: top-left, top-right, bottom-left
    const drawAnchor = (ax: number, ay: number) => {
      // Outer box (7x7 cells)
      ctx.fillRect(ax, ay, cellSize * 7, cellSize * 7);
      // Inner white (5x5)
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(ax + cellSize, ay + cellSize, cellSize * 5, cellSize * 5);
      // Inner black center (3x3)
      ctx.fillStyle = "#000000";
      ctx.fillRect(ax + cellSize * 2, ay + cellSize * 2, cellSize * 3, cellSize * 3);
    };

    drawAnchor(x, y); // Top Left
    drawAnchor(x + size - cellSize * 7, y); // Top Right
    drawAnchor(x, y + size - cellSize * 7); // Bottom Left

    // Draw some random pixels inside
    ctx.fillStyle = "#000000";
    for (let row = 0; row < cells; row++) {
      for (let col = 0; col < cells; col++) {
        // Skip anchor locations
        if (row < 8 && col < 8) continue;
        if (row < 8 && col >= cells - 8) continue;
        if (row >= cells - 8 && col < 8) continue;

        // Skip alignment pattern (usually near bottom right)
        if (row >= cells - 10 && row < cells - 5 && col >= cells - 10 && col < cells - 5) {
          continue;
        }

        if (Math.random() > 0.45) {
          ctx.fillRect(
            x + col * cellSize,
            y + row * cellSize,
            cellSize + 0.5,
            cellSize + 0.5
          );
        }
      }
    }

    // Alignment pattern near bottom right (5x5)
    const ax = x + size - cellSize * 9;
    const ay = y + size - cellSize * 9;
    ctx.fillRect(ax, ay, cellSize * 5, cellSize * 5);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(ax + cellSize, ay + cellSize, cellSize * 3, cellSize * 3);
    ctx.fillStyle = "#000000";
    ctx.fillRect(ax + cellSize * 2, ay + cellSize * 2, cellSize, cellSize);

    ctx.restore();
  };

  // Draws a highly realistic mock Barcode
  const drawBarcode = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    text: string
  ) => {
    ctx.save();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x - 5, y - 5, w + 10, h + 25);

    ctx.fillStyle = "#000000";
    let currX = x + 10;
    const endX = x + w - 10;

    // Generate random but patterned lines
    while (currX < endX) {
      const thickness = Math.random() > 0.6 ? 4 : Math.random() > 0.3 ? 2 : 1;
      ctx.fillRect(currX, y, thickness, h);
      const gap = getRandomInt(1, 4);
      currX += thickness + gap;
    }

    // Draw barcode text underneath
    ctx.font = "11px Courier New, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`*${text}*`, x + w / 2, y + h + 15);
    ctx.restore();
  };

  // Draw a very neat, modern flat profile portrait avatar (avoiding broken external images)
  const drawMockPortrait = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    gender: "male" | "female" | "male_hk" | "female_hk"
  ) => {
    ctx.save();
    
    // Create clipping path for the portrait box to avoid spilling shoulders/hair/etc.
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    
    // Draw background (blue/gray ID standard)
    const photoBg = gender.includes("_hk") ? "#A9C1D9" : "#BED4F0";
    ctx.fillStyle = photoBg;
    ctx.fillRect(x, y, w, h);

    // Subtle vignette or gradient in portrait photo background
    const pGrad = ctx.createRadialGradient(x + w / 2, y + h / 2, 20, x + w / 2, y + h / 2, w / 1.2);
    pGrad.addColorStop(0, "rgba(255, 255, 255, 0.4)");
    pGrad.addColorStop(1, "rgba(0, 0, 0, 0.1)");
    ctx.fillStyle = pGrad;
    ctx.fillRect(x, y, w, h);

    // Draw Shoulders (dark blue/dark gray suit/shirt)
    ctx.fillStyle = gender.includes("male") ? "#2B3D52" : "#724C5B";
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h + 10, w * 0.45, h * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // White shirt collar
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 5;
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.moveTo(x + w / 2 - 35, y + h - h * 0.2);
    ctx.lineTo(x + w / 2, y + h - h * 0.1);
    ctx.lineTo(x + w / 2 + 35, y + h - h * 0.2);
    ctx.stroke();

    // Draw Neck
    ctx.fillStyle = "#E8C1AC";
    ctx.fillRect(x + w / 2 - 25, y + h / 2 + 20, 50, 45);

    // Draw Head Oval
    ctx.fillStyle = "#F7D0BC";
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2 - 20, w * 0.26, h * 0.24, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw Ears
    ctx.fillStyle = "#E8C1AC";
    ctx.beginPath();
    ctx.arc(x + w / 2 - w * 0.26, y + h / 2 - 20, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w / 2 + w * 0.26, y + h / 2 - 20, 12, 0, Math.PI * 2);
    ctx.fill();

    // Draw Hair
    ctx.fillStyle = "#111111";
    if (gender.includes("male")) {
      // Short hair style
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h / 2 - 35, w * 0.28, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(x + w / 2 - w * 0.27, y + h / 2 - 35, 12, 30);
      ctx.fillRect(x + w / 2 + w * 0.27 - 12, y + h / 2 - 35, 12, 30);
    } else {
      // Female long hair style
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h / 2 - 35, w * 0.29, Math.PI, 0);
      ctx.fill();
      // Side flows
      ctx.fillRect(x + w / 2 - w * 0.28, y + h / 2 - 35, 25, 140);
      ctx.fillRect(x + w / 2 + w * 0.28 - 25, y + h / 2 - 35, 25, 140);
    }

    // Draw Simple Eyes, Eyebrows & Smile for realistic passport picture
    ctx.strokeStyle = "#4D362B";
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";

    // Eyebrows
    ctx.beginPath();
    ctx.arc(x + w / 2 - 28, y + h / 2 - 26, 12, 1.2 * Math.PI, 1.8 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + w / 2 + 28, y + h / 2 - 26, 12, 1.2 * Math.PI, 1.8 * Math.PI);
    ctx.stroke();

    // Eyes
    ctx.fillStyle = "#333333";
    ctx.beginPath();
    ctx.arc(x + w / 2 - 28, y + h / 2 - 14, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w / 2 + 28, y + h / 2 - 14, 5, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.strokeStyle = "#DDA28A";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y + h / 2 - 16);
    ctx.lineTo(x + w / 2, y + h / 2 + 5);
    ctx.lineTo(x + w / 2 - 8, y + h / 2 + 5);
    ctx.stroke();

    // Smile
    ctx.strokeStyle = "#C96D63";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2 + 10, 16, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    // Photo Border
    ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    ctx.restore();
  };

  // --- RENDERING CUSTOM OVERLAYS ---

  const drawOverlays = (
    ctx: CanvasRenderingContext2D,
    overlayList: CustomOverlay[],
    selectedId: string | null
  ) => {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    overlayList.forEach((o) => {
      const oX = (o.xPercent / 100) * w;
      const oY = (o.yPercent / 100) * h;

      ctx.save();
      
      // Styling
      let fontStyle = "";
      if (o.italic) fontStyle += "italic ";
      if (o.bold) fontStyle += "bold ";
      ctx.font = `${fontStyle}${o.fontSize}px "${o.fontFamily}", sans-serif`;
      ctx.fillStyle = o.color;
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";

      // Measure text for selection box
      const metrics = ctx.measureText(o.text);
      const textWidth = metrics.width;
      const textHeight = o.fontSize;

      // Draw active highlight if selected
      if (selectedId === o.id) {
        ctx.strokeStyle = "rgba(239, 68, 68, 0.85)"; // High contrast red border
        ctx.lineWidth = 2;
        ctx.strokeRect(
          oX - 10,
          oY - textHeight / 2 - 6,
          textWidth + 20,
          textHeight + 12
        );
        ctx.fillStyle = "rgba(239, 68, 68, 0.08)"; // Very light red overlay tint
        ctx.fillRect(
          oX - 10,
          oY - textHeight / 2 - 6,
          textWidth + 20,
          textHeight + 12
        );
        ctx.fillStyle = o.color; // Reset color
      }

      // Draw text
      ctx.fillText(o.text, oX, oY);
      ctx.restore();
    });
  };

  // --- REALISTIC SCAN AND CAMERA FILTERS ---

  const applyScanFilters = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();

    // 1. Light Scan line bands (simulating low-grade fluorescent lighting or camera rolling shutter)
    ctx.fillStyle = "rgba(0, 0, 0, 0.015)";
    for (let i = 0; i < h; i += 24) {
      const heightOffset = Math.sin(i / 100) * 12 + 12;
      ctx.fillRect(0, i, w, heightOffset);
    }

    // 2. High-contrast glare diagonal streak
    const glare = ctx.createLinearGradient(0, 0, w, h);
    glare.addColorStop(0, "rgba(255, 255, 255, 0)");
    glare.addColorStop(0.35, "rgba(255, 255, 255, 0)");
    glare.addColorStop(0.45, "rgba(255, 255, 255, 0.15)"); // Glare streak
    glare.addColorStop(0.55, "rgba(255, 255, 255, 0.12)");
    glare.addColorStop(0.65, "rgba(255, 255, 255, 0)");
    glare.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = glare;
    ctx.fillRect(0, 0, w, h);

    // 3. Vignette shadow (darker edges simulating phone camera lens)
    const vignette = ctx.createRadialGradient(w / 2, h / 2, w / 2.5, w / 2, h / 2, w * 0.8);
    vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    vignette.addColorStop(0.8, "rgba(0, 0, 0, 0.05)");
    vignette.addColorStop(1, "rgba(0, 0, 0, 0.22)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    // 4. Subtle chromatic aberration / slight blur overlay to look organic
    ctx.restore();
  };

  // --- TEXT WRAPPING HELPER ---

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text ? text.split("") : [];
    let line = "";
    let currY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n];
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currY);
        line = words[n];
        currY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currY);
  };

  return (
    <div className="relative w-full border border-gray-200 rounded-xl bg-slate-50/50 p-2 sm:p-4 shadow-inner flex justify-center items-center overflow-hidden">
      <div className="max-w-full overflow-auto flex justify-center">
        <canvas
          id={`ocr-canvas-${docType}`}
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          className={`${aspect} w-full max-w-xl md:max-w-2xl bg-white shadow-lg cursor-crosshair rounded-md border border-gray-100 select-none transition-all duration-300`}
        />
      </div>
      {selectedOverlayId && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-indigo-600/95 backdrop-blur text-white px-3.5 py-2 rounded-full text-xs font-semibold shadow-md flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
          <span>按住并拖拽红色框文字调整位置</span>
        </div>
      )}
    </div>
  );
}
