import { Header } from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
          <h1 className="text-4xl font-bold text-center mb-8">
            Welcome to Zuranis
          </h1>
          <p className="text-center text-gray-600 mb-4">
            A Next.js 14 application with NextAuth and Supabase
          </p>
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>✅ Next.js 14 with App Router</p>
            <p>✅ TypeScript</p>
            <p>✅ Tailwind CSS</p>
            <p>✅ NextAuth.js (GitHub OAuth)</p>
            <p>✅ Supabase Integration</p>
          </div>
        </div>
      </main>
    </>
  );
}
