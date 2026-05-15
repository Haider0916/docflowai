'use client';

import dynamic from 'next/dynamic';

const FileUpload = dynamic(() => import('./FileUpload'), {
    ssr: false,
});

export default function FileUploadWrapper() {
    return <FileUpload />;
}