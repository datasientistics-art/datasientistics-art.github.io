import React, { useState, useRef, useEffect } from 'react';

function App() {
  const [isDrawing, setIsDrawing] = useState(false);
  const bgCanvasRef = useRef(null);  // Нижний слой - голубое небо (не стирается)
  const fgCanvasRef = useRef(null);  // Верхний слой - серое небо (стирается)
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Загружаем голубое небо (фон - нижний слой)
    const bgCanvas = bgCanvasRef.current;
    const bgCtx = bgCanvas.getContext('2d');
    
    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.src = '/blue.jpg';
    bgImg.onload = () => {
      bgCanvas.width = bgImg.width;
      bgCanvas.height = bgImg.height;
      bgCtx.drawImage(bgImg, 0, 0);
      console.log('Голубое небо загружено и зафиксировано!');
      
      // Теперь загружаем серое небо (верхний слой)
      const fgCanvas = fgCanvasRef.current;
      const fgCtx = fgCanvas.getContext('2d');
      
      const fgImg = new Image();
      fgImg.crossOrigin = "anonymous";
      fgImg.src = '/gray.jpg';
      fgImg.onload = () => {
        fgCanvas.width = fgImg.width;
        fgCanvas.height = fgImg.height;
        fgCtx.drawImage(fgImg, 0, 0);
        setImageLoaded(true);
        console.log('Серое небо загружено!');
      };
      fgImg.onerror = () => {
        console.error('Ошибка загрузки gray.jpg!');
      };
    };
    bgImg.onerror = () => {
      console.error('Ошибка загрузки blue.jpg!');
    };
  }, []);

  // Функция для стирания верхнего слоя (серого)
  const erase = (e) => {
    if (!isDrawing || !imageLoaded) return;
    
    const canvas = fgCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Получаем координаты
    let clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault();
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Пересчитываем координаты
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    // Стираем верхний слой (серое небо)
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    erase(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Сброс - перерисовываем только верхний слой (серое небо)
  const clearAll = () => {
    const canvas = fgCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const fgImg = new Image();
    fgImg.src = '/gray.jpg';
    fgImg.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(fgImg, 0, 0);
    };
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ textAlign: 'center' }}>🎨 Раскрась небо!</h2>
      <p style={{ textAlign: 'center' }}>
        Проведи пальцем (или мышкой) по серому небу, чтобы раскрасить его в голубой
      </p>

      <div style={{ 
        position: 'relative',
        border: '3px solid #ccc',
        borderRadius: '10px',
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
        maxWidth: '100%'
      }}>
        {/* Нижний слой - голубое небо (фиксированное) */}
        <canvas
          ref={bgCanvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'block',
            pointerEvents: 'none' // Чтобы не перехватывать события мыши
          }}
        />
        
        {/* Верхний слой - серое небо (стирается) */}
        <canvas
          ref={fgCanvasRef}
          style={{
            position: 'relative',
            width: '100%',
            height: 'auto',
            display: 'block',
            cursor: 'pointer',
            touchAction: 'none',
            maxWidth: '100%'
          }}
          onMouseDown={startDrawing}
          onMouseMove={erase}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={erase}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
        />
      </div>

      <div style={{ 
        marginTop: '20px', 
        display: 'flex', 
        gap: '10px', 
        justifyContent: 'center' 
      }}>
        <button 
          onClick={clearAll}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          🔄 Сбросить
        </button>
        <button 
          onClick={() => {
            alert('Молодец! Небо теперь голубое! 🌤️');
          }}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4ecdc4',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          ✅ Готово!
        </button>
      </div>
    </div>
  );
}

export default App;