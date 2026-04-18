import { useState, useRef } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [filePath, setFilePath] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [loadingAudio, setLoadingAudio] = useState(false)
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [loadingTranscription, setLoadingTranscription] = useState(false)
  const [transcription, setTranscription] = useState<{ start: number, end: number, text: string }[]>([])
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = Math.floor(seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const handleDownload = async () => {
    if (!url) return
    try {
      setLoadingAudio(true)
      setTranscription([]) // Clear previous
      
      const response = await axios.post('http://localhost:8000/get_video', { url }, {
        responseType: 'blob'
      })
      
      const returnedFilePath = response.headers['x-file-path']
      if (returnedFilePath) setFilePath(returnedFilePath)
      
      const returnedThumbnail = response.headers['x-thumbnail-url']
      if (returnedThumbnail) setThumbnailUrl(returnedThumbnail)

      // Automatically download to user's computer
      const urlBlob = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = urlBlob
      link.setAttribute('download', 'audio.mp3')
      document.body.appendChild(link)
      link.click()
      link.remove()

    } catch (err: any) {
      console.error(err)
      alert("Error downloading url")
    } finally {
      setLoadingAudio(false)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      setLoadingUpload(true)
      setTranscription([])
      setThumbnailUrl('') // clear youtube thumbnail when uploading a fresh file

      const response = await axios.post('http://localhost:8000/upload_audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      if (response.data.file_path) {
        setFilePath(response.data.file_path)
        alert("File uploaded successfully!")
      }
    } catch (err: any) {
      console.error(err)
      alert("Error uploading file")
    } finally {
      setLoadingUpload(false)
      // reset file input
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleTranscribe = async () => {
    if (!filePath) return alert("Please download or upload a file first!")
    
    try {
      setLoadingTranscription(true)
      
      const transResponse = await axios.get('http://localhost:8000/transcryption', {
        params: { file_path: filePath }
      })
      setTranscription(transResponse.data)

    } catch (err: any) {
      console.error(err)
      alert("Error transcribing")
    } finally {
      setLoadingTranscription(false)
    }
  }

  const isProcessing = loadingAudio || loadingTranscription || loadingUpload;

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#131313]/70 backdrop-blur-3xl shadow-[0_20px_60px_-15px_rgba(28,27,27,0.4)]">
        <nav className="flex justify-between items-center w-full px-6 py-4 max-w-none">     
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#FF0000] tracking-tighter">The Cinematic Curator</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-[#FFB4A8] font-bold font-['Inter'] tracking-tight hover:bg-[#3A3939] transition-all duration-300 px-3 py-1 rounded-lg" href="#">Dashboard</a>    
            <a className="text-[#E5E2E1] font-['Inter'] tracking-tight hover:bg-[#3A3939] transition-all duration-300 px-3 py-1 rounded-lg" href="#">My Library</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-[#E5E2E1] hover:bg-[#3A3939] p-2 rounded-full transition-all active:scale-95">account_circle</button>
          </div>
        </nav>
      </header>

      <main className="flex-grow pt-24 pb-12 px-6 max-w-7xl mx-auto w-full">
        <section className="mb-12">
          <div className="bg-surface-container-low p-8 xl:p-12 rounded-xl shadow-2xl relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-1/3 h-full pointer-events-none transition-all duration-1000 ${thumbnailUrl ? 'opacity-40' : 'opacity-10'}`}>
              <img className="w-full h-full object-cover" src={thumbnailUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuACZwG5e7zxSbtc69SE1l3hlCcCU9cFzjR7hT9R3jQw_iE6cqH3aO5RQFYOnObulQ7C9GkVssKXF7wuIxiUijegZAyj7Qh-cKyyW1uzeHafrtqN6zuJ5SUFjAhrrUdIiftyZc9MtQ4KzSqCseMutBjh7uvN36FCA-XQp0lIvibcAk-8jZLnf29d2YzEySnCdcJGa8ADAGuETkrN0-aHPFasdncL5pw1TOWNV6yJJ-gzOCZsjIvNhg0ZbeM87Hj-DHDAO8O7sqnnTTEF"} alt="Background" />
              {thumbnailUrl && <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low to-transparent"></div>}
            </div>
            <div className="relative z-10 w-full max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface mb-4">
                Instant Cinematic <span className="text-primary-container">Insights.</span>
              </h1>
              <p className="text-on-surface-variant mb-8 text-lg">Paste a YouTube link or upload an audio file. Whisper AI handles the transcription.</p>  
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-grow relative w-full">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">link</span>
                    <input 
                      className="w-full bg-surface-container-highest border-none focus:ring-2 focus:ring-primary-container rounded-xl pl-12 pr-4 py-4 text-on-surface placeholder:text-outline-variant transition-all" 
                      placeholder="https://www.youtube.com/watch?v=..." 
                      type="text"
                      value={url}
                      onChange={e => setUrl(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={handleDownload}
                    disabled={isProcessing || !url}
                    className="flex justify-center items-center gap-2 bg-surface-container-high border border-outline/30 text-on-surface font-bold px-8 py-4 rounded-xl hover:bg-surface-variant transition-all active:scale-95 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                  >
                    {loadingAudio ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-on-surface"></div> : <span className="material-symbols-outlined">download</span>}
                    {loadingAudio ? 'Downloading...' : 'Download'}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-2 border-t border-outline/10 pt-6">
                  <input 
                    type="file" 
                    accept="audio/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                  />
                  <button 
                    onClick={handleUploadClick}
                    disabled={isProcessing}
                    className="flex justify-center items-center gap-2 bg-surface-container-high border border-outline/30 text-on-surface font-bold px-6 py-4 rounded-xl hover:bg-surface-variant transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    {loadingUpload ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-on-surface"></div> : <span className="material-symbols-outlined">upload_file</span>}
                    {loadingUpload ? 'Uploading...' : 'Upload File'}
                  </button>
                  
                  <div className="flex-1 opacity-50 px-4 text-center text-sm font-medium">
                    {filePath && !isProcessing ? <span className="text-primary-container">File Ready: {filePath}</span> : ''}
                  </div>

                  <button 
                    onClick={handleTranscribe}
                    disabled={isProcessing || !filePath}
                    className="flex justify-center items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-bold px-8 py-4 rounded-xl hover:shadow-[0_0_20px_rgba(255,85,64,0.4)] transition-all active:scale-95 disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    {loadingTranscription && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-on-primary-container"></div>}
                    {loadingTranscription ? 'Transcribing...' : 'Transcribe'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">notes</span> Raw Transcript
              </h3>
            </div>
            <div className="bg-surface-container-low rounded-xl h-[600px] overflow-hidden flex flex-col">
              <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-6 leading-relaxed text-on-surface/90">
                {transcription.length === 0 && !isProcessing && (
                   <p className="text-on-surface-variant italic">No transcript available. Download or upload a file and hit Transcribe to start.</p>
                )}
                {loadingTranscription && transcription.length === 0 && (
                   <div className="flex gap-4 items-center opacity-50 italic">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <p>Processing audio with Whisper AI... [AI Processing]</p>
                   </div>
                )}
                {transcription.map((seg, i) => (
                  <div key={i} className="flex gap-4 hover:bg-surface-container/50 p-2 rounded transition-colors group">
                    <span className="text-xs font-mono text-primary/60 shrink-0 mt-1">{formatTime(seg.start)}</span>      
                    <p className="group-hover:text-white transition-colors">{seg.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary-container">auto_awesome</span> AI Key Takeaways
              </h3>
            </div>
            <div className="bg-surface-container-high rounded-xl overflow-hidden shadow-xl border border-outline-variant/10 opacity-75">
               <div className="p-8 pb-4">
                  <p className="text-sm font-semibold text-tertiary-container mb-4">Static Placeholder (Feature coming soon)</p>
               </div>
              <div className="p-8 space-y-6 pt-0">
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="bg-tertiary-container/10 p-2 rounded-lg">
                      <span className="material-symbols-outlined text-tertiary-container text-sm">bolt</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-on-surface">Architectural Shift</h5>
                      <p className="text-sm text-on-surface-variant">The transition from CNNs to Transformers enabled massive parallelization.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default App
