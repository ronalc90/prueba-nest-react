import { useState } from 'react';

interface DiversityGaugeProps {
  percentage: number;
  uniqueDomains: number;
  totalStudents: number;
}

export const DiversityGauge = ({
  percentage,
  uniqueDomains,
  totalStudents,
}: DiversityGaugeProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Calcular el ángulo para la aguja: 0% = -90deg (izquierda), 100% = 90deg (derecha)
  const rotation = (percentage / 100) * 180 - 90;

  // Calcular el ángulo para el conic-gradient
  const gradientAngle = 90 + (percentage / 100) * 180;

  return (
    <div className="relative inline-block">
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Contenedor del gauge */}
        <div className="flex justify-center items-center py-8">
          <div style={{ position: 'relative', width: '200px', height: '100px' }}>
            {/* Semicírculo base con gradiente */}
            <div
              style={{
                position: 'relative',
                width: '200px',
                height: '100px',
                background: 'linear-gradient(to right, #c0392b 0%, #f1c40f 50%, #1abc9c 100%)',
                borderRadius: '200px 200px 0 0',
                overflow: 'hidden',
              }}
            >
              {/* Centro blanco (efecto donut) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '140px',
                  height: '70px',
                  background: '#fff',
                  borderRadius: '140px 140px 0 0',
                  zIndex: 2,
                }}
              />

              {/* Capa blanca que cubre la parte no alcanzada */}
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '200px',
                  height: '100px',
                  background: `conic-gradient(from 180deg at 50% 100%,
                    transparent 0deg,
                    transparent ${gradientAngle}deg,
                    #ffffff ${gradientAngle}deg,
                    #ffffff 180deg)`,
                  borderRadius: '200px 200px 0 0',
                  zIndex: 1,
                }}
              />
            </div>

            {/* Indicador/aguja */}
            <div
              style={{
                position: 'absolute',
                bottom: '0',
                left: '50%',
                width: '3px',
                height: '80px',
                background: '#333',
                transformOrigin: 'bottom center',
                transform: `translateX(-50%) rotate(${rotation}deg)`,
                transition: 'transform 0.6s ease-in-out',
                zIndex: 3,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '0',
                  height: '0',
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderBottom: '10px solid #333',
                }}
              />
            </div>

            {/* Punto central */}
            <div
              style={{
                position: 'absolute',
                bottom: '-5px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '10px',
                height: '10px',
                background: '#333',
                borderRadius: '50%',
                zIndex: 4,
              }}
            />
          </div>
        </div>

        {/* Texto del porcentaje */}
        <div className="text-center -mt-4">
          <span
            className="text-4xl font-bold"
            style={{
              color:
                percentage < 50
                  ? '#c0392b'
                  : percentage < 75
                    ? '#f1c40f'
                    : '#1abc9c',
            }}
          >
            {percentage.toFixed(1)}%
          </span>
          <p className="text-sm text-gray-600 mt-1">Índice de Diversidad</p>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-24 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-10 whitespace-nowrap">
          <div className="text-sm">
            <p className="font-semibold mb-1">Cálculo:</p>
            <p>
              ({uniqueDomains} dominios únicos / {totalStudents} estudiantes) ×
              100 = {percentage.toFixed(1)}%
            </p>
          </div>
          {/* Flecha del tooltip */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
};
