import { useState, useRef, useCallback, useEffect } from 'react';

export const useVoiceAssistant = (onSilenceDetected) => {
    const [isRecording, setIsRecording] = useState(false);
    const [volume, setVolume] = useState(1);
    const [recordingBlob, setRecordingBlob] = useState(null);

    const mediaRecorderRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const silenceTimerRef = useRef(null);
    const animationFrameRef = useRef(null);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
        
        // Cleanup Audio Context
        if (audioContextRef.current) audioContextRef.current.close();
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        
        setIsRecording(false);
        setVolume(1);
    }, []);

    const startRecording = useCallback(async () => {
        try {
            // Yêu cầu quyền sử dụng
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Tạo media recorder
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            // Thiết lập Web Audio API để phân tích âm thanh
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            
            audioContextRef.current = audioContext;
            analyserRef.current = analyser;
            // Các chunk âm thanh
            const chunks = [];
            // Thêm chunk âm thanh vào danh sách
            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                setRecordingBlob(blob);
            };
            // Kiểm tra âm thanh, đảm bảo tự động dừng khi không nhập âm thanh nữa
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const checkAudio = () => {
                analyser.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                
                // Cập nhật scale cho hiệu ứng dãn nở (từ 1 đến 1.6)
                setVolume(1 + (average / 100));

                // Silence Detection: Nếu âm lượng < 15 trong 2 giây
                if (average < 14) {
                    if (!silenceTimerRef.current) {
                        silenceTimerRef.current = setTimeout(() => {
                            stopRecording();
                            if (onSilenceDetected) onSilenceDetected();
                        }, 2000);
                    }
                } else {
                    if (silenceTimerRef.current) {
                        clearTimeout(silenceTimerRef.current);
                        silenceTimerRef.current = null;
                    }
                }
                animationFrameRef.current = requestAnimationFrame(checkAudio);
            };

            mediaRecorder.start();
            setIsRecording(true);
            checkAudio();
        } catch (err) {
            console.error("Không thể truy cập Microphone:", err);
        }
    }, [stopRecording, onSilenceDetected]);
    
    return { isRecording, volume, recordingBlob, startRecording, stopRecording };
};