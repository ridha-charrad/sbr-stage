export function cyberpunkTemplate(content: string) {
  return `
  <div style="margin:0;padding:0;background:#05010a;font-family:Arial,sans-serif;color:#e5e7eb;">

    <!-- OUTER GRID BACKGROUND -->
    <div style="
      padding:40px 0;
      background:
        radial-gradient(circle at top, #1a0033, #05010a),
        repeating-linear-gradient(90deg, rgba(124,58,237,0.08) 0px, rgba(124,58,237,0.08) 1px, transparent 1px, transparent 40px);
    ">

      <!-- MAIN CONTAINER -->
      <div style="
        max-width:650px;
        margin:0 auto;
        background:rgba(10,10,20,0.96);
        border:1px solid #7c3aed;
        border-radius:14px;
        overflow:hidden;
        box-shadow:0 0 30px rgba(124,58,237,0.45);
        position:relative;
      ">

        <!-- TOP SCANLINE EFFECT -->
        <div style="
          position:absolute;
          top:0;
          left:0;
          right:0;
          height:3px;
          background:linear-gradient(90deg,#00F0FF,#FCEE0A,#ff00ff);
        "></div>

        <!-- HEADER (SPLIT STYLE) -->
        <div style="display:flex;">

          <!-- LEFT PANEL -->
          <div style="
            flex:1;
            background:#0A0A0A;
            padding:22px;
            border-right:2px solid rgba(124,58,237,0.4);
          ">
            <h1 style="
              margin:0;
              color:#FCEE0A;
              font-size:22px;
              letter-spacing:4px;
            ">
              NEXUS
            </h1>

            <p style="
              margin-top:6px;
              color:#00F0FF;
              font-size:11px;
              letter-spacing:2px;
              text-transform:uppercase;
            ">
              SYSTEM ACCESS NODE
            </p>
          </div>

          <!-- RIGHT PANEL -->
          <div style="
            flex:1;
            background:linear-gradient(135deg,#12001f,#0a0a0a);
            padding:22px;
            text-align:right;
          ">
            <div style="color:#ff00ff;font-size:11px;letter-spacing:2px;">
              STATUS: ONLINE
            </div>

            <div style="color:#9ca3af;font-size:10px;margin-top:6px;">
              SECURE CHANNEL ACTIVE
            </div>
          </div>

        </div>

        <!-- CONTENT AREA (HACKER TERMINAL STYLE) -->
        <div style="
          padding:28px;
          line-height:1.7;
          color:#e5e7eb;
          background:
            linear-gradient(180deg, rgba(124,58,237,0.05), transparent);
          font-size:14px;
        ">
          <div style="
            border-left:3px solid #00F0FF;
            padding-left:14px;
          ">
            ${content}
          </div>
        </div>

        <!-- DATA STRIP (HUD STYLE) -->
        <div style="
          display:flex;
          justify-content:space-between;
          padding:10px 18px;
          font-size:10px;
          color:#9ca3af;
          border-top:1px solid rgba(124,58,237,0.3);
          background:#0a0a0a;
        ">
          <span>NODE: NEXUS-01</span>
          <span>ENCRYPTION: AES-256</span>
          <span>${new Date().getFullYear()}</span>
        </div>

      </div>
    </div>
  </div>
  `;
}