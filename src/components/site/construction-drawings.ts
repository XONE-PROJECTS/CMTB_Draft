import * as THREE from "three";
import type { SceneParts } from "./construction-parts";

type DrawingKind = "blueprint" | "masterplan";

export function drawTechnicalPlan(ctx: CanvasRenderingContext2D, kind: DrawingKind) {
  const blue = kind === "blueprint";
  const paper = blue ? "#123f70" : "#e8e6dc";
  const ink = blue ? "#d7efff" : "#344b47";
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, 1600, 1100);
  ctx.strokeStyle = blue ? "#ffffff12" : "#344b4710";
  ctx.lineWidth = 1;
  for (let x = 40; x < 1600; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1100); ctx.stroke(); }
  for (let y = 20; y < 1100; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1600, y); ctx.stroke(); }
  ctx.strokeStyle = ink;
  ctx.lineWidth = 2;
  ctx.strokeRect(32, 32, 1536, 1036);

  function line(points: number[][], color = ink, width = 2) {
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath();
    points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.stroke();
  }
  function text(value: string, x: number, y: number, size = 18, color = ink) {
    ctx.fillStyle = color; ctx.font = `${size}px ui-monospace, monospace`; ctx.fillText(value, x, y);
  }
  function rect(x: number, y: number, width: number, height: number, color = ink, weight = 2) {
    ctx.strokeStyle = color; ctx.lineWidth = weight; ctx.strokeRect(x, y, width, height);
  }
  function fill(x: number, y: number, width: number, height: number, color: string) {
    ctx.fillStyle = color; ctx.fillRect(x, y, width, height);
  }
  function dimension(x1: number, x2: number, y: number, label: string) {
    line([[x1, y - 15], [x1, y + 15]]); line([[x2, y - 15], [x2, y + 15]]);
    line([[x1, y], [x2, y]], blue ? "#a1cced" : "#6a7b72", 1);
    line([[x1 - 7, y + 7], [x1 + 7, y - 7]]); line([[x2 - 7, y + 7], [x2 + 7, y - 7]]);
    text(label, (x1 + x2) / 2 - 32, y - 9, 16);
  }
  function door(x: number, y: number, r: number, rotation = 0) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rotation);
    fill(0, -7, r, 14, paper);
    line([[0, 0], [0, -r]], ink, 2);
    ctx.beginPath(); ctx.strokeStyle = ink; ctx.lineWidth = 1.5;
    ctx.arc(0, 0, r, -Math.PI / 2, 0); ctx.stroke(); ctx.restore();
  }

  if (blue) {
    text("ARCHITECTURAL / GENERAL ARRANGEMENT", 80, 96, 23);
    dimension(220, 1100, 150, "18 000");
    dimension(220, 620, 192, "8 200"); dimension(620, 1100, 192, "9 800");
    line([[220, 140], [220, 235]], ink, 1); line([[1100, 140], [1100, 235]], ink, 1);
    rect(220, 235, 880, 610, ink, 12);
    rect(235, 250, 850, 580, ink, 2);
    line([[620, 240], [620, 840]], ink, 9);
    line([[225, 520], [620, 520]], ink, 9);
    line([[620, 600], [1095, 600]], ink, 9);
    line([[850, 600], [850, 840]], ink, 9);
    line([[850, 240], [850, 420], [1095, 420]], ink, 9);
    for (const [x, y, rotation] of [[550, 520, 0], [620, 450, Math.PI / 2], [780, 600, 0], [850, 745, Math.PI / 2], [850, 335, Math.PI / 2]]) door(x, y, 65, rotation);
    door(700, 845, 80, Math.PI);
    for (const [x, y, w, h] of [[290, 230, 160, 10], [700, 230, 90, 10], [1090, 450, 10, 100], [290, 835, 140, 10], [915, 835, 100, 10]]) {
      fill(x, y, w, h, paper); rect(x, y, w, h); line([[x, y + h / 2], [x + w, y + h / 2]], ink, 1);
    }
    rect(270, 285, 200, 110); rect(285, 300, 60, 80); rect(395, 300, 60, 80);
    rect(290, 610, 180, 70); rect(290, 715, 180, 70);
    rect(700, 290, 80, 100); for (let step = 0; step < 8; step++) line([[700, 300 + step * 11], [780, 300 + step * 11]], ink, 1);
    line([[740, 405], [740, 280], [730, 295], [740, 280], [750, 295]], ink, 2);
    rect(680, 660, 110, 105); rect(900, 660, 140, 105);
    rect(920, 290, 110, 65); ctx.beginPath(); ctx.ellipse(975, 322, 22, 15, 0, 0, Math.PI * 2); ctx.stroke();
    text("MEETING", 300, 455, 22); text("OFFICE / 01", 285, 575, 22);
    text("LOBBY", 720, 510, 22); text("STAIR", 700, 440, 18);
    text("SERVICE", 905, 395, 20); text("OFFICE / 02", 670, 810, 18); text("STUDIO", 915, 810, 18);
    ctx.save(); ctx.translate(165, 650); ctx.rotate(-Math.PI / 2); dimension(-195, 415, 0, "12 500"); ctx.restore();
    for (const x of [220, 620, 1100]) {
      ctx.setLineDash([12, 8]); line([[x, 208], [x, 890]], "#9ac9ee80", 1); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(x, 903, 17, 0, Math.PI * 2); ctx.stroke(); text(String(Math.round((x - 220) / 400) + 1), x - 5, 909, 18);
    }
    text("GROUND FLOOR PLAN", 255, 965, 27);
  } else {
    text("ILLUSTRATIVE DEVELOPMENT / SITE MASTER PLAN", 80, 96, 23);
    ctx.fillStyle = "#d2d9bd"; ctx.beginPath();
    ctx.moveTo(120, 240); ctx.lineTo(470, 175); ctx.lineTo(1060, 205); ctx.lineTo(1165, 710); ctx.lineTo(875, 865); ctx.lineTo(160, 805); ctx.closePath(); ctx.fill();
    ctx.setLineDash([14, 8]); line([[120, 240], [470, 175], [1060, 205], [1165, 710], [875, 865], [160, 805], [120, 240]], "#9c5647", 3); ctx.setLineDash([]);
    for (let offset = 0; offset < 6; offset++) {
      ctx.strokeStyle = "#9caa8970"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(110, 280 + offset * 73); ctx.bezierCurveTo(450, 80 + offset * 110, 710, 850 - offset * 52, 1130, 410 + offset * 55); ctx.stroke();
    }
    const road = [[225, 695], [225, 345], [385, 300], [925, 300], [1000, 690], [780, 735], [225, 695]];
    line(road, "#fbfaf4", 78); line(road, "#83918d", 57);
    ctx.setLineDash([20, 12]); line(road, "#f3f2e6", 2); ctx.setLineDash([]);
    line([[560, 730], [560, 870]], "#fbfaf4", 78); line([[560, 730], [560, 870]], "#83918d", 57);
    for (const row of [390, 590]) {
      for (let lot = 0; lot < 6; lot++) {
        const x = 300 + lot * 103;
        rect(x, row - 42, 95, 133, "#677f63", 1.5);
        fill(x + 15, row - 20, 63, 65, "#f7f5ed"); rect(x + 15, row - 20, 63, 65, "#526765", 2);
        line([[x + 15, row + 12], [x + 46, row - 20], [x + 78, row + 12]], "#a18e78", 1);
        text(String((row === 390 ? 1 : 7) + lot).padStart(2, "0"), x + 35, row + 77, 16);
      }
    }
    fill(355, 485, 265, 50, "#91b57c"); text("CENTRAL GREEN", 390, 515, 18);
    fill(710, 478, 140, 64, "#8ebec3"); rect(710, 478, 140, 64, "#4c828b", 2); text("AMENITY", 730, 516, 18);
    for (let tree = 0; tree < 25; tree++) {
      const x = 165 + tree * 38, y = tree % 2 ? 265 : 780;
      ctx.beginPath(); ctx.fillStyle = "#88a170"; ctx.strokeStyle = "#5d7a58"; ctx.lineWidth = 1;
      ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      line([[x - 6, y], [x + 6, y]], "#5d7a58", 1); line([[x, y - 6], [x, y + 6]], "#5d7a58", 1);
    }
    text("ENTRY", 595, 855, 17); text("PLANTING BUFFER", 350, 235, 16); text("ACCESS ROAD", 595, 290, 15);
    text("LAND USE", 1220, 380, 22);
    [["#f7f5ed", "BUILDING PLOTS"], ["#91b57c", "OPEN SPACE"], ["#83918d", "CIRCULATION"], ["#8ebec3", "AMENITY"]].forEach(([color, label], index) => {
      fill(1220, 410 + index * 48, 24, 24, color); rect(1220, 410 + index * 48, 24, 24, ink, 1); text(label, 1260, 429 + index * 48, 16);
    });
    dimension(220, 1000, 930, "SITE STRUCTURE / NTS");
    text("CONCEPTUAL SITE LAYOUT", 255, 985, 27);
  }
  // Drawing annotations describe an illustration, not a real company's project.
  const northX = 1350, northY = 190;
  line([[northX, northY + 90], [northX, northY - 35], [northX - 17, northY + 8], [northX, northY - 35], [northX + 17, northY + 8]], ink, 3);
  text("N", northX - 9, northY - 55, 25);
  rect(1160, 790, 370, 235, ink, 2);
  line([[1160, 855], [1530, 855]]); line([[1160, 925], [1530, 925]]); line([[1390, 925], [1390, 1025]]);
  text(blue ? "CONCEPT DRAWING" : "SITE PLANNING", 1180, 830, 21);
  text(blue ? "ARCHITECTURAL PLAN" : "MASTER PLAN", 1180, 887, 20);
  text("ILLUSTRATIVE / NOT FOR", 1180, 950, 13); text("CONSTRUCTION", 1180, 972, 13);
  text(blue ? "A-101" : "MP-01", 1410, 980, 21);
  text("REV 01", 1180, 1005, 14);
  text("0", 100, 1025, 14); text("5", 220, 1025, 14); text("10 m", 340, 1025, 14);
  for (let segment = 0; segment < 4; segment++) fill(100 + segment * 60, 1035, 60, 8, segment % 2 ? paper : ink);
}

