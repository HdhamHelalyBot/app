
import React, { useState, useRef, useEffect } from 'react';
import { runQuery } from './services/geminiService';

const GeminiLogo: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <path d="M9.6283 2.25C10.1283 1.125 11.4283 0.25 12.5283 0.25C13.6283 0.25 14.8283 1.125 15.3283 2.25L23.2283 18.25C23.7283 19.25 23.1283 20.5 22.0283 20.5H2.9283C1.8283 20.5 1.2283 19.25 1.7283 18.25L9.6283 2.25Z" fill="url(#paint0_linear_1_2)"/>
    <path d="M11.6283 21.625C11.1283 22.75 9.8283 23.625 8.7283 23.625C7.6283 23.625 6.4283 22.75 5.9283 21.625L0.528303 10.625C0.0283029 9.625 0.628303 8.375 1.7283 8.375H13.4283C14.5283 8.375 15.1283 9.625 14.6283 10.625L11.6283 21.625Z" fill="url(#paint1_linear_1_2)"/>
    <defs>
      <linearGradient id="paint0_linear_1_2" x1="12.5283" y1="0.25" x2="12.5283" y2="20.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A4A7FE"/>
        <stop offset="1" stopColor="#3942F6"/>
      </linearGradient>
      <linearGradient id="paint1_linear_1_2" x1="7.9783" y1="8.375" x2="7.9783" y2="23.625" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A4A7FE"/>
        <stop offset="1" stopColor="#3942F6"/>
      </linearGradient>
    </defs>
  </svg>
);

const LoadingDots: React.FC = () => (
    <div className="flex space-x-2 justify-center items-center">
        <span className="sr-only">جار التحميل...</span>
        <div className="h-2 w-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-slate-300 rounded-full animate-bounce"></div>
    </div>
);


const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const responseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (response || isLoading || error) {
      responseRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response, isLoading, error]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      const result = await runQuery(prompt);
      setResponse(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
      setError(`عذرًا، لم نتمكن من معالجة طلبك: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e.currentTarget.form as HTMLFormElement);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-6 font-sans">
      <header className="w-full max-w-4xl flex flex-col items-center text-center mb-8">
        <div className="flex items-center gap-3 mb-2">
            <GeminiLogo />
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            سؤال وجواب Gemini
            </h1>
        </div>
        <p className="text-slate-400 text-lg">
          اطرح أي سؤال وسيقوم Gemini بالإجابة عليه.
        </p>
      </header>
      
      <main className="w-full max-w-4xl flex-grow flex flex-col">
        <form onSubmit={handleSubmit} className="w-full bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 shadow-lg">
          <label htmlFor="prompt" className="block text-slate-300 mb-2 font-medium">
            اكتب سؤالك هنا:
          </label>
          <div className="relative">
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="مثال: ما هي عاصمة فرنسا؟"
              className="w-full h-32 px-3 pt-3 pb-14 bg-slate-900/70 border border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-lg text-slate-100 placeholder-slate-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="absolute bottom-3 left-3 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جار الإرسال...
                </>
              ) : (
                'إرسال'
              )}
            </button>
          </div>
        </form>

        <div ref={responseRef} className="w-full mt-8">
            {isLoading && !response && (
                 <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 shadow-lg">
                    <div className="flex items-center gap-4">
                        <GeminiLogo />
                        <LoadingDots />
                    </div>
                </div>
            )}
            
            {error && (
                <div className="bg-red-900/30 border border-red-500 text-red-300 rounded-xl p-4 shadow-lg" role="alert">
                    <p className="font-bold mb-1">حدث خطأ</p>
                    <p>{error}</p>
                </div>
            )}

            {response && (
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 shadow-lg animate-fade-in">
                    <h2 className="text-xl font-semibold text-slate-200 mb-3 flex items-center gap-2">
                        <GeminiLogo />
                        إجابة Gemini
                    </h2>
                    <div className="prose prose-invert prose-p:text-slate-300 prose-strong:text-slate-100 prose-headings:text-slate-100 max-w-none space-y-4 whitespace-pre-wrap text-lg">
                        {response}
                    </div>
                </div>
            )}
        </div>
      </main>
      <footer className="w-full max-w-4xl mt-8 text-center text-slate-500 text-sm">
        <p>مدعوم بواسطة Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
