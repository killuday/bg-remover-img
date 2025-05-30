// This file explicitly imports the ONNX runtime for Transformers.js
import { env } from '@huggingface/transformers';

export async function setupOnnxRuntime() {
  try {
    // Dynamically import onnxruntime-web
    await import('onnxruntime-web');
    
    // Configure the ONNX backend
    env.backends = {
      ...env.backends,
      onnx: {
        wasm: {
          proxy: true
        }
      }
    };
    
    console.log('ONNX Runtime initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize ONNX Runtime:', error);
    return false;
  }
} 