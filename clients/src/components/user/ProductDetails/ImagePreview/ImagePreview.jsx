import React, { useState } from 'react'
import _ from "lodash"

const ImagePreview = ({product}) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const handleMouseMove = (e) => {
        _.throttle(()=>{
          if (!isZoomed) return;
          const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - left) / width) * 100;
          const y = ((e.clientY - top) / height) * 100;
          setZoomPosition({ x, y });
        }, 100)
        
    };
    
    return (
        <div className="space-y-4">
            <div 
            className="relative h-96 overflow-hidden bg-gray-100 cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            >
                <img
                    src={product.images && product.images[selectedImage]}
                    alt={product.name && product.name}
                    className={`w-full h-full object-cover transition-transform duration-200 aspect-w-9 aspect-h-16 ${
                    isZoomed ? 'scale-150' : 'scale-100'
                    }`}
                    style={{
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                    }}
                />
                </div>
                <div className="flex gap-4">
                {product.images && product.images.map((image, index) => (
                    <button
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 border-2 ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'}`}
                    >
                    <img src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    )
}

export default ImagePreview
