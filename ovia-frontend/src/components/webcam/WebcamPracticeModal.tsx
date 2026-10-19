import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Camera,
  CameraOff,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Award,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { recognitionService } from '../../services/recognitionService';
import { lessonService } from '../../services/lessonService';
import type { PredictResponse } from '../../types';

interface WebcamPracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSign: string;
  lessonId?: number;
  onLessonCompleted?: () => void;
}

export const WebcamPracticeModal: React.FC<WebcamPracticeModalProps> = ({
  isOpen,
  onClose,
  targetSign,
  lessonId,
  onLessonCompleted,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<PredictResponse | null>(null);
  const [autoEvaluate, setAutoEvaluate] = useState<boolean>(false);
  const [markedDone, setMarkedDone] = useState<boolean>(false);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Request camera ONLY when modal is opened and explicitly initiated
  const startCamera = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access denied:', err);
      setCameraError(
        'Camera access was denied or no webcam was found. Please check browser permissions and allow camera access.'
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setPrediction(null);
      setCameraError(null);
      setAutoEvaluate(false);
      setMarkedDone(false);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  // Capture transient frame and send to recognition endpoint
  const evaluateSign = async () => {
    if (!videoRef.current || !canvasRef.current || isEvaluating) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL('image/jpeg', 0.8);

    setIsEvaluating(true);
    try {
      const result = await recognitionService.predictSign({
        target_sign: targetSign,
        image_base64: base64Image,
        lesson_id: lessonId,
      });
      setPrediction(result);

      if (result.is_correct && lessonId && !markedDone) {
        try {
          await lessonService.markCompleted(lessonId);
          setMarkedDone(true);
          if (onLessonCompleted) onLessonCompleted();
        } catch (e) {
          console.warn('Could not mark lesson complete automatically');
        }
      }
    } catch (err: any) {
      console.error('Evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Continuous evaluation interval when toggle is on
  useEffect(() => {
    let interval: any = null;
    if (autoEvaluate && stream && !isEvaluating) {
      interval = setInterval(() => {
        evaluateSign();
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoEvaluate, stream, isEvaluating]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        stopCamera();
        onClose();
      }}
      title={`Live Practice: Target Sign '${targetSign}'`}
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Camera Viewport */}
        <div className="relative aspect-4/3 w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
          {cameraError ? (
            <div className="text-center p-6 text-white max-w-sm">
              <CameraOff className="w-12 h-12 text-rose-400 mx-auto mb-3" />
              <h4 className="font-semibold text-base mb-1">Camera Unavailable</h4>
              <p className="text-xs text-slate-300 mb-4">{cameraError}</p>
              <Button onClick={startCamera} variant="outline" size="sm">
                Try Reconnecting
              </Button>
            </div>
          ) : !stream ? (
            <div className="text-center p-6 text-slate-400">
              <Camera className="w-10 h-10 animate-pulse mx-auto mb-2 text-indigo-400" />
              <p className="text-xs">Initializing camera feed...</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Guide Overlay Bounding Box */}
              <div className="absolute inset-8 border-2 border-dashed border-indigo-400/60 rounded-2xl pointer-events-none flex items-start justify-between p-3">
                <span className="text-[11px] font-semibold bg-slate-900/80 text-white px-2 py-1 rounded-md backdrop-blur-xs">
                  Place Hand Here
                </span>
                <span className="text-[11px] font-bold bg-indigo-600 text-white px-2.5 py-1 rounded-md shadow-xs">
                  Target: {targetSign}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Real-time Recognition Result Card */}
        {prediction && (
          <div
            className={`p-4 rounded-xl border transition-all ${
              prediction.is_correct
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : prediction.status === 'no_hand_detected'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {prediction.is_correct ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : prediction.status === 'no_hand_detected' ? (
                  <HelpCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">
                      {prediction.is_correct ? 'Correct Sign Recognized!' : 'Needs Adjustment'}
                    </span>
                    {prediction.predicted_sign && (
                      <Badge
                        variant={prediction.is_correct ? 'success' : 'danger'}
                        size="sm"
                      >
                        Detected: {prediction.predicted_sign}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs mt-1 leading-relaxed">{prediction.feedback}</p>
                </div>
              </div>

              {prediction.confidence > 0 && (
                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                    Confidence
                  </span>
                  <span className="text-sm font-black">
                    {Math.round(prediction.confidence * 100)}%
                  </span>
                </div>
              )}
            </div>

            {markedDone && (
              <div className="mt-3 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Lesson marked completed in your student dashboard!
                </span>
              </div>
            )}
          </div>
        )}

        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <Button
              onClick={evaluateSign}
              isLoading={isEvaluating}
              disabled={!stream}
              variant="primary"
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Evaluate My Sign
            </Button>

            <button
              onClick={() => setAutoEvaluate(!autoEvaluate)}
              disabled={!stream}
              className={`text-xs px-3 py-2 rounded-lg font-medium border transition-colors cursor-pointer ${
                autoEvaluate
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {autoEvaluate ? 'Auto-Scan: Active' : 'Enable Auto-Scan'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setPrediction(null);
              }}
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Clear
            </Button>
            <Button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              variant="ghost"
              size="sm"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
