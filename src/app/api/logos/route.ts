import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const logoDirectory = path.join(process.cwd(), "public", "logo");
    
    // Check if directory exists
    if (!fs.existsSync(logoDirectory)) {
      return NextResponse.json({ logos: [] });
    }

    const files = fs.readdirSync(logoDirectory);
    
    // Filter only SVG files
    const logos = files
      .filter(file => file.endsWith(".svg"))
      .map(file => ({
        name: file.replace(".svg", ""),
        path: `/logo/${file}`,
      }));

    return NextResponse.json({ logos });
  } catch (error) {
    console.error("Error reading logo directory:", error);
    return NextResponse.json({ error: "Failed to read logos" }, { status: 500 });
  }
}
