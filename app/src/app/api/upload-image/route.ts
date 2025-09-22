import { NextRequest, NextResponse } from 'next/server';
import { PinataSDK } from 'pinata';

// Initialize Pinata SDK
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY!,
});

export async function POST(request: NextRequest) {
  try {
    // Check if Pinata is configured
    if (!process.env.PINATA_JWT) {
      return NextResponse.json(
        { error: 'Pinata JWT not configured. Please add PINATA_JWT to your .env.local file.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Convert File to Buffer for Pinata
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a proper File object for Pinata
    const pinataFile = new File([buffer], file.name, { type: file.type });

    console.log(`Uploading file: ${file.name} (${file.size} bytes, ${file.type})`);

    // Upload to IPFS via Pinata (correct v2.5.0 syntax)
    const upload = await pinata.upload.public.file(pinataFile);

    // The response structure uses 'cid' in v2.5.0
    const ipfsHash = upload.cid;
    const ipfsUrl = `${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${ipfsHash}`;

    console.log(`File uploaded successfully: ${ipfsUrl}`);

    return NextResponse.json({
      success: true,
      ipfsUrl,
      ipfsHash: ipfsHash,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

  } catch (error: any) {
    console.error('Upload error:', error);

    // Provide more specific error messages
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Invalid Pinata JWT token. Please check your configuration.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: `Upload failed: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// Optional: Add a GET endpoint to check if upload service is working
export async function GET() {
  const isConfigured = !!process.env.PINATA_JWT;

  return NextResponse.json({
    status: 'Upload service is running',
    configured: isConfigured,
    message: isConfigured
      ? 'Pinata is configured and ready for uploads'
      : 'Pinata JWT not configured. Please add PINATA_JWT to your .env.local file.'
  });
}