export function createTechnicalDrawing(parts: SceneParts, kind: DrawingKind) {
  const { root, box, geometries, resources } = parts;
  const board = new THREE.Group();
  board.name = `${kind}-drawing`;
  root.add(board);
  box(board, parts.materials.steel, [8.1, 0.13, 5.65], [0, 0.24, 0], true);
  let texture: THREE.CanvasTexture | undefined;
  if (typeof document !== "undefined" && typeof document.createElement === "function") {
    const canvas = document.createElement("canvas");
    canvas.width = 1600; canvas.height = 1100;
    const context = canvas.getContext("2d");
    if (context) {
      drawTechnicalPlan(context, kind);
      texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
    }
  }
  const paperMaterial = new THREE.MeshBasicMaterial({ color: texture ? 0xffffff : kind === "blueprint" ? 0x123f70 : 0xe8e6dc, map: texture ?? null, side: THREE.DoubleSide });
  resources.add(paperMaterial);
  const paperGeometry = new THREE.PlaneGeometry(8, 5.5);
  geometries.add(paperGeometry);
  const sheet = new THREE.Mesh(paperGeometry, paperMaterial);
  sheet.name = `${kind}-sheet`;
  sheet.rotation.x = -Math.PI / 2;
  sheet.position.y = 0.32;
  board.add(sheet);
  const scanMaterial = new THREE.MeshBasicMaterial({ color: kind === "blueprint" ? 0x9bd9fc : 0x718c69, transparent: true, opacity: 0.22, depthWrite: false });
  resources.add(scanMaterial);
  const scan = box(board, scanMaterial, [7.7, 0.012, 0.08], [0, 0.335, 0]);
  if (kind === "blueprint") {
    const rollShape = new THREE.CylinderGeometry(0.16, 0.16, 5.5, 20, 1, true);
    geometries.add(rollShape);
    const rollMaterial = new THREE.MeshStandardMaterial({ color: 0x1a5588, side: THREE.DoubleSide });
    resources.add(rollMaterial);
    const roll = new THREE.Mesh(rollShape, rollMaterial);
    roll.rotation.x = Math.PI / 2;
    roll.position.set(-3.95, 0.44, 0);
    board.add(roll);
  }
  return {
    board,
    update(time: number) { scan.position.z = Math.sin(time * 0.3) * 2.55; },
    dispose() { texture?.dispose(); },
  };
}
