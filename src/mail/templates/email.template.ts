export function baseEmailTemplate(content: string) {
  return `
  <div style="background:#f4f6f8;padding:40px 0;font-family:Arial,sans-serif;">
    
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

      <!-- HEADER -->
      <div style="background:#111827;padding:20px;text-align:center;">
        <h1 style="color:#ffffff;margin:0;font-size:20px;">
          Nexus Platform
        </h1>
      </div>

      <!-- BODY -->
      <div style="padding:30px;color:#333333;line-height:1.6;">
        ${content}
      </div>

      <!-- FOOTER -->
      <div style="padding:15px;text-align:center;font-size:12px;color:#888;">
        © ${new Date().getFullYear()} Nexus. All rights reserved.
      </div>

    </div>
  </div>
  `;
}