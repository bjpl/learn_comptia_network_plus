import React from 'react';

export const KeyConcepts: React.FC = () => {
  return (
    <div className="rounded-lg border border-blue-500/30 bg-slate-800 p-6 shadow-xl">
      <h3 className="mb-4 text-lg font-semibold text-blue-300">Key Concepts</h3>
      <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
        <div>
          <h4 className="mb-2 font-semibold text-white">Attenuation</h4>
          <p className="mb-2 text-gray-300">
            Loss of signal strength as it travels through the transmission medium, measured in
            decibels (dB). Higher frequencies experience greater attenuation.
          </p>
          <p className="italic text-blue-300">Formula: Loss (dB) = (dB/100m) × (Distance/100m)</p>
        </div>

        <div>
          <h4 className="mb-2 font-semibold text-white">SNR (Signal-to-Noise Ratio)</h4>
          <p className="mb-2 text-gray-300">
            Ratio of signal power to noise power, measured in dB. Higher SNR means clearer signal
            and better data integrity. Minimum 10dB recommended.
          </p>
          <p className="italic text-blue-300">Formula: SNR (dB) = Signal - Noise</p>
        </div>

        <div>
          <h4 className="mb-2 font-semibold text-white">NEXT (Near-End Crosstalk)</h4>
          <p className="mb-2 text-gray-300">
            Interference between wire pairs at the transmitting end. Higher NEXT values (in dB)
            indicate better isolation and less crosstalk.
          </p>
          <p className="italic text-blue-300">Cat6a typical: 50.3dB @ 100MHz</p>
        </div>

        <div>
          <h4 className="mb-2 font-semibold text-white">FEXT (Far-End Crosstalk)</h4>
          <p className="mb-2 text-gray-300">
            Interference between wire pairs at the receiving end. Generally less problematic than
            NEXT due to signal attenuation over distance.
          </p>
          <p className="italic text-blue-300">Typically 10-15dB lower than NEXT</p>
        </div>

        <div>
          <h4 className="mb-2 font-semibold text-white">Eye Diagram</h4>
          <p className="mb-2 text-gray-300">
            Oscilloscope display showing digital signal quality. The "eye opening" represents
            timing margins and voltage levels. Larger opening = better signal integrity.
          </p>
        </div>

        <div>
          <h4 className="mb-2 font-semibold text-white">EMI/RFI Interference</h4>
          <p className="mb-2 text-gray-300">
            Electromagnetic (EMI) and Radio Frequency (RFI) interference from external sources.
            Shielded cables (STP, FTP) provide better protection than UTP.
          </p>
        </div>
      </div>
    </div>
  );
};
