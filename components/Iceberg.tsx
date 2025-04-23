'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useI18n } from '@/context/i18n-context';

export const Iceberg = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { messages } = useI18n();
  
  return (
    <div className="relative w-full min-h-[500px] h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden select-none">
      {/* Water Line */}
      <div className="absolute top-[60%] left-0 w-full h-[1px] bg-[#52ddeb]/10" />

      {/* Water Overlay */}
      <div className="absolute inset-0 top-[32%] bg-[#0E4E58FF]/40 backdrop-blur-[5px] z-30" />

      {/* Centered Iceberg */}
      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-6 lg:p-8 z-20">
        <motion.div
          key="iceberg-container"
          className="relative w-[280px] sm:w-[380px] md:w-[480px] lg:w-[580px] aspect-[1.075/1]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{
            scale: isHovered ? 1.01 : 1,
            filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <motion.svg
            key="iceberg-svg"
            viewBox="0 0 841 782"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full relative z-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            style={{ 
              filter: 'drop-shadow(0 0 20px rgba(82, 221, 235, 0.2))',
              transformOrigin: 'center'
            }}
          >
            {/* Main Iceberg Shape */}
            <motion.path
              key="path-main"
              d="M40.4035 454.848L3.26894 390.946C0.581459 386.321 0.227247 380.702 2.3128 375.776L41.6743 282.815C43.5146 278.469 47.0792 275.083 51.5146 273.469L124.362 246.955C126.812 246.064 129.024 244.621 130.827 242.738L238.389 130.4L273.558 102.4L325.5 55.5L389.406 4.46125C395.604 -0.488801 404.401 -0.494707 410.606 4.44701L451.852 37.2977C454.861 39.6948 458.595 41 462.443 41H523.276C527.596 41 531.754 42.6443 534.905 45.5989L640.477 144.591C642.034 146.051 643.302 147.79 644.215 149.72L686.76 239.617C688.581 243.465 691.78 246.49 695.723 248.093L800.34 290.631C803.187 291.789 805.667 293.696 807.516 296.151L836.323 334.392C840.203 339.543 840.835 346.448 837.952 352.218L784.116 459.986C783.448 461.323 782.606 462.566 781.613 463.683L690.748 565.899C689.979 566.764 689.124 567.548 688.196 568.24L593.49 638.763C590.997 640.619 589.062 643.122 587.892 646.001L565.766 700.488C564.931 702.543 563.703 704.414 562.15 705.998L493.134 776.341C487.587 781.994 478.871 783.068 472.118 778.931L352.975 705.939C350.472 704.406 348.409 702.251 346.986 699.684L274.485 568.871C273.869 567.761 273.131 566.722 272.284 565.776L202.809 488.14C200.128 485.144 196.472 483.195 192.49 482.64L52.7528 463.143C47.5807 462.421 43.0273 459.363 40.4035 454.848Z"
              fill="#52DEEBC6"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="cursor-pointer hover:fill-[#52ddeb]/90 transition-colors duration-300"
            />
          </motion.svg>
        </motion.div>
      </div>

      {/* Labels Container */}
      <div className="absolute inset-0 pointer-events-none z-40">
        <div className="relative w-[280px] sm:w-[380px] md:w-[480px] lg:w-[580px] aspect-[1.075/1] mx-auto mt-[13vh] md:mt-[15vh] lg:mt-[17vh]">
          {/* Top Label */}
          <motion.div 
            key="label-top"
            className="absolute -left-2 sm:-left-16 md:-left-10 lg:-left-34 flex items-center gap-2"
            initial={{ opacity: 0, scale: 0.96, y: 5 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.96,
              y: isHovered ? 0 : 5
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="rounded-md bg-black/20 backdrop-blur-sm px-2.5 py-1.5 shadow-xl">
              <span className="text-white text-[11px] sm:text-xs md:text-sm font-medium whitespace-nowrap tracking-wide">
                {messages.iceberg.logo}
              </span>
            </div>
            <motion.div 
              key="line-top"
              className="h-[1px] w-4 sm:w-8 md:w-10 lg:w-12 bg-gradient-to-r from-[#52ddeb]/30 to-transparent" 
            />
          </motion.div>

          {/* Bottom Label */}
          <motion.div 
            key="label-bottom"
            className="absolute -right-4 sm:-right-16 md:-right-20 lg:-right-24 bottom-[20%] flex items-center gap-2"
            initial={{ opacity: 0, scale: 0.96, y: 5 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.96,
              y: isHovered ? 0 : 5
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <motion.div 
              key="line-bottom"
              className="h-[1px] w-4 sm:w-8 md:w-10 lg:w-12 bg-gradient-to-l from-[#52ddeb]/30 to-transparent" 
            />
            <div className="rounded-md bg-black/20 backdrop-blur-sm px-2.5 py-1.5 shadow-xl">
              <div className="text-left">
                <div className="text-white text-[11px] sm:text-xs md:text-sm font-medium whitespace-nowrap tracking-wide">
                  • {messages.iceberg.visualIdentity} <br />
                  • {messages.iceberg.branding} <br />
                  • {messages.iceberg.manifesto} <br />
                  • {messages.iceberg.positioning} <br />
                  • {messages.iceberg.graphicMaterials}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 