import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.heic', '.heif', '.bmp', '.avif'];
const ALLOWED_TYPES = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
  'image/svg+xml', 'image/heic', 'image/heif', 'image/bmp', 'image/avif',
];

function isAllowedFile(file: File): boolean {
  // Check MIME type
  if (file.type && ALLOWED_TYPES.includes(file.type.toLowerCase())) {
    return true;
  }

  // If MIME type is empty or unrecognized, check file extension
  const ext = path.extname(file.name).toLowerCase();
  if (ext && ALLOWED_EXTENSIONS.includes(ext)) {
    return true;
  }

  // If MIME type is empty and no extension, allow it as image if name exists
  if (!file.type && file.name) {
    return true;
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!isAllowedFile(file)) {
      return NextResponse.json(
        { error: `Invalid file type "${file.type || 'unknown'}". Only image files are allowed.` },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine the proper extension
    let ext = path.extname(file.name).toLowerCase();
    if (!ext || ext === '.heic' || ext === '.heif') {
      // Convert HEIC/HEIF to .jpg since browsers can't display HEIC
      ext = '.jpg';
    }
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, uniqueName);
    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${uniqueName}`;

    return NextResponse.json({ url: imageUrl, name: file.name });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file. Please try again.' },
      { status: 500 }
    );
  }
}
