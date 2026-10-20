import React from "react";

export default function AuthIllustration({ className = "" }) {
  return (
    <div
      className={`relative flex items-center justify-center select-none w-full ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 540 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-[420px] xl:max-w-[460px] drop-shadow-[0_20px_35px_rgba(16,42,42,0.06)]"
      >
        <defs>
          {/* Backdrop Soft Radial Glow */}
          <radialGradient
            id="authBackdropGlow"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(260 270) rotate(90) scale(220 220)"
          >
            <stop stopColor="#EDE6D6" stopOpacity="0.8" />
            <stop offset="0.6" stopColor="#E5DFCE" stopOpacity="0.45" />
            <stop offset="1" stopColor="#E5DFCE" stopOpacity="0" />
          </radialGradient>

          {/* Leaf Gradients */}
          <linearGradient id="leafGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#437766" />
            <stop offset="100%" stopColor="#224E41" />
          </linearGradient>
          <linearGradient id="leafGradMid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6EA18E" />
            <stop offset="100%" stopColor="#3C6E5E" />
          </linearGradient>
          <linearGradient id="leafGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#96C2B2" />
            <stop offset="100%" stopColor="#5B8E7D" />
          </linearGradient>

          {/* Wallet Gradient */}
          <linearGradient id="walletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B5547" />
            <stop offset="50%" stopColor="#104E42" />
            <stop offset="100%" stopColor="#0B372F" />
          </linearGradient>

          {/* Gold Button Clasp Gradient */}
          <linearGradient id="goldButtonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE07A" />
            <stop offset="40%" stopColor="#E5A93B" />
            <stop offset="100%" stopColor="#B37817" />
          </linearGradient>

          {/* Gold Coin Gradient */}
          <linearGradient id="coinGradFront" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FED86E" />
            <stop offset="45%" stopColor="#E7B13E" />
            <stop offset="100%" stopColor="#BF841F" />
          </linearGradient>
          <linearGradient id="coinGradRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B57C17" />
            <stop offset="50%" stopColor="#E5B242" />
            <stop offset="100%" stopColor="#9E690B" />
          </linearGradient>

          {/* Paper Plane Gradient */}
          <linearGradient id="planeGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#256B5A" />
            <stop offset="100%" stopColor="#104E42" />
          </linearGradient>
          <linearGradient id="planeGradUnder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#164A3E" />
            <stop offset="100%" stopColor="#0B342B" />
          </linearGradient>

          {/* Filters for soft drop shadows */}
          <filter id="shadowWallet" x="-10%" y="-10%" width="125%" height="130%">
            <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#0D2E26" floodOpacity="0.22" />
          </filter>
          <filter id="shadowCoin" x="-15%" y="-15%" width="130%" height="135%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#7A560D" floodOpacity="0.25" />
          </filter>
          <filter id="shadowPaper" x="-10%" y="-10%" width="120%" height="125%">
            <feDropShadow dx="2" dy="8" stdDeviation="8" floodColor="#102A2A" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* 1. Large Warm Backdrop Circle */}
        <circle cx="250" cy="280" r="200" fill="url(#authBackdropGlow)" />
        <circle cx="120" cy="190" r="14" fill="#E6DFC9" fillOpacity="0.45" />
        <circle cx="430" cy="380" r="8" fill="#E6DFC9" fillOpacity="0.6" />

        {/* 2. Foliage / Botanical Leaves in the Background */}
        <g id="botanicalLeaves">
          {/* Main Leaf Stem */}
          <path
            d="M125 350 C120 280 100 230 75 160"
            stroke="#2B5B4D"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Left top large leaf */}
          <path
            d="M80 185 C60 145 70 95 105 85 C115 125 105 170 80 185 Z"
            fill="url(#leafGradLight)"
          />
          {/* Vein */}
          <path d="M82 180 C88 150 96 120 103 90" stroke="#7BA999" strokeWidth="1.5" strokeLinecap="round" />

          {/* Left middle leaf */}
          <path
            d="M98 250 C65 230 45 190 65 160 C90 175 105 215 98 250 Z"
            fill="url(#leafGradMid)"
          />
          <path d="M96 244 C88 220 75 195 68 165" stroke="#4F8171" strokeWidth="1.5" strokeLinecap="round" />

          {/* Right upper leaf */}
          <path
            d="M102 200 C125 170 155 170 170 195 C150 220 120 225 102 200 Z"
            fill="url(#leafGradDark)"
          />
          <path d="M106 203 C125 195 145 192 165 195" stroke="#3D6E60" strokeWidth="1.5" strokeLinecap="round" />

          {/* Lower leaf accent */}
          <path
            d="M115 285 C85 285 70 260 85 240 C110 250 120 270 115 285 Z"
            fill="url(#leafGradMid)"
          />
        </g>

        {/* 3. Statement / Financial Report Sheet */}
        <g id="statementSheet" filter="url(#shadowPaper)">
          {/* Card body */}
          <rect
            x="145"
            y="190"
            width="175"
            height="185"
            rx="22"
            transform="rotate(6 145 190)"
            fill="#FFFFFF"
            stroke="#E7E3D4"
            strokeWidth="2.5"
          />

          {/* Content lines inside sheet */}
          <g transform="rotate(6 145 190)">
            <rect x="175" y="215" width="60" height="7" rx="3.5" fill="#EAE5D6" />
            <rect x="175" y="230" width="85" height="5" rx="2.5" fill="#F0ECE0" />

            {/* Small Column Chart inside statement */}
            <rect x="180" y="280" width="16" height="35" rx="4" fill="#2E7D6B" />
            <rect x="204" y="260" width="16" height="55" rx="4" fill="#2E7D6B" />
            <rect x="228" y="272" width="16" height="43" rx="4" fill="#4AA08E" />
          </g>
        </g>

        {/* 4. Deep Forest Green Leather Wallet */}
        <g id="leatherWallet" filter="url(#shadowWallet)">
          {/* Wallet Base Body */}
          <rect
            x="48"
            y="285"
            width="170"
            height="115"
            rx="18"
            fill="url(#walletGrad)"
            stroke="#1B5E50"
            strokeWidth="1.5"
          />

          {/* Top Layer Flap */}
          <path
            d="M48 298 C48 288 56 280 66 280 L180 280 C190 280 198 288 198 298 L198 335 C198 348 188 358 175 358 L71 358 C58 358 48 348 48 335 Z"
            fill="#0F4439"
          />

          {/* Wallet stitching detail */}
          <path
            d="M56 300 L56 390 C56 394 60 398 64 398 L202 398"
            stroke="#1D6555"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            fill="none"
          />

          {/* Golden Button Clasp */}
          <circle cx="172" cy="336" r="14" fill="url(#goldButtonGrad)" stroke="#B37817" strokeWidth="1" />
          <circle cx="172" cy="336" r="9" fill="#E8AE3F" />
          <circle cx="170" cy="334" r="3.5" fill="#FFF2B8" fillOpacity="0.8" />
        </g>

        {/* 5. Stack of Golden Rupee Coins */}
        <g id="coinStack">
          {/* Coin 1 (bottom left) */}
          <ellipse cx="215" cy="392" rx="36" ry="12" fill="url(#coinGradRim)" />
          <rect x="179" y="380" width="72" height="12" fill="url(#coinGradRim)" />
          <ellipse cx="215" cy="380" rx="36" ry="12" fill="url(#coinGradFront)" stroke="#FEE18B" strokeWidth="1" />

          {/* Coin 2 (middle left) */}
          <ellipse cx="215" cy="374" rx="36" ry="12" fill="url(#coinGradRim)" />
          <rect x="179" y="362" width="72" height="12" fill="url(#coinGradRim)" />
          <ellipse cx="215" cy="362" rx="36" ry="12" fill="url(#coinGradFront)" stroke="#FEE18B" strokeWidth="1" />

          {/* Coin 3 (top left) */}
          <ellipse cx="215" cy="356" rx="36" ry="12" fill="url(#coinGradRim)" />
          <rect x="179" y="344" width="72" height="12" fill="url(#coinGradRim)" />
          <ellipse cx="215" cy="344" rx="36" ry="12" fill="url(#coinGradFront)" stroke="#FEE18B" strokeWidth="1" />

          {/* Foremost Large Coin with Rupee (₹) Symbol */}
          <g filter="url(#shadowCoin)">
            {/* 3D Coin Edge */}
            <circle cx="258" cy="378" r="42" fill="url(#coinGradRim)" />
            {/* Front Face */}
            <circle cx="254" cy="374" r="41" fill="url(#coinGradFront)" stroke="#FFF1B8" strokeWidth="1.5" />
            <circle cx="254" cy="374" r="36" fill="none" stroke="#D39726" strokeWidth="1.5" strokeDasharray="3 2" />

            {/* Rupee Symbol ₹ */}
            <text
              x="254"
              y="384"
              textAnchor="middle"
              fontFamily="sans-serif"
              fontSize="30"
              fontWeight="bold"
              fill="#7A4F06"
              style={{ userSelect: "none" }}
            >
              ₹
            </text>
          </g>

          {/* Decorative small mint leaf near coins */}
          <path
            d="M272 408 C295 400 315 365 308 340 C285 360 270 390 272 408 Z"
            fill="url(#leafGradLight)"
          />
        </g>

        {/* 6. Origami Paper Airplane Soaring Upwards */}
        <g id="paperAirplane">
          {/* Flight Path Dotted Line */}
          <path
            d="M210 280 C260 250 330 220 380 160"
            stroke="#8E9B95"
            strokeWidth="2"
            strokeDasharray="4 6"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />

          {/* Airplane Body */}
          <g transform="translate(365, 125) rotate(-15)">
            {/* Shadow under plane */}
            <polygon points="10,25 65,5 30,35" fill="#0A2821" opacity="0.15" />
            {/* Under Wing Fold */}
            <polygon points="5,22 60,0 28,15" fill="url(#planeGradUnder)" />
            {/* Main Top Wing */}
            <polygon points="5,22 60,0 25,32" fill="url(#planeGradMain)" stroke="#1B5547" strokeWidth="0.8" />
            {/* Center Fold Crease */}
            <polygon points="28,15 60,0 25,32" fill="#1C6554" />
          </g>
        </g>
      </svg>
    </div>
  );
}
