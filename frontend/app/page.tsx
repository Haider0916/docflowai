import FileUploadWrapper from '@/components/FileUploadWrapper';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">DocuFlow AI</h1>
      <FileUploadWrapper />
    </main>
  );
}