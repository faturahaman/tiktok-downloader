import { useState } from 'react';
import axios from 'axios';

function TikTokDownloader() {
  const [url, setUrl] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!url.trim()) return;
 setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/download', { url });

      const videoUrl = res.data.videoUrl;
      const title = res.data.title || 'tiktok_video';
      const author = res.data.author || '';

      // Simpan agar preview muncul
      setVideoData({ videoUrl, title, author });

      // Langsung unduh
      const response = await axios.get(videoUrl, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `${title}.mp4`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Gagal mendownload video. Pastikan URL benar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden">
      {/* Pixel Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="grid grid-cols-32 gap-px h-full">
          {[...Array(1024)].map((_, i) => (
            <div
              key={i}
              className="bg-white"
              style={{
                opacity: Math.random() > 0.95 ? 0.3 : 0,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Scanlines Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-10" 
             style={{
               backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
               animation: 'scanlines 0.1s linear infinite'
             }}></div>
      </div>

      <style jsx>{`
        @keyframes scanlines {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .blink {
          animation: blink 1s infinite;
        }
        .pixelated {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
      `}</style>

      <div className="relative z-10 p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="border-4 border-white p-6 bg-black mb-4 pixelated">
            <div className="border-2 border-gray-600 p-4">
              <h1 className="text-4xl font-bold mb-2 pixelated tracking-wider">
                ████ TIKTOK DOWNLOADER ████
              </h1>
              <div className="text-sm tracking-widest">
                ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-sm font-mono uppercase tracking-wider">
          
          </p>
        </div>

        {/* Terminal Window */}
        <div className="border-2 border-white bg-black mb-8 pixelated">
          {/* Terminal Header */}
          <div className="border-b-2 border-white p-2 bg-gray-800 flex items-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-white border border-gray-600"></div>
              <div className="w-3 h-3 bg-gray-600 border border-gray-600"></div>
              <div className="w-3 h-3 bg-gray-600 border border-gray-600"></div>
            </div>
            <div className="ml-4 text-xs uppercase tracking-wider">
              DOWNLOADER.EXE
            </div>
          </div>

          {/* Terminal Content */}
          <div className="p-6">
            <div className="mb-4">
              <div className="text-sm mb-2 text-gray-400">
                &gt; ENTER TIKTOK URL:
              </div>
              <div className="border-2 border-gray-600 bg-black p-3">
                <input
                  type="text"
                  placeholder="https://www.tiktok.com/..."
                  className="w-full bg-transparent text-white font-mono text-sm focus:outline-none placeholder-gray-600"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
                />
             
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleDownload}
                disabled={loading || !url.trim()}
                className="border-2 border-white bg-black px-8 py-3 font-mono text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed pixelated"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="text-xs">PROCESSING</div>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-white animate-pulse"></div>
                      <div className="w-1 h-1 bg-white animate-pulse delay-100"></div>
                      <div className="w-1 h-1 bg-white animate-pulse delay-200"></div>
                    </div>
                  </div>
                ) : (
                  '[ DOWNLOAD ]'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Video Preview */}
      {videoData && (
  <div className="border-2 border-white bg-black pixelated mt-8">
    {/* Preview Header */}
    <div className="border-b-2 border-white p-2 bg-gray-800">
      <div className="text-xs uppercase tracking-wider">VIDEO PREVIEW</div>
    </div>

    <div className="p-6">
      <div className="text-center mb-6">
        <div className="text-sm mb-2 text-gray-400">&gt; TITLE: {videoData.title}</div>
        <div className="text-sm mb-4 text-gray-400">&gt; AUTHOR: {videoData.author}</div>
        <div className="text-xs text-gray-600 mb-4">████████████████████████████████████████</div>
      </div>

      {/* ✅ VIDEO PREVIEW */}
      <div className="border-2 border-gray-600 bg-black p-4 text-center">
        <video
          controls
          src={videoData.videoUrl}
          className="mx-auto rounded border border-gray-600"
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="mt-4 text-center">
        <div className="text-xs text-gray-400 uppercase tracking-wider">STATUS: READY FOR DOWNLOAD</div>
        <div className="text-xs text-gray-600 mt-1">▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%</div>
      </div>
    </div>
  </div>
)}

      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-xs text-gray-600 font-mono uppercase tracking-wider">
          © {new Date().getFullYear()} | CREATED BY MUHAMAD RIFFA FATURAH
        </div>
        <div className="text-xs text-gray-700 mt-1">
          ████████████████████████████████████████
        </div>
      </div>
    </div>
  );
}

export default TikTokDownloader;