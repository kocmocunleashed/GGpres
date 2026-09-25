import { CanvasTexture, SRGBColorSpace } from "three";

/** Locally drawn opitlcalOS preview; the actual desktop takes over as accessible DOM. */
export function createScreenTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const c = context;

  // Match Wallpaper.tsx, cropped to the imported CRT's native 5:4 display.
  c.save();
  const scale = canvas.height / 1080;
  c.translate((canvas.width - 1920 * scale) / 2, 0);
  c.scale(scale, scale);
  const base = c.createLinearGradient(0, 0, 1920, 1080);
  base.addColorStop(0, "#0a1430");
  base.addColorStop(.5, "#152552");
  base.addColorStop(1, "#3a285f");
  c.fillStyle = base;
  c.fillRect(0, 0, 1920, 1080);
  const glow = c.createRadialGradient(1100, 320, 0, 1100, 320, 1100);
  glow.addColorStop(0, "#8499e82b");
  glow.addColorStop(1, "#8499e800");
  c.fillStyle = glow;
  c.fillRect(0, 0, 1920, 1080);
  const ribbon = c.createLinearGradient(0, 0, 1536, 1080);
  [[0, "#488bcc"], [.36, "#689ce1"], [.55, "#a0aef0"], [.75, "#495eab"], [1, "#242346"]].forEach(([stop, color]) => ribbon.addColorStop(Number(stop), String(color)));
  c.fillStyle = ribbon;
  c.fill(new Path2D("M-150 1220C220 1110 930 1065 1262 686 1502 412 1599 95 2020-134L2120 518C1708 610 1678 973 1332 1175Z"));
  const fold = c.createLinearGradient(0, 0, 1920, 1080);
  [[0, "#131b3c"], [.46, "#223e78"], [.7, "#335590"], [1, "#787abb"]].forEach(([stop, color]) => fold.addColorStop(Number(stop), String(color)));
  c.fillStyle = fold;
  c.fill(new Path2D("M-100 1320C569 918 1012 1099 1398 689 1558 519 1620 333 1772 253 1635 609 1933 826 2090 851L2130 1175Z"));
  c.strokeStyle = "#adc7ff55";
  c.lineWidth = 1.5;
  c.stroke(new Path2D("M-150 1220C220 1110 930 1065 1262 686 1502 412 1599 95 2020-134"));
  c.restore();

  function rounded(x: number, y: number, w: number, h: number, radius: number, fill: string) {
    c.fillStyle = fill;
    c.beginPath();
    c.roundRect(x, y, w, h, radius);
    c.fill();
  }

  function appIcon(index: number, x: number, y: number, size = 52) {
    c.save();
    c.translate(x, y);
    c.scale(size / 52, size / 52);
    const palettes = [["#769cff", "#5653a7"], ["#81b7f3", "#488bd4"], ["#444852", "#262932"], ["#62bca2", "#318b70"], ["#dae6f5", "#b2c6dc"], ["#d8dce4", "#aab5c7"]];
    const paint = c.createLinearGradient(0, 0, 40, 52);
    paint.addColorStop(0, palettes[index][0]);
    paint.addColorStop(1, palettes[index][1]);
    c.fillStyle = paint;
    c.beginPath();
    c.roundRect(0, 0, 52, 52, 12);
    c.fill();
    c.strokeStyle = index > 3 ? "#4c5f7f" : "#f6f8ff";
    c.lineWidth = 2.4;
    c.lineCap = "round";
    c.lineJoin = "round";
    const paths = [
      "M26 9 43 26 26 43 9 26 26 9ZM16 27l6-6 7 9 7-6",
      "M10 19v-4h13l4 4h15v21H10Z",
      "M12 17l10 9-10 9M28 35h12",
      "M8 28h8l5-13 8 23 6-14 4 4h5",
      "M13 18h26v23H13ZM20 18v-3a6 6 0 0 1 12 0v3",
      "M15 12v28M26 12v28M37 12v28M11 21h8M22 33h8M33 19h8",
    ];
    c.stroke(new Path2D(paths[index]));
    c.restore();
  }

  c.fillStyle = "#11141af5";
  c.fillRect(0, 0, 1280, 37);
  c.fillStyle = "#f6f8ff";
  c.font = '500 15px "IBM Plex Sans", sans-serif';
  c.fillText("Activities", 22, 24);
  c.textAlign = "center";
  const date = new Date();
  c.fillText(`${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}   ${date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`, 640, 24);
  c.textAlign = "left";
  c.strokeStyle = "#f6f8ff";
  c.lineWidth = 2;
  c.stroke(new Path2D("M1175 15q10-8 20 0M1179 19q6-5 12 0M1184 23h2M1210 16h5l6-5v16l-6-5h-5ZM1225 14l8 10M1233 14l-8 10M1243 12h20v14h-20ZM1265 17v4"));

  appIcon(0, 38, 75, 58);
  appIcon(1, 38, 185, 58);
  c.textAlign = "center";
  c.font = '500 14px "IBM Plex Sans", sans-serif';
  c.fillText("Operating", 67, 155);
  c.fillText("Systems", 67, 174);
  c.fillText("Home", 67, 266);

  // The welcome is a dismissible shell notification, not wallpaper artwork.
  rounded(438, 66, 404, 153, 13, "#272930");
  appIcon(0, 459, 90, 40);
  c.textAlign = "left";
  c.fillStyle = "#f6f8ff";
  c.font = '600 16px "IBM Plex Sans", sans-serif';
  c.fillText("Make yourself at home.", 513, 105);
  c.fillStyle = "#bec5d2";
  c.font = '400 13px "IBM Plex Sans", sans-serif';
  c.fillText("Open an app. Follow your curiosity.", 513, 131);
  rounded(510, 154, 164, 36, 6, "#43649a");
  c.fillStyle = "#edf3ff";
  c.font = '500 13px "IBM Plex Sans", sans-serif';
  c.fillText("Begin the lesson    ↗", 522, 177);
  c.fillStyle = "#bec5d2";
  c.font = "18px sans-serif";
  c.fillText("×", 820, 88);

  c.textAlign = "right";
  c.fillStyle = "#f6f8ff80";
  c.font = '300 44px "IBM Plex Sans", sans-serif';
  c.fillText("opitlcalOS", 1206, 852);

  rounded(393, 922, 494, 78, 21, "#151c30d9");
  for (let i = 0; i < 6; i++) appIcon(i, 408 + i * 67, 935);
  for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) {
    rounded(827 + col * 10, 949 + row * 10, 4, 4, 1, "#e9edff");
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
