
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

type FloatingElementType = 'heart' | 'star' | 'sparkle' | 'bubble' | 'butterfly' | 'flower' | 'ribbon';

type FloatingElement = {
  id: number;
  left: string;
  top: string;
  size: string;
  rotation: string;
  delay: string;
  opacity: string;
  duration: string;
  type: FloatingElementType;
  color: string;
  scale: number;
};

const BUTTERFLY_PATH = "M 15,8.9 C 6.797017,-5.841705 -6.1281171,4.9071703 2.574831,13.512439 -6.1281171,22.117709 6.797017,32.866585 15,18.124877 23.202983,32.866585 36.128117,22.117709 27.425169,13.512439 36.128117,4.9071703 23.202983,-5.841705 15,8.9 Z";
const FLOWER_PATH = "M12 0C12 6.627 7.373 12 0.75 12C7.373 12 12 17.373 12 24C12 17.373 16.627 12 23.25 12C16.627 12 12 6.627 12 0Z";

const FloatingElements: React.FC = () => {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate random floating elements
    const newElements: FloatingElement[] = [];
    const numElements = 30; // Increased number of elements

    const types: FloatingElementType[] = ['heart', 'star', 'sparkle', 'bubble', 'butterfly', 'flower', 'ribbon'];
    const colors = ['#FF84B7', '#B892FF', '#FFD700', '#FF6B95', '#9F7DE1', '#FFC0CB', '#FF88A8', '#C6A4FF', '#FFF0DB'];
    
    for (let i = 0; i < numElements; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      newElements.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${Math.random() * 1.8 + 0.8}rem`,
        rotation: `${Math.random() * 360}deg`,
        delay: `${Math.random() * 5}s`,
        opacity: `${Math.random() * 0.5 + 0.2}`,
        duration: `${Math.random() * 15 + 5}s`,
        type,
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: Math.random() * 0.5 + 0.8,
      });
    }

    setElements(newElements);
    
    // Add mouse follow effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      // Create a special element that follows mouse
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Find elements close to mouse and make them move away
      const elementsContainer = containerRef.current;
      const floatingEls = elementsContainer.querySelectorAll('.float-element');
      
      floatingEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;
        
        // Calculate distance between mouse and element
        const dx = mouseX - elementCenterX;
        const dy = mouseY - elementCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If mouse is close to element
        if (distance < 100) {
          const translateX = (dx / distance) * -30;
          const translateY = (dy / distance) * -30;
          
          // Apply repulsion effect
          el.setAttribute('style', `${el.getAttribute('style') || ''}; transform: translate(${translateX}px, ${translateY}px) scale(1.1) !important;`);
          
          // Reset after a delay
          setTimeout(() => {
            el.setAttribute('style', el.getAttribute('style')?.replace(/transform:.*?;/, '') || '');
          }, 500);
        }
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const renderElement = (element: FloatingElement) => {
    switch (element.type) {
      case 'heart':
        return (
          <motion.svg
            width={element.size}
            height={element.size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={{ 
              scale: [element.scale, element.scale * 1.2, element.scale],
              filter: [
                "drop-shadow(0 0 2px rgba(255,255,255,0.3))", 
                "drop-shadow(0 0 6px rgba(255,255,255,0.6))", 
                "drop-shadow(0 0 2px rgba(255,255,255,0.3))"
              ]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={element.color}
            />
          </motion.svg>
        );
      case 'star':
        return (
          <motion.svg 
            width={element.size} 
            height={element.size} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            animate={{ 
              rotate: [0, 360],
              scale: [element.scale, element.scale * 1.3, element.scale]
            }}
            transition={{ 
              rotate: { duration: Math.random() * 20 + 10, repeat: Infinity, ease: "linear" },
              scale: { duration: Math.random() * 3 + 2, repeat: Infinity, repeatType: "reverse" }
            }}
          >
            <path 
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
              fill={element.color} 
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="0.5"
            />
          </motion.svg>
        );
      case 'sparkle':
        return (
          <motion.svg 
            width={element.size} 
            height={element.size} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            animate={{ 
              opacity: [Number(element.opacity), 1, Number(element.opacity)],
              filter: [
                "drop-shadow(0 0 2px rgba(255,255,255,0))", 
                "drop-shadow(0 0 8px rgba(255,255,255,0.8))", 
                "drop-shadow(0 0 2px rgba(255,255,255,0))"
              ]
            }}
            transition={{ 
              duration: Math.random() * 2 + 1, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          >
            <path 
              d="M12 2L12.76 9.9L19.53 6.97L14.39 13.07L22 15.5L14.39 17.93L19.53 24.03L12.76 21.1L12 29L11.24 21.1L4.47 24.03L9.61 17.93L2 15.5L9.61 13.07L4.47 6.97L11.24 9.9L12 2Z" 
              fill={element.color} 
            />
          </motion.svg>
        );
      case 'bubble':
        return (
          <motion.svg 
            width={element.size} 
            height={element.size} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            animate={{ 
              scale: [element.scale, element.scale * 1.2, element.scale],
              opacity: [Number(element.opacity), Number(element.opacity) * 1.3, Number(element.opacity)]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          >
            <motion.circle 
              cx="12" 
              cy="12" 
              r="10" 
              fill={element.color} 
              fillOpacity="0.7" 
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.5"
              strokeOpacity="0.5"
            />
          </motion.svg>
        );
      case 'butterfly':
        return (
          <motion.svg
            width={element.size}
            height={element.size}
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={{ 
              rotateY: [0, 40, 0, -40, 0],
              scale: [element.scale, element.scale * 1.1, element.scale]
            }}
            transition={{ 
              rotateY: { duration: 3, repeat: Infinity, repeatType: "loop" },
              scale: { duration: 2, repeat: Infinity, repeatType: "reverse" }
            }}
          >
            <path
              d={BUTTERFLY_PATH}
              fill={element.color}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="0.5"
            />
          </motion.svg>
        );
      case 'flower':
        return (
          <motion.svg
            width={element.size}
            height={element.size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={{ 
              rotate: [0, 360],
              scale: [element.scale, element.scale * 1.2, element.scale]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, repeatType: "reverse" }
            }}
          >
            <path
              d={FLOWER_PATH}
              fill={element.color}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.5"
            />
          </motion.svg>
        );
      case 'ribbon':
        return (
          <motion.svg
            width={element.size}
            height={element.size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={{ 
              rotate: [0, 10, -10, 0],
              y: [0, -10, 0],
              filter: [
                "drop-shadow(0 2px 3px rgba(0,0,0,0.1))", 
                "drop-shadow(0 5px 8px rgba(0,0,0,0.2))", 
                "drop-shadow(0 2px 3px rgba(0,0,0,0.1))"
              ]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          >
            <path
              d="M12 3L16 7H13V17H16L12 21L8 17H11V7H8L12 3Z"
              fill={element.color}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="0.5"
            />
          </motion.svg>
        );
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute float-element"
          style={{
            left: element.left,
            top: element.top,
            opacity: Number(element.opacity),
            transform: `rotate(${element.rotation})`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() > 0.5 ? 20 : -20, 0]
          }}
          transition={{
            duration: parseFloat(element.duration),
            delay: parseFloat(element.delay),
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          whileHover={{ scale: 1.2, opacity: 1 }}
        >
          {renderElement(element)}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingElements;
