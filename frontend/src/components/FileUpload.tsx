'use client'

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

function FileUpload() {

    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Upload failed');
            }

            const data = await res.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
    });

    console.log(JSON.stringify({ getRootProps, getInputProps, isDragActive }));

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-blue-600">Drop the PDF here...</p>
                ) : (
                    <p className="text-gray-500">Drag & drop a PDF here, or click to select</p>
                )}
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
                    <p>Upload successful!</p>
                    <p className="text-sm mt-1">Document ID: {result.id}</p>
                    <p className="text-sm">File: {result.fileName}</p>
                </div>
            )}
        </div>
    );
}

export default FileUpload;
