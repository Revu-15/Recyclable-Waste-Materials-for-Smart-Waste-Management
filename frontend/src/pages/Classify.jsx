import React, { useState, useRef } from 'react';
import { Upload, Camera, FileDown, RefreshCw, AlertTriangle, Eye, ShieldAlert, Cpu } from 'lucide-react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';

const Classify = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const API_URL = 'http://localhost:5000/api';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  // Camera capture controls
  const startCamera = async () => {
    try {
      setCameraActive(true);
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
    } catch (err) {
      setError('Webcam permission denied or unavailable. Please upload a local image instead.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  const captureSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Match dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
      setImage(file);
      setImagePreview(URL.createObjectURL(blob));
      stopCamera();
      setResult(null);
    }, 'image/jpeg');
  };

  const runClassification = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);
    
    // Interactive progress steps
    const steps = [
      'Uploading image to server...',
      'Running MobileNetV2 CNN backbone...',
      'Computing gradients of last convolutional layer...',
      'Synthesizing Grad-CAM explainable activations...',
      'Fetching ecological recommendation profiles...'
    ];

    let stepIdx = 0;
    setLoadingStep(steps[0]);
    const stepInterval = setInterval(() => {
      if (stepIdx < steps.length - 1) {
        stepIdx++;
        setLoadingStep(steps[stepIdx]);
      }
    }, 900);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post(`${API_URL}/classify`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      clearInterval(stepInterval);
      if (response.data.success) {
        setResult(response.data);
      } else {
        setError(response.data.error || 'Prediction process failed.');
      }
    } catch (err) {
      clearInterval(stepInterval);
      setError('Server connection error. Ensure backend Flask is running.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const downloadReport = () => {
    if (!result || !result.id) return;
    window.open(`${API_URL}/history/export/pdf/${result.id}`);
  };

  return (
    <div className="flex flex-col gap-6 pb-12 overflow-y-auto max-h-[calc(100vh-100px)] px-2">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">AI Classification Center</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Upload or snap a waste image to classify and generate Explainable AI heatmaps.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Upload Panel */}
        <GlassCard className="lg:col-span-5 p-6 flex flex-col gap-6">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">Image Source Selection</h3>
          
          {cameraActive ? (
            <div className="relative rounded-2xl overflow-hidden border border-glass-dark dark:border-glass-light bg-black aspect-video flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                <button 
                  onClick={captureSnapshot}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md"
                >
                  Capture Photo
                </button>
                <button 
                  onClick={stopCamera}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold shadow-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-emerald-500/5 transition-all duration-300 aspect-video text-center"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-xl" />
              ) : (
                <>
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Drag & Drop Waste Image</p>
                    <p className="text-xs text-slate-400 mt-1">or click to browse local files (JPG, PNG)</p>
                  </div>
                </>
              )}
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <canvas ref={canvasRef} className="hidden"></canvas>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              disabled={loading || cameraActive}
              onClick={startCamera}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-glass-dark dark:border-glass-light text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 text-xs font-semibold disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
              <span>Camera Stream</span>
            </button>
            <button 
              disabled={loading || !image}
              onClick={runClassification}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl sustainability-gradient-bg text-white text-xs font-bold disabled:opacity-50 shadow-md"
            >
              <Cpu className="w-4 h-4" />
              <span>Analyze Waste</span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 text-xs flex gap-2 items-start">
              <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </GlassCard>

        {/* Results Presentation Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {loading ? (
            <GlassCard className="p-12 flex flex-col items-center justify-center gap-6 min-h-[380px]">
              <RefreshCw className="w-10 h-10 text-emerald-500 animate-spin" />
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">EcoSort AI Processing Pipeline</p>
                <p className="text-xs text-slate-400 mt-1 animate-pulse">{loadingStep}</p>
              </div>
            </GlassCard>
          ) : result ? (
            <div className="flex flex-col gap-6">
              {/* Classification Headers */}
              <GlassCard className="p-6 flex justify-between items-center bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Target Material</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-white">{result.predicted_class}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Confidence Score</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{result.confidence.toFixed(2)}%</span>
                </div>
              </GlassCard>

              {/* Side-by-Side Images (Original vs. Grad-CAM) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassCard className="p-4 flex flex-col gap-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Original Waste Image</p>
                  <div className="rounded-xl overflow-hidden aspect-square border border-glass-dark dark:border-glass-light">
                    <img src={`http://localhost:5000${result.image_url}`} alt="Original" className="w-full h-full object-cover" />
                  </div>
                </GlassCard>
                <GlassCard className="p-4 flex flex-col gap-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Grad-CAM Activation Grid</span>
                  </p>
                  <div className="rounded-xl overflow-hidden aspect-square border border-glass-dark dark:border-glass-light bg-slate-900">
                    {result.heatmap_url ? (
                      <img src={`http://localhost:5000${result.heatmap_url}`} alt="Grad-CAM" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">Grad-CAM unavailable</div>
                    )}
                  </div>
                </GlassCard>
              </div>

              {/* Tips & Recommendations */}
              <GlassCard className="p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-glass-dark dark:border-glass-light pb-3">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">Disposal & Ecological Action</h4>
                  <button 
                    onClick={downloadReport}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-xs font-semibold hover:bg-emerald-100 transition-all duration-300"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
                
                <div className="flex flex-col gap-3 text-xs leading-relaxed">
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Recycling Instructions:</span>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">{result.recycling_instructions}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Disposal Recommendation:</span>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">{result.recommendation}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                    <span className="font-bold text-emerald-800 dark:text-emerald-400">Environmental Impact:</span>
                    <p className="text-emerald-700 dark:text-emerald-500 mt-0.5">{result.environmental_tip}</p>
                  </div>
                </div>
              </GlassCard>

              {/* Explainable AI Details */}
              <GlassCard className="p-6 flex flex-col gap-3">
                <h4 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2">
                  <ShieldAlert className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Explainable AI (XAI) Model Explanation</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {result.explain_text}
                </p>
                <div className="text-[10px] text-slate-400 mt-1 leading-normal border-t border-glass-dark dark:border-glass-light pt-2">
                  <strong>Technical note:</strong> The Grad-CAM heatmap overlays regional pixel-contribution values computed from the forward-backward gradients backpropagated through MobileNetV2's final 1x1 Convolution layer. Regions colored red correspond to feature structures that maximized the target output probability activation.
                </div>
              </GlassCard>
            </div>
          ) : (
            <GlassCard className="p-12 flex flex-col items-center justify-center gap-4 text-center border-dashed border-slate-300 dark:border-slate-800 min-h-[380px]">
              <Upload className="w-10 h-10 text-slate-300 dark:text-slate-700" />
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Waste Image Selected</p>
                <p className="text-xs text-slate-400 mt-1">Upload a local file or start camera capture to perform classification.</p>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classify;
