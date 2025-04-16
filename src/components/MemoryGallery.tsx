import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Heart, Maximize2, MessageCircle, X, Star, Calendar } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface MemoryProps {
  images: {
    src: string;
    description: string;
  }[];
}

const MemoryGallery: React.FC<MemoryProps> = ({ images }) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set());
  const [showText, setShowText] = useState<boolean>(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal-animation');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      
      switch (e.key) {
        case 'Escape':
          setSelectedImage(null);
          break;
        case 'ArrowLeft':
          setSelectedImage((prev) => 
            prev === null ? null : (prev === 0 ? images.length - 1 : prev - 1)
          );
          break;
        case 'ArrowRight':
          setSelectedImage((prev) => 
            prev === null ? null : (prev === images.length - 1 ? 0 : prev + 1)
          );
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, images.length]);

  const toggleLike = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
        createHeartFloatingEffect(e);
      }
      return newSet;
    });
  };

  const createHeartFloatingEffect = (e: React.MouseEvent) => {
    const hearts = 7;
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = `${e.clientX}px`;
    container.style.top = `${e.clientY}px`;
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    for (let i = 0; i < hearts; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'absolute';
        heart.style.fontSize = `${Math.random() * 10 + 10}px`;
        heart.style.left = '0';
        heart.style.top = '0';
        heart.style.opacity = '1';
        heart.style.transform = `translateY(0) translateX(${Math.random() * 40 - 20}px)`;
        heart.style.transition = 'all 1s ease-out';
        container.appendChild(heart);

        setTimeout(() => {
          heart.style.transform = `translateY(-${Math.random() * 100 + 50}px) translateX(${Math.random() * 80 - 40}px)`;
          heart.style.opacity = '0';
        }, 50);

        setTimeout(() => {
          heart.remove();
          if (i === hearts - 1) {
            container.remove();
          }
        }, 1050);
      }, i * 100);
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-birthday-purple-light/20" id="memories">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="inline-block mb-4 rounded-full px-4 py-1.5 text-sm border border-birthday-pink-light/30 text-birthday-pink bg-birthday-pink/5 backdrop-blur-sm">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" fill="#FF84B7" /> Cerita Cinta Kita <Heart className="w-3 h-3" fill="#FF84B7" />
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-dancing mb-2 text-center text-birthday-pink reveal-animation">
            Kenangan Indah Kita
          </h2>
          
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12 reveal-animation">
            Setiap momen bersamamu adalah kenangan yang berharga. Mari kita kenang beberapa momen spesial kita.
          </p>
        </motion.div>
        
        <div 
          ref={galleryRef} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 40px -15px rgba(255,132,183,0.3)",
              }}
              onHoverStart={() => setHoverIndex(index)}
              onHoverEnd={() => setHoverIndex(null)}
              className="memory-card glass-card rounded-xl overflow-hidden cursor-pointer relative"
              onClick={() => setSelectedImage(index)}
            >
              <Card className="border-2 border-transparent hover:border-birthday-pink/30 transition-all duration-300 overflow-hidden bg-white/80 backdrop-blur-sm">
                <div className="relative aspect-[4/3] overflow-hidden photo-zoom">
                  <img 
                    src={image.src} 
                    alt={`Memory ${index + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  
                  {hoverIndex === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 pointer-events-none"
                    >
                      {[...Array(10)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ 
                            x: Math.random() * 100 - 50,
                            y: Math.random() * 100 - 50,
                            opacity: 0,
                            scale: 0
                          }}
                          animate={{ 
                            x: Math.random() * 200 - 100,
                            y: Math.random() * 200 - 100,
                            opacity: [0, 1, 0],
                            scale: [0, Math.random() * 0.8 + 0.2, 0]
                          }}
                          transition={{ 
                            duration: Math.random() * 2 + 1,
                            delay: Math.random() * 0.5,
                            repeat: Infinity,
                            repeatType: "loop"
                          }}
                          className="absolute left-1/2 top-1/2 text-birthday-pink"
                          style={{ transform: 'translate(-50%, -50%)' }}
                        >
                          <Heart fill="#FF84B7" size={Math.random() * 12 + 8} />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4"
                  >
                    <div className="w-full flex justify-between items-center">
                      <motion.p 
                        className="text-white text-sm"
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        Klik untuk memperbesar
                      </motion.p>
                      
                      <motion.div 
                        className="flex gap-2"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-birthday-pink"
                          onClick={(e) => toggleLike(index, e)}
                        >
                          <Heart className="w-4 h-4" fill={likedImages.has(index) ? "#FF84B7" : "none"} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-birthday-purple"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2 text-xs text-birthday-pink">
                    <Calendar size={12} />
                    <span>Momen Indah</span>
                  </div>
                  <p className="text-gray-700 text-sm md:text-base">{image.description}</p>
                </CardContent>
                
                {likedImages.has(index) && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute top-2 right-2 bg-birthday-pink text-white rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    <Heart className="w-4 h-4" fill="white" />
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ 
                    x: Math.random() * window.innerWidth, 
                    y: window.innerHeight + 50,
                    opacity: Math.random() * 0.7 + 0.3,
                    scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={{ 
                    y: -100, 
                    rotate: Math.random() * 360 
                  }}
                  transition={{ 
                    duration: Math.random() * 20 + 15, 
                    repeat: Infinity, 
                    delay: Math.random() * 5 
                  }}
                >
                  <Heart 
                    size={Math.random() * 30 + 10} 
                    fill={Math.random() > 0.5 ? "#FF84B7" : "#B892FF"} 
                    className="text-birthday-pink/40" 
                  />
                </motion.div>
              ))}
            </div>
            
            <motion.div
              className="absolute top-4 right-4 z-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <button 
                className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={images[selectedImage].src} 
                alt={`Full size memory ${selectedImage + 1}`} 
                className="w-full h-full object-contain max-h-[80vh] rounded-lg"
              />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 rounded-b-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-white flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      onClick={() => setShowText(!showText)}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{showText ? "Sembunyikan Cerita" : "Lihat Cerita"}</span>
                    </motion.button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={16} 
                          className="text-birthday-gold" 
                          fill="#FFD700" 
                        />
                      ))}
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-white flex items-center gap-2 p-2 rounded-full bg-birthday-pink/80 hover:bg-birthday-pink transition-colors"
                      onClick={(e) => toggleLike(selectedImage, e)}
                    >
                      <Heart className="w-4 h-4" fill={likedImages.has(selectedImage) ? "white" : "none"} />
                    </motion.button>
                  </div>
                </div>
                
                <AnimatePresence>
                  {showText && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 text-white"
                    >
                      <p className="text-lg mb-2 font-dancing text-birthday-pink">Cerita Cinta Kita</p>
                      <p className="text-sm leading-relaxed">{images[selectedImage].description}</p>
                      <p className="text-sm leading-relaxed mt-2">
                        Momen ini sangat berharga untukku. Setiap kali aku melihat foto ini, 
                        aku selalu ingat betapa indahnya hari itu bersamamu, dan betapa beruntungnya 
                        aku memilikimu dalam hidupku. Cinta kita seperti bintang di langit, selalu bersinar terang 
                        meski dalam kegelapan.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
            
            <div className="absolute inset-x-0 flex justify-between px-4">
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 0.7, x: 0 }}
                whileHover={{ opacity: 1, scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 0.7, x: 0 }}
                whileHover={{ opacity: 1, scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MemoryGallery;